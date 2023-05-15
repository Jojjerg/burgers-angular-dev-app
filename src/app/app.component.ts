import { FormBuilder, Validators } from '@angular/forms';

import { AppService } from './app.service';
import { Component } from '@angular/core';
import { IProduct } from './interfaces/IProduct';
import { IProductOrder } from './interfaces/IProductOrder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currency = '$';

  form = this.formBuilder.group({
    order: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  products: IProduct[] = [];

  constructor(private formBuilder: FormBuilder, private appService: AppService) {}

  ngOnInit() {
    this.appService.getProducts()
      .subscribe((product: IProduct[]) => (this.products = product));
  }

  scrollTo(target: HTMLElement, productOrder?: IProductOrder) {
    target.scrollIntoView({
      behavior: 'smooth',
    });

    if (productOrder) {
      this.form.patchValue({
        order: productOrder.title + ' (' + productOrder.price + ' ' + this.currency + ')',
      });
    }
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.form.reset();
        },
        error: (response: any) => {
          alert(response.error.message);
        },
      });
    }
  }

  changeCurrency() {
    let newCurrency = '$';
    let coefficient = 1;

    switch (this.currency) {
      case '$': {
        newCurrency = '₽';
        coefficient = 80;
        break;
      }
      case '₽': {
        newCurrency = 'BYN';
        coefficient = 3;
        break;
      }
      case 'BYN': {
        newCurrency = '€';
        coefficient = 0.9;
        break;
      }
      case '€': {
        newCurrency = '¥';
        coefficient = 6.9;
        break;
      }
    }

    this.currency = newCurrency;

    this.products.forEach((product: IProduct) => {
      product.price = +(product.basePrice * coefficient).toFixed(1);
    });
  }
}
