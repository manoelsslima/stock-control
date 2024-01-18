import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public categoryList: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];

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

  constructor(
    private categoriesService: CategoriesService,
    private form: FormBuilder,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    throw new Error('Method not implemented.');
  }

  handleSubmitAddProduct():void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
