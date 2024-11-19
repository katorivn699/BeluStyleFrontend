import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getProductList } from "../../service/ShopService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Fetch products initially
    fetchProducts();

    // Set up auto-refresh every 30 seconds (adjust the interval as needed)
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000); // Refresh every 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
