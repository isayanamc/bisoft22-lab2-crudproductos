// Roles de realm que vienen de Keycloak
export const ROL_ADMIN = 'SUPER-ADMIN-ROLE';
export const ROL_USER = 'USER';
// Lo que se manda a POST /api/v1/auth/login
export interface LoginRequest {
  username: string;
  password: string;
}

// Lo que responde el login
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
// Lo que se manda a POST /api/v1/auth/registro
// No lleva rol: la API siempre crea el usuario como USER
export interface RegistroRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
// Leemos del payload del JWT
export interface TokenPayload {
  exp: number;
  preferred_username: string; // "admin", "usuario"...
  given_name?: string;
  realm_access?: { roles: string[] }; // SUPER-ADMIN-ROLE o USER
}
