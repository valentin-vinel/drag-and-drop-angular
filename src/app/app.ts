import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from './models/card.model';
import { CardsService } from './services/cards.service';
import { forkJoin } from 'rxjs';

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

  openCardModal(card: Card) {
    this.selectedCard = { ...card };

    this.formGroup.patchValue({
      position: this.selectedCard.position
    });

    this.showModal = true;
  }

  savePosition() {
    // Vérifier qu’une carte est sélectionnée et que le formulaire est valide
    if (!this.selectedCard || this.formGroup.invalid) return;

    const newPosition = this.formGroup.value.position!;
    const oldPosition = this.selectedCard.position;

    // Clone du tableau actuel pour travailler dessus
    const after = [...this.cardList()];

    // Étape 1 : recalculer localement les positions des autres cartes
    after.forEach(c => {
      if (c.id === this.selectedCard!.id) return; // ignorer la carte déplacée

      // Si déplacement vers le bas : les cartes intermédiaires diminue de pod
      if (oldPosition < newPosition && c.position > oldPosition && c.position <= newPosition) {
        c.position -= 1;
      }

      // Si déplacement vers le haut : les cartes intermédiaires augmente de pos
      if (oldPosition > newPosition && c.position < oldPosition && c.position >= newPosition) {
        c.position += 1;
      }
    });

    // Appliquer la nouvelle position à la carte déplacée
    const movedIndex = after.findIndex(c => c.id === this.selectedCard!.id);
    if (movedIndex !== -1) {
      after[movedIndex] = { ...this.selectedCard, position: newPosition };
    }

    // ✅ Créer le payload : toutes les cartes dont la position a changé
    const payload = after.map(c => ({ id: c.id, position: c.position }));

    // Appel unique au backend
    this.cardService.reorder(payload).subscribe({
      next: (updatedCards) => {
        // Mettre à jour le signal avec les cartes renvoyées par le backend
        const map = new Map(updatedCards.map(c => [c.id, c]));
        const merged = after.map(c => map.get(c.id) ?? c);
        this.cardList.set(merged.sort((a, b) => a.position - b.position));

        this.closeModal();
      },
      error: (err) => console.error('Erreur lors du reorder', err),
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedCard = null;
  }

}
