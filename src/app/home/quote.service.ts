import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: IRandomQuoteContext) => `/jokes/random?category=${c.category}`
};

export interface IRandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  public constructor(private httpClient: HttpClient) { }

  public getRandomQuote(context: IRandomQuoteContext): Observable<string> {
    return this.httpClient
      .get(routes.quote(context))
      .pipe(
        map((body: any) => body.value),
        catchError(() => of('Error, could not load joke :-('))
      );
  }

}
