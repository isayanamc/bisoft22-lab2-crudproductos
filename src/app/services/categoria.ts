import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../interfaces/categoria';
import { API_URL } from '../utils/api';

// CRUD de /api/v1/categorias
@Service()
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  obtener(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }

  crear(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }

  actualizar(id: number, categoria: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
