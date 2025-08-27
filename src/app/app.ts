import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CARDS } from './cards';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Card {
  name: string;
  position: number;
}

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Drag and drop - Angular');

  private fb = inject(FormBuilder);

  cards: Card[] = CARDS;
  selectedCard: Card | null = null;
  positionForm!: FormGroup;

  openUpdateModal(card: Card) {
    this.selectedCard = { ...card };
    console.log(this.selectedCard)

    this.positionForm = this.fb.group({
      position: [card.position, [
        Validators.required, 
        Validators.min(1), 
        Validators.max(this.cards.length)
      ]]
    });
  }

  closeModal() {
    this.selectedCard = null;
  }

  savePosition() {
    if (!this.selectedCard || !this.positionForm.valid) return;

    const newPosition = this.positionForm.value.position;
    const oldIndex = this.cards.findIndex(c => c.name === this.selectedCard!.name);
    const card = this.cards.splice(oldIndex, 1)[0];

    const newIndex = Math.min(Math.max(newPosition - 1, 0), this.cards.length);
    this.cards.splice(newIndex, 0, card);

    // Mettre à jour les positions
    this.cards = this.cards.map((c, i) => ({ ...c, position: i + 1 }));

    this.closeModal();
  }
}
