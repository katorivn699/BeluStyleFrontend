import { useState } from "react";
import SelectLocation from "../../service/LocationService";
import RadioCommon from "../../components/inputs/Radio";
import { Button } from "@mui/material";
import { useCart } from "react-use-cart";

const CheckoutPage = () => {
  const [location, setLocation] = useState({
    tinh: "",
    quan: "",
    phuong: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [houseNumber, setHouseNumber] = useState("");
  const { items, cartTotal } = useCart();
  const [saleApply, setSaleApply] = useState(0);
  const [discountApply, setDiscountApply] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);

  const itemCheckout = items.map((item, index) => ({
    image: item.image,
    name: item.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
  }));

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleHouseNumberChange = (e) => {
    setHouseNumber(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDiscountCheck = (e) => {
    e.preventDefault();
    console.log(`Checking...`);
  };

  return (
    <div className="grid grid-cols-5 grid-rows-4 gap-4">
      <div className="col-span-3 row-span-5">
        <div className="shipAndPaymentMethod border-black border-2 m-16 p-10 font-poppins space-y-8">
          <h1 className="text-left text-2xl">Shipping Address</h1>
          <SelectLocation onLocationChange={handleLocationChange} />
          <h2 className="text-2xl">House Number</h2>
          <input
            type="text"
            name="houseNumber"
            id="housenumber"
            className="border-gray-400 border-[1px] w-1/4 h-12 p-5"
            onChange={handleHouseNumberChange}
            value={houseNumber}
            placeholder="House number, village"
          />
          <div className="paymentMethod">
            <h1 className="text-2xl">Payment Method</h1>
            <div className="method space-y-7 text-2xl pt-5">
              <RadioCommon
                context="Cash on delivery"
                value="COD"
                current={paymentMethod}
                handleChecked={handlePaymentMethodChange}
                id="Payment"
              />
              <RadioCommon
                context="Payment via PayOS"
                value="PayOs"
                current={paymentMethod}
                handleChecked={handlePaymentMethodChange}
                id="Payment"
              />
              <RadioCommon
                context="Payment via VNPay"
                value="VNPAY"
                current={paymentMethod}
                handleChecked={handlePaymentMethodChange}
                id="Payment"
              />
              <RadioCommon
                context="Bank transfer"
                value="TRANSFER"
                current={paymentMethod}
                handleChecked={handlePaymentMethodChange}
                id="Payment"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-4 col-span-2">
        <div className="discount border-black border-2 my-16 mx-7 p-3 font-poppins space-y-8">
          <h1>Have a coupon?</h1>
          <form onSubmit={handleDiscountCheck} className="flex items-center">
            <input
              type="text"
              name="houseNumber"
              id="housenumber"
              className="border-gray-400 border-[1px] w-3/4 h-12 p-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleHouseNumberChange}
              value={houseNumber}
              placeholder="Add coupon"
            />
            <Button
              type="submit"
              sx={{
                border: "gray solid 1px",
                height: "3rem",
                width: "15%",
                color: "black",
                borderRadius: "0px",
              }}
            >
              Check
            </Button>
          </form>
        </div>
      </div>
      <div className="row-span-3 col-start-4 row-start-2 col-span-2">
        <div className="sumary border-black border-2 mx-7 font-poppins space-y-8">
          <h1 className="text-center font-bold font-poppins p-3 text-xl">
            Order Sumary
          </h1>
          <div className="listItem p-5">
            {itemCheckout.map((item) => (
              <div className="item justify-between items-center flex">
                <div className="itemLeft flex">
                  <img
                    src={item.image}
                    alt="productImage"
                    className="w-16 h-16"
                  />
                  <div className="itemInfo pl-5">
                    <p>{item.name}</p>
                    <div className="variation text-gray-500">
                      <p>
                        {item.size} - {item.color}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </div>
                <p className="font-bold">{item.price}$</p>
              </div>
            ))}
          </div>
          <div className="calculateTotal border-y-2 border-black">
            <div className="subTotal p-5 flex justify-between">
              <p>SubTotal</p>
              <p>{cartTotal.toFixed(2)}$</p>
            </div>
            {saleApply >= 0 && (
              <div className="saleFix p-5 flex justify-between">
                <p>Sale</p>
                <p>{saleApply.toFixed(2)}</p>
              </div>
            )}
            {discountApply >= 0 && (
              <div className="discountFix p-5 flex justify-between">
                <p>Discount</p>
                <p>{discountApply.toFixed(2)}</p>
              </div>
            )}
          </div>
          <div className="FixedTotal px-5 pb-5 flex justify-between">
            <p className="text-blueOcean font-bold text-xl">Total</p>
            <p className="text-blueOcean font-bold text-3xl">
              {lastTotal.toFixed(2)}$
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
