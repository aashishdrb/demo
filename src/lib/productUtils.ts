import { Product } from './db';

export function getProductSizeDetails(product: Product, selectedSize: string) {
  if (product && product.sizes && product.sizes.length > 0) {
    const sizeOpt = product.sizes.find(s => s.label === selectedSize || s.id === selectedSize);
    if (sizeOpt) {
      return {
        price: sizeOpt.price,
        discount_price: sizeOpt.discount_price || sizeOpt.price,
        stock: sizeOpt.stock
      };
    }
  }
  return {
    price: product ? product.price : 0,
    discount_price: (product && product.discount_price) ? product.discount_price : (product ? product.price : 0),
    stock: product ? product.stock : 0
  };
}
