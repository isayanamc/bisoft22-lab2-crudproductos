import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria';
import { Producto, ProductoRequest } from '../interfaces/producto';
import { CategoriaService } from '../services/categoria';
import { ProductoService } from '../services/producto';
import { mensajeDeError } from '../utils/errores';

type Campo = 'nombre' | 'descripcion' | 'precio' | 'stock' | 'categoriaId';

// Un solo componente para REGISTRAR y ACTUALIZAR productos
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-producto-form',
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);

  // id de la ruta llega como texto por withComponentInputBinding
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  // Mismas reglas que ProductoDTO en la API
  protected readonly form = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', Validators.maxLength(255)],
    precio: [0, [Validators.required, Validators.min(0), Validators.max(99999999.99)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    categoriaId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    if (!this.esEdicion()) {
      this.categoriaService.listar().subscribe({
        next: (lista) => {
          this.categorias.set(lista);
          this.cargando.set(false);
        },
        error: (e) => this.fallo(e),
      });
      return;
    }

    forkJoin({
      categorias: this.categoriaService.listar(),
      producto: this.productoService.obtener(Number(this.id())),
    }).subscribe({
      next: ({ categorias, producto }) => {
        this.categorias.set(categorias);
        this.llenarFormulario(producto);
      },
      error: (e) => this.fallo(e),
    });
  }

  private llenarFormulario(p: Producto): void {
    this.form.setValue({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio: p.precio,
      stock: p.stock,
      categoriaId: p.categoriaId,
    });
    this.cargando.set(false);
  }

  protected invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: ProductoRequest = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
      precio: Number(v.precio),
      stock: Number(v.stock),
      categoriaId: v.categoriaId as number,
    };

    const peticion: Observable<Producto> = this.esEdicion()
      ? this.productoService.actualizar(Number(this.id()), datos)
      : this.productoService.crear(datos);

    this.guardando.set(true);
    this.error.set(null);
    peticion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeDeError(e));
      },
    });
  }

  private fallo(e: unknown): void {
    this.cargando.set(false);
    this.error.set(mensajeDeError(e));
  }
}
