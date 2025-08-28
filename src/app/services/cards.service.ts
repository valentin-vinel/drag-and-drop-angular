import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private http = inject(HttpClient);
  private BASE_URL = 'http://localhost:5002/'

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.BASE_URL + 'cards').pipe(
      tap((response: Card[]) => this.log(response)),
      catchError((error: Error) => this.handleError(error, null))
    )
  }

  update(card: Card): Observable<Card> {
		return this.http.patch<Card>(this.BASE_URL + 'cards/' + card.id, card).pipe(
			tap((response: Card) => this.log(response)),
      catchError((error: Error) => this.handleError(error, null))
		);
	}

  reorder(payload: { id: number; position: number }[]): Observable<Card[]> {
    return this.http.put<Card[]>(this.BASE_URL + "cards/reorder", payload);
  }

  private log(response: any) {
    console.table(response);
  }

  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
}
