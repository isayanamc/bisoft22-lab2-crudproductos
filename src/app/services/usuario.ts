import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { API_URL } from '../utils/api';

@Service()
export class UsuarioService {
  private readonly http = inject(HttpClient);

  // Usuarios registrados en Keycloak con sus roles
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_URL}/usuarios`);
  }
}
