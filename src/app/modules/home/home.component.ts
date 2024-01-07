import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRquest';
import { UserService } from 'src/app/services/user/user.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private destroy$ = new Subject<void>();
  loginCard: boolean = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(takeUntil(this.destroy$)) // evitar memory leak
      .subscribe({
        next: (response) => {
          if (response) {
            // adiciona o token jwt a um cookie
            // operador optional chaining (?) usado para não executar o que vem posteriormente
            // ao operador, caso ele seja undefined ou null. Evita erros the uncaught property
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem-vindo de volta ${response?.name}`,
              life: 5000
            })
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao fazer login!',
            life: 5000
          })
          console.log(err)
        }
      })
    }
  }

  onSubmitSignupForm(): void {
    // se o formulário está válido
    if (this.signupForm.value && this.signupForm.valid) {
      // faz um cast dos dados do formulário para o tipo SignupUserRequest
      this.userService.signupUser(this.signupForm.value as SignupUserRequest)
      .pipe(takeUntil(this.destroy$)) // evitar memory leak
      .subscribe({
        // callback de sucesso
        next: (response) => {
          if (response) {
            // limpa o formulário
            this.signupForm.reset();
            // muda para o formulário de login
            this.loginCard = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso!',
              life: 5000
            });
          }
        },
        // callback caso ocorra algum erro
        error: (err) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erro',
            detail: 'Erro ao criar usuário!',
            life: 5000
          });
          console.log(err)
        }
      });
    }
  }

  // desinscrevendo do observable com takeuntil
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
