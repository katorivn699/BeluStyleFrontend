import React, { useState, useRef } from "react";
import products from "../../MockData/DataDemo";
import ProductList from "../../components/lists/ProductList";
import MainLayout from "../../layouts/MainLayout";
import bg from "../../assets/images/bg.svg";
import { Link } from "react-router-dom";
import FilterComponent from "../../components/filters/MultipleFilter";
import { Pagination } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const itemsPerPage = 9;

export function Shop() {
  const [page, setPage] = useState(1); // Manage the current page
  const productListRef = useRef(null); // Create ref for the product list container

  // Calculate currentItems and pageCount based on the current page
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Handle page change and scroll back to the product list section
  const handlePageChange = (event, value) => {
    setPage(value); // Update page state

    // Scroll to the product list section smoothly
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const countProduct = currentItems.length;

  return (
    <MainLayout>
      <div className="Shop pb-10">
        <div className="headerPage relative text-center">
          <img className="w-screen h-40 object-cover" src={bg} alt="Background" />
          <div className="headerName w-full absolute top-0 left-0 flex flex-col items-center justify-center h-full">
            <h1 className="font-poppins font-semibold text-2xl text-black">Shop</h1>
            {/* Updated Breadcrumbs */}
            <div className="breadcrumbs mt-4">
              <Breadcrumbs aria-label="breadcrumb" className="text-black">
                <Link to="/" className="font-semibold font-poppins text-black hover:text-blue-600">
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
            <FilterComponent />
          </div>

          {/* Product List */}
          <div className="col-span-9">
            <div className="col-span-1 flex flex-col items-center" ref={productListRef}>
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Shop;
