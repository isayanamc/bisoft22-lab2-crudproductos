// Espejo del UsuarioDTO del backend
export interface Usuario {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  enabled: boolean;
  createdTimestamp: number | null;
  roles: string[];
}
