import { createContext, useContext, useEffect, useState } from "react";
import { getProductList } from "../../service/ShopService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => { // Sửa "chilren" thành "children"
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList();
        if (response && response.length > 0) {
          const filteredProducts = response.filter(
            (product) => product.quantity > 0
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.log("Error! trycatch : " + error.message);
      }
    };

    fetchProducts();
  }, []); // Dependency array trống để tránh vòng lặp vô hạn

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
