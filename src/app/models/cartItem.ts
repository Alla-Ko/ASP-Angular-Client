// models/cart-item.ts
import { Product } from './product';  // Імпортуємо модель продукту

export interface CartItem {
  product: Product;  // Зв'язуємо з продуктом
  quantity: number;   // Кількість товару
}