export interface Category {
  categoryId: number;
  name: string;
  parentCategoryId?: number;
  subCategories: Category[];
  type: number;
}
