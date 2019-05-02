import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface Customer {
  avatar: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  city: string;
  state: string;
  order_total: Number;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  hostURL = 'http://localhost:8000/api/';
  customersAPI = 'customers/';

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  getCustomers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(this.hostURL + this.customersAPI, {headers: this.headers});
  }

  getCustomersById(id): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(this.hostURL + this.customersAPI + '?id=' + id, {headers: this.headers});
  }

  addCustomers(avatar, first_name, last_name, address, email, city, state, order_total, gender) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('order_total', order_total);
    formData.append('gender', gender);
    return this.http.post(this.hostURL + this.customersAPI, formData);
  }

  editCustomers(id, avatar, first_name, last_name, address, email, city, state, order_total, gender) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('order_total', order_total);
    formData.append('gender', gender);
    console.log(id);
    return this.http.put(this.hostURL + this.customersAPI + '?id=' + id, formData);
  }

  deleteCustomer(id) {
    return this.http.delete(this.hostURL + this.customersAPI + '?id=' + id, { headers: this.headers });
  }
}
