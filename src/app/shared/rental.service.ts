import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rental } from '../module/rental.model';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class RentalService {
  readonly httpUrl = 'https://localhost:5001/api/v1/rental';

  constructor(private http: HttpClient) { }

  getRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.httpUrl}/getall`);
  }

  getRentalByMake(make: string): Observable<Rental[]> {
    const url = `${this.httpUrl}/GetByCriteria/${make}`;
    return this.http.get<Rental[]>(url);
  }

  getRentalByModel(model: string): Observable<Rental[]> {
    const url = `${this.httpUrl}/GetByCriteria/${model}`;
    return this.http.get<Rental[]>(url);
  }

}
