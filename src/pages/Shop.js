import ProductList from "../components/lists/ProductList";
import MainLayout from "../layouts/MainLayout";
import products from "../DataDemo/DataDemo";
import { useState } from "react";
import ReactPaginate from "react-paginate";

export function Shop() {
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 9;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);

    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  return (
    <MainLayout>
      <div className="productshow flex flex-col">
        <div className="flex flex-col items-center">
          <ProductList products={currentItems} />
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item join-item btn btn-square"
            pageLinkClassName="page-link join-item btn btn-square"
            previousClassName="page-item join-item btn"
            previousLinkClassName="page-link join-item btn"
            nextClassName="page-item join-item btn"
            nextLinkClassName="page-link join-item btn"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
    </MainLayout>
  );
}
