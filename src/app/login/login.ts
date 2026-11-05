import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { mensajeDeError } from '../utils/errores';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly volver = input<string>();
  readonly registrado = input<string>();

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  // El formulario: mismos campos que LoginRequestDTO
  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected invalido(campo: 'username' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  protected ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(this.destinoSeguro()),
      error: (e) => {
        this.cargando.set(false);
        this.error.set(
          (e as { status?: number }).status === 401
            ? 'Usuario o contraseña incorrectos'
            : mensajeDeError(e),
        );
      },
    });
  }

  private destinoSeguro(): string {
    const v = this.volver();
    return v && v.startsWith('/') && !v.startsWith('//') ? v : '/productos';
  }
}
