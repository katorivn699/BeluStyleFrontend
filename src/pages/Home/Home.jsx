import MainLayout from "../../layouts/MainLayout";
import { BuyNow, ShowMore } from "../../components/buttons/Button";
import ProductList from "../../components/lists/ProductList";
import { useNavigate } from "react-router-dom";
import { getProductList } from "../../service/ShopService";
import { useEffect, useState } from "react";
import { useProduct } from "../../components/Providers/Product";

export function Home() {
  const { products } = useProduct();

  const navigate = useNavigate();
  const handleShowMore = () => {
    navigate("/shop");
  };

  const latestProducts = products.slice(-6);

  return (
    <MainLayout>
      <div className="Shop">
        <div className="headerPage relative text-center">
          <img
            className="w-screen h-full object-cover"
            src="https://i.ibb.co/HBMbs6G/homeBg.png"
            alt="Background"
          />
          <div className="containInside w-full md:w-2/3 lg:w-1/3 h-auto md:h-fit bg-white rounded-lg shadow-lg absolute bottom-0 md:bottom-16 right-0 md:right-24 flex flex-col justify-center p-4 md:p-10">
            <div className="compo text-left">
              <div className="headerText">
                <h2 className="font-poppins text-lg md:text-xl">New Arrival</h2>
              </div>
              <div className="middleText py-2 md:py-5 sm:py-2">
                <p className="font-poppins font-bold text-blueOcean lg:text-5xl md:text-3xl sm:text-xl">
                  Discover Our <br /> New Collection
                </p>
              </div>
              <div className="bottomText py-2 md:py-5 sm:py-2">
                <p className="text-base md:text-xl">
                  BeluStyle Shop - Your Trusted Choice for Premium Style
                </p>
              </div>
              <div className="btnBottom py-2 md:py-5 sm:py-2">
                <BuyNow />
              </div>
            </div>
          </div>
        </div>
        <div className="product">
          <div className="ProductContent py-10">
            <h1 className="text-center font-poppins font-bold text-5xl">
              Our Products
            </h1>
            {/* Pass only the latest 6 products */}
            <ProductList products={latestProducts} />
            <div className="showMore flex justify-center py-4">
              <ShowMore onClick={handleShowMore} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
