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
  const [page, setPage] = useState(1); // Quản lý trang hiện tại
  const [productData, setProductData] = useState([]); // Dữ liệu sản phẩm
  const productListRef = useRef(null); // Tạo ref cho product list container
  const [filter, setFilter] = useState({
    brand: "",
    category: "",
    priceOrder: "",
    rating: 0,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList();
        if (response && response.length > 0) {
          setProductData(response); // Nếu có dữ liệu từ API, set nó
        } else {
          setProductData(products); // Nếu không có dữ liệu, sử dụng mock data
        }
      } catch (error) {
        console.log("Error! trycatch : " + error.data);
        setProductData(products); // Trong trường hợp lỗi, sử dụng mock data
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (data) => {
    setFilter(data);
    console.log(filter);
  }

  // Tính toán currentItems và pageCount dựa trên trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = productData.slice(startIndex, startIndex + itemsPerPage); // Sử dụng productData từ API hoặc mock data
  const pageCount = Math.ceil(productData.length / itemsPerPage);

  // Xử lý thay đổi trang và scroll lại đến section product list
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật page state

    // Scroll đến phần product list
    if (productListRef.current) {
      productListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const countProduct = currentItems.length;

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
            {/* Breadcrumbs */}
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
          {/* Filter Sidebar */}
          <div className="col-span-3 px-12">
            <FilterComponent
              onFilter={(filterData) => handleFilterChange(filterData)}
            />
          </div>

          {/* Product List */}
          <div className="col-span-9">
            {productData.length > 0 ? (
              <div
                className="col-span-1 flex flex-col items-center"
                ref={productListRef}
              >
                <ProductList products={currentItems} />
                <div className="paginate mt-6">
                  <Pagination
                    count={pageCount}
                    page={page} // Controlled component with the current page
                    onChange={handlePageChange} // Handle page change
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
                  Error occur loading Product!
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
