import MainLayout from "../../layouts/MainLayout";
import bg from "../../assets/images/homeBg.png";
import { BuyNow } from "../../components/buttons/Button";

export function Home() {
  return (
    <MainLayout>
      <div className="Shop">
        <div className="headerPage relative text-center">
          <img
            className="w-screen h-full object-cover"
            src={bg}
            alt="Background"
          />
          <div className="containInside w-full md:w-2/3 lg:w-1/3 h-auto md:h-1/2 bg-white rounded-lg shadow-lg absolute bottom-0 md:bottom-16 right-0 md:right-24 flex flex-col justify-center p-4 md:p-10">
            <div className="compo text-left">
              <div className="headerText">
                <h2 className="font-poppins text-lg md:text-xl">New arrival</h2>
              </div>
              <div className="middleText py-2 md:py-5">
                <p className="font-poppins font-bold text-blueOcean text-3xl md:text-5xl">
                  Discover Our <br /> New Collection
                </p>
              </div>
              <div className="bottomText py-2 md:py-5">
                <p className="text-base md:text-xl">
                  BeluStyle Shop - Lựa chọn tin cậy của tầng lớp tài phiệt
                </p>
              </div>
              <div className="btnBottom py-2 md:py-5">
                <BuyNow />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
