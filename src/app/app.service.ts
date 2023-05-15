import { HttpClient } from '@angular/common/http';
import { IOrder } from './interfaces/IOrder';
import { IProduct } from './interfaces/IProduct';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  sendOrder(order: IOrder) {
    return this.http.post('https://testologia.site/burgers-order', order);
  }

  getProducts() {
    return this.http.get<IProduct[]>('https://testologia.site/burgers-data?extra=black');
  }
}
