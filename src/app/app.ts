import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from './models/card.model';
import { CardsService } from './services/cards.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, CdkDropList, CdkDrag],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Drag and drop - Angular');

  private cardService = inject(CardsService)
  private fb = inject(FormBuilder);

  cardList = signal<Card[]>([]);

  selectedCard: Card | null = null;
  showModal = false;

  formGroup = this.fb.group({
    position: [this.selectedCard?.position, [
        Validators.required, 
        Validators.min(1), 
        Validators.max(16)
      ]]
  })

  ngOnInit(): void {
    // Initialiser les cartes au montage du composant
    this.cardService.getCards().subscribe(cards => {
      this.cardList.set(cards.sort((a, b) => a.position - b.position));
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    moveItemInArray(this.cardList(), event.previousIndex, event.currentIndex);

    this.cardList().forEach((card, index) => {
      card.position = index + 1;
      console.log(card.id, card.position)
    })

    this.cardService.reorder(this.cardList()).subscribe({
      next: () => console.log("Position sauvegardées"),
      error: (err) => console.log("Erreur de sauvegarde", err)
    })

    console.log(this.cardList())
  }

}
