import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { mensajeDeError } from '../utils/errores';

type Campo = 'username' | 'email' | 'firstName' | 'lastName' | 'password' | 'confirmacion';

function contrasenasIguales(grupo: AbstractControl): ValidationErrors | null {
  const { password, confirmacion } = grupo.value as { password: string; confirmacion: string };
  return password === confirmacion ? null : { noCoinciden: true };
}

// Registro público de usuarios. Siempre crea el usuario con rol USER
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  // Mismas reglas que RegistroRequestDTO en la API
  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9._-]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmacion: ['', Validators.required],
    },
    { validators: contrasenasIguales },
  );

  protected invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    if (campo === 'confirmacion') {
      return control.touched && (control.invalid || this.form.hasError('noCoinciden'));
    }
    return control.invalid && control.touched;
  }

  protected registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);

    const { confirmacion: _, ...datos } = this.form.getRawValue();

    this.auth.registrar(datos).subscribe({
      next: (usuario) =>
        this.router.navigate(['/login'], { queryParams: { registrado: usuario.username } }),
      error: (e) => {
        this.cargando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }
}
