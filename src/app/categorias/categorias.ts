import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from '../interfaces/categoria';
import { AuthService } from '../services/auth';
import { CategoriaService } from '../services/categoria';
import { mensajeDeError } from '../utils/errores';

@Component({
  imports: [RouterLink],
  selector: 'app-categorias',
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  protected readonly auth = inject(AuthService);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mensaje = signal<string | null>(null);

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (lista) => {
        this.categorias.set(lista);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }

  protected eliminar(categoria: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    this.error.set(null);
    this.mensaje.set(null);
    this.categoriaService.eliminar(categoria.id).subscribe({
      next: () => {
        this.categorias.update((lista) => lista.filter((c) => c.id !== categoria.id));
        this.mensaje.set(`Categoría "${categoria.nombre}" eliminada`);
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}
