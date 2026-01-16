export interface Subcategoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  activo?: boolean;
  proximo?: boolean;
  fechaEvento?: string;
}

export interface CreateSubcategoriaRequest {
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  activo?: boolean;
  proximo?: boolean;
  fechaEvento?: string;
}

export interface CreateMultipleSubcategoriasRequest {
  subcategorias: CreateSubcategoriaRequest[];
}

export interface UpdateSubcategoriaRequest extends Partial<CreateSubcategoriaRequest> {}

export interface SubcategoriaResponse {
  success: boolean;
  data: Subcategoria;
  message?: string;
}

export interface SubcategoriaListResponse {
  success: boolean;
  data: Subcategoria[];
  message?: string;
}

export interface DeleteSubcategoriaResponse {
  success: boolean;
  message: string;
}
