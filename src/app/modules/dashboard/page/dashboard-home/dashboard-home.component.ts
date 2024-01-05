import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit {

  public productList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productsService.getAllProducts()
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productList = response;
          console.log('dados dos produtos', this.productList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500
        })
      }
    });
  }

}
