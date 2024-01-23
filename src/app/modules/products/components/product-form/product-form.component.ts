import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public categoryList: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  // o ! indica que vai inicializar com vazio
  // vamos receber esses dados do product-home.component
  public productAction!: {
    event: EventAction;
    productList: Array<GetAllProductsResponse>;
  };
  public productSelected!: GetAllProductsResponse;
  public productData: Array<GetAllProductsResponse> = [];

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private form: FormBuilder,
    private message: MessageService,
    private router: Router,
    private ref: DynamicDialogConfig
  ) {}

  // cria o formulário para cadastro de produtos
  // addProductForm é referenciado propriedade formGroup da tag <form>
  // da página, via property binding
  public addProductForm = this.form.group({
    // as propriedades do formGroup são vinculadas aos inputs do formulário
    // através da propriedade formControlName
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.form.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required]
  });

  ngOnInit(): void {
    this.productAction = this.ref.data;
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.categoryList = response;
        }
      }
    })
  }

  handleSubmitAddProduct():void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }
      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto criado com sucesso!',
            life: 2500
          });
        },
        error: (err) => {
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar produto!',
            life: 2500
          })
        }
      });
    }
    // limpa o form após o cadastro
    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    // if (this.editProductForm.value && this.editProductForm.valid) {

    // }
  }

  getProductSelected(productId: string): void {
    const allProducts = this.productAction?.productList;
    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter((element) => element.id === productId)
      if (productFiltered) {
        this.productSelected = productFiltered[0];
        this.editProductForm.setValue({
          name: this.productSelected?.name,
          price: this.productSelected?.price,
          description: this.productSelected?.description,
          amount: this.productSelected?.amount,
        });
      }
    };
  }

  getProductData(): void {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productData = response;
          this.productData && this.productsDataTransferService.setProductData(this.productData);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
