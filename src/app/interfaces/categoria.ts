// Espejo del CategoriaDTO del backend
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}
// Lo que se manda en POST y PUT: sin id (va en la URL)
export type CategoriaRequest = Omit<Categoria, 'id'>;
