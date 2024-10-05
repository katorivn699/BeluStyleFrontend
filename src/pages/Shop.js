// shop.jsx
import ProductList from "../components/lists/ProductList";
import MainLayout from "../layouts/MainLayout";
import products from "../DataDemo/DataDemo";
import { Pagination } from "flowbite-react";
import { useState } from "react";

export function Shop() {
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(offset, offset + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout>
      <div className="productshow flex flex-col">
        <div className="flex flex-col items-center">
          <ProductList products={currentItems} />
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
