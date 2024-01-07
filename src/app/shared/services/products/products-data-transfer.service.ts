import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  // hot observable

  // BehaviorSubject: permite obter dados anteriormente à subscrição nele

  // quando a propriedade retorna um observable,
  // é convenção a variável terminar com $
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  public productsData: Array<GetAllProductsResponse> = [];

  setProductData(products: Array<GetAllProductsResponse>): void {
    if (products) {
      // emitir a atualização de um novo dado para quem está inscrito
      this.productsDataEmitter$.next(products);
      this.getProductsData();
    }
  }

  // o take faz uma chamada e se desinscreve do observable logo em seguida. Evita memory leak
  getProductsData() {
    this.productsDataEmitter$
    .pipe(
      take(1),
      map((dado) => dado?.filter((produto) => produto.amount > 0))
    )
    .subscribe({
      next: (response) => {
        if (response) {
          this.productsData = response;
        }
      }
    });
    return this.productsData;
  }

}
