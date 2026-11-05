import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  ROL_ADMIN,
  TokenPayload,
} from '../interfaces/auth';
import { Usuario } from '../interfaces/usuario';
import { API_URL } from '../utils/api';

const LLAVE_TOKEN = 'lab2.token';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // El token actual. Arranca con el que haya guardado (si se recargó la página)
  private readonly token = signal<string | null>(leerTokenGuardado());

  // Lo que trae el token por dentro, o null si no hay sesión o ya venció
  private readonly payload = computed(() => {
    const t = this.token();
    if (!t) return null;
    const p = decodificarPayload(t);
    // exp viene en SEGUNDOS y Date.now() en MILISEGUNDOS: por eso * 1000
    return p && p.exp * 1000 > Date.now() ? p : null;
  });

  // Lo que el resto de la app consulta
  readonly autenticado = computed(() => this.payload() !== null);
  readonly username = computed(() => this.payload()?.preferred_username ?? '');
  readonly nombre = computed(() => this.payload()?.given_name || this.username());
  readonly roles = computed(() => this.payload()?.realm_access?.roles ?? []);
  readonly esAdmin = computed(() => this.roles().includes(ROL_ADMIN));

  // Token para el header Authorization
  tokenActual(): string | null {
    return this.estaVigente() ? this.token() : null;
  }

  //Revisa la expiración
  estaVigente(): boolean {
    const t = this.token();
    const p = t ? decodificarPayload(t) : null;
    return !!p && p.exp * 1000 > Date.now();
  }

  // Si sale bien guarda el token
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, credenciales)
      .pipe(tap((respuesta) => this.guardarToken(respuesta.access_token)));
  }

  // La API siempre crea el usuario con rol USER
  registrar(datos: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/auth/registro`, datos);
  }

  // Borra el token y manda al login
  logout(): void {
    this.guardarToken(null);
    this.router.navigate(['/login']);
  }

  private guardarToken(token: string | null): void {
    this.token.set(token);
    try {
      if (token) localStorage.setItem(LLAVE_TOKEN, token);
      else localStorage.removeItem(LLAVE_TOKEN);
    } catch {
      // Si el navegador bloquea localStorage, la sesión dura hasta recargar
    }
  }
}

// Funciones de apoyo

function leerTokenGuardado(): string | null {
  try {
    return localStorage.getItem(LLAVE_TOKEN);
  } catch {
    return null;
  }
}

function decodificarPayload(token: string): TokenPayload | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload;
  } catch {
    return null;
  }
}
