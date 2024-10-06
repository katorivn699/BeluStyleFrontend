import ProductList from "../components/lists/ProductList";
import MainLayout from "../layouts/MainLayout";
import products from "../DataDemo/DataDemo";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import bg from "../assets/images/bg.svg";
import { Link } from "react-router-dom";
import ProductFilter from "../components/filters/ProductFilter"; 

export function Shop() {
  const [itemOffset, setItemOffset] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products); 
  const itemsPerPage = 9;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);

    window.scrollTo({
      top: 2,
      behavior: "smooth",
    });
  };

  const handleFilterChange = (filter) => {
    const filtered = products.filter((product) => {
      const matchesCategory = filter.category === "" || product.category === filter.category;
  
      const matchesPrice =
        product.productPrice >= filter.priceRange[0] &&
        product.productPrice <= filter.priceRange[1];
  
      const matchesRating =
        filter.rating.length === 0 || product.averageRating >= Math.min(...filter.rating);
  
      return matchesCategory && matchesPrice && matchesRating;
    });
  
    setFilteredProducts(filtered);
    setItemOffset(0);
  };
  
  useEffect(() => {
    setItemOffset(0); 
  }, [filteredProducts]);

  const countProduct = Object.keys(products).length;

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
        <div className="bg-slate-500 h-10"></div>
        <div className="numberProducts pl-16 pt-10">
          <p className="font-montserrat font-semibold text-3xl" >New({countProduct})</p>
        </div>
        <div className="grid grid-cols-12 gap-4 pt-10">
          {/* Filter Sidebar */}
          <div className="col-span-3 px-12">
            <ProductFilter
              categories={["Tops", "Pants", "Shoes", "Accessories"]}
              onFilterChange={handleFilterChange}
            />
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
