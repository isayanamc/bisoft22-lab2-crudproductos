import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../interfaces/categoria';
import { CategoriaService } from '../services/categoria';
import { mensajeDeError } from '../utils/errores';

// Un solo componente para REGISTRAR y ACTUALIZAR categorías
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css',
})
export class CategoriaForm implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // Arranca en false: al crear no hay nada que cargar
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  // Mismas reglas que CategoriaDTO en la API
  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    if (!this.esEdicion()) return;

    this.cargando.set(true);
    this.categoriaService.obtener(Number(this.id())).subscribe({
      next: (c) => {
        this.form.setValue({ nombre: c.nombre, descripcion: c.descripcion ?? '' });
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }

  protected invalido(campo: 'nombre' | 'descripcion'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: CategoriaRequest = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
    };

    const peticion: Observable<Categoria> = this.esEdicion()
      ? this.categoriaService.actualizar(Number(this.id()), datos)
      : this.categoriaService.crear(datos);

    this.guardando.set(true);
    this.error.set(null);
    peticion.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }
}
