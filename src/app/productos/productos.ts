import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../interfaces/producto';
import { AuthService } from '../services/auth';
import { ProductoService } from '../services/producto';
import { mensajeDeError } from '../utils/errores';

// USER y SUPER-ADMIN-ROLE ven la lista completa. Solo el admin: Nuevo / Editar / Eliminar
@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);
  protected readonly auth = inject(AuthService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mensaje = signal<string | null>(null);

  // Al aparecer la página, pide la lista a la API
  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (lista) => {
        this.productos.set(lista);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeDeError(e));
        this.cargando.set(false);
      },
    });
  }

  protected eliminar(producto: Producto): void {
    if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    this.error.set(null);
    this.mensaje.set(null);
    this.productoService.eliminar(producto.id).subscribe({
      next: () => {
        this.productos.update((lista) => lista.filter((p) => p.id !== producto.id));
        this.mensaje.set(`Producto "${producto.nombre}" eliminado`);
      },
      error: (e) => this.error.set(mensajeDeError(e)),
    });
  }
}
