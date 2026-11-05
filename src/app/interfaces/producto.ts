// Espejo del productoDTO del backend
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  precio: number;
  categoriaId: number;
  categoriaNombre: string | null;
}
// Lo que se manda en POST y PUT: sin id (va en la URL) ni categoriaNombre (lo pone la API)
export type ProductoRequest = Omit<Producto, 'id' | 'categoriaNombre'>;
