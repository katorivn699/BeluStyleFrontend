import React from "react";
import ProductItem from "../items/ProductItem";

const ProductList = ({ products }) => {
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 overflow-hidden">
      {products.map((product) => (
          <ProductItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
