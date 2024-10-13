import React, { useState } from "react";
import products from "../../MockData/DataDemo";
import ProductList from "../../components/lists/ProductList";
import MainLayout from "../../layouts/MainLayout";
import bg from "../../assets/images/bg.svg";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const itemsPerPage = 9;

export function Shop() {

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const countProduct = currentItems.length;

  return (
    <MainLayout>
      <div className="Shop">
        <div className="headerPage relative text-center">
          <img className="w-screen h-40 object-cover" src={bg} alt="Background" />
          <div className="headerName w-full absolute top-0 left-0 flex flex-col items-center justify-center h-full">
            <h1 className="font-poppins font-semibold text-2xl text-black">Shop</h1>
            <div className="breadcrumbs mt-4">
              <ul>
                <li className="font-semibold font-poppins text-black">
                  <Link to="/">Home</Link>
                </li>
                <li className="font-poppins text-black">Shop</li>
              </ul>
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
          </div>

          {/* Product List */}
          <div className="col-span-9">
            <div className="col-span-1 flex flex-col items-center">
              <ProductList products={currentItems} />
              <div className="paginate mt-6">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={pageCount}
                  previousLabel="Previous"
                  renderOnZeroPageCount={null}
                  pageClassName="page-item join-item btn btn-square"
                  pageLinkClassName="page-link join-item btn btn-square"
                  previousClassName="page-item join-item btn"
                  previousLinkClassName="page-link"
                  nextClassName="page-item join-item btn"
                  nextLinkClassName="page-link"
                  breakClassName="page-item join-item btn btn-square"
                  breakLinkClassName="page-link join-item btn"
                  containerClassName="pagination"
                  activeClassName="active"
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
