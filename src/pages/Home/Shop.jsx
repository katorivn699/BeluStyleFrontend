import React, { useState, useRef, useEffect } from "react";
import products from "../../MockData/DataDemo";
import ProductList from "../../components/lists/ProductList";
import MainLayout from "../../layouts/MainLayout";
import bg from "../../assets/images/bg.svg";
import { Link } from "react-router-dom";
import FilterComponent from "../../components/filters/MultipleFilter";
import { Pagination } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { getProductList } from "../../service/ShopService";

const itemsPerPage = 9;

export function Shop() {
  const [page, setPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const productListRef = useRef(null);
  const [filter, setFilter] = useState({
    brand: "",
    category: "",
    priceOrder: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList();
        if (response && response.length > 0) {
          setProductData(response);
        } else {
          setProductData(products);
        }
      } catch (error) {
        console.log("Error! trycatch : " + error.data);
        setProductData(products);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (data) => {
    setFilter(data);
    setPage(1); // Reset to first page when filters change
  };

  const applyFilters = () => {
    // Log the current filter object for debugging
    console.log(filter);

    // Filter the product data based on specified criteria
    const filteredList = productData.filter((item) => {
      // Apply brand filter
      if (filter.brand && item.brandName !== filter.brand) return false;

      // Apply category filter
      if (filter.category && item.categoryName !== filter.category) return false;

      // Apply rating filter
      if (filter.rating && item.averageRating < filter.rating) return false;

      // If all conditions are met, keep this item in the filtered list
      return true;
    });

    // Sort the filtered products by price, if needed
    return filteredList.sort((a, b) => {
      if (filter.priceOrder === "asc") return a.productPrice - b.productPrice;
      if (filter.priceOrder === "desc") return b.productPrice - a.productPrice;
      return 0;
    });
  };

  // Apply the filters and store the result in filteredProducts
  const filteredProducts = applyFilters();

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    if (productListRef.current) {
      productListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const countProduct = filteredProducts.length;

  return (
    <MainLayout>
      <div className="Shop pb-10">
        <div className="headerPage relative text-center">
          <img
            className="w-screen h-40 object-cover"
            src={bg}
            alt="Background"
          />
          <div className="headerName w-full absolute top-0 left-0 flex flex-col items-center justify-center h-full">
            <h1 className="font-poppins font-semibold text-2xl text-black">
              Shop
            </h1>
            <div className="breadcrumbs mt-4">
              <Breadcrumbs aria-label="breadcrumb" className="text-black">
                <Link
                  to="/"
                  className="font-semibold font-poppins text-black hover:text-blue-600"
                >
                  Home
                </Link>
                <Typography color="textPrimary" className="font-poppins">
                  Shop
                </Typography>
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <div className="bg-beluBlue h-28"></div>
        <div className="numberProducts pl-16 pt-10">
          <p className="font-montserrat font-semibold text-3xl">
            New({countProduct})
          </p>
        </div>
        <div className="grid grid-cols-12 gap-4 pt-10">
          <div className="col-span-4 px-12">
            <FilterComponent onFilter={handleFilterChange} />
          </div>
          <div className="col-span-8">
            {filteredProducts.length > 0 ? (
              <div
                className="col-span-1 flex flex-col items-center"
                ref={productListRef}
              >
                <ProductList products={currentItems} />
                <div className="paginate mt-6">
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                  />
                </div>
              </div>
            ) : (
              <div className="errorLoading text-center">
                <p className="font-poppins font-bold text-3xl">
                  No products available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Shop;
