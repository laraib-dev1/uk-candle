export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  category?: string;
  image?: string;
  status?: "active" | "disable";
}
