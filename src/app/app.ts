import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CARDS } from './cards';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from './models/card.model';
import { CardsService } from './services/cards.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Drag and drop - Angular');

  private cardService = inject(CardsService)

  // Initialisation de ma liste de cards
  cardList = toSignal<Card[]>(this.cardService.getCards())

  // on fait une copie modifiable
  // cards = signal<Card[]>(this.cardListSignal());

  // private fb = inject(FormBuilder);

  // selectedCard: Card | null = null;
  // positionForm!: FormGroup;

  // openUpdateModal(card: Card) {
  //   this.selectedCard = { ...card };
  //   console.log(this.selectedCard)

  //   this.positionForm = this.fb.group({
  //     position: [card.position, [
  //       Validators.required, 
  //       Validators.min(1), 
  //       Validators.max(this.cards().length)
  //     ]]
  //   });
  // }

  // closeModal() {
  //   this.selectedCard = null;
  // }

  // savePosition() {
  //   if (!this.selectedCard || !this.positionForm.valid) return;

  //   const cardsCopy = [...this.cards()];
  //   const newPosition = this.positionForm.value.position;
  //   const oldIndex = cardsCopy.findIndex(c => c.id === this.selectedCard!.id);
  //   const card = cardsCopy.splice(oldIndex, 1)[0];

  //   const newIndex = Math.min(Math.max(newPosition - 1, 0), cardsCopy.length);
  //   cardsCopy.splice(newIndex, 0, card);

  //   const updated = cardsCopy.map((c, i) => ({ ...c, position: i + 1 }));

  //   this.cards.set(updated);

  //   this.closeModal();
  // }
}
