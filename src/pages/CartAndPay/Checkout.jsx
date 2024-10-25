import React, { useEffect, useState } from "react";
import SelectLocation from "../../service/LocationService";
import {
  Badge,
  Button,
  Container,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import LocationSelector from "../../service/LocationService";
import { formatPrice } from "../../components/format/formats";
import ShipmentSelector from "../../service/ShipmentService";
import { CommonRadioCard } from "../../components/inputs/Radio";

const style = {
  py: 0,
  width: "100%",
  maxWidth: "auto",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const CheckoutPage = () => {
  const [location, setLocation] = useState({
    tinh: "",
    quan: "",
    phuong: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [houseNumber, setHouseNumber] = useState("");
  const { items, cartTotal } = useCart();
  const [discountApply, setDiscountApply] = useState({
    discountType: "",
    discountValue: 0,
  });
  const [discountCode, setDiscountCode] = useState("");
  const [discountMinus, setDiscountMinus] = useState(0);
  const [subTT, setSubTT] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const calculateFinalCheckoutPrice = () => {
    return subTT + shippingFee - discountMinus;
  };

  const finalCheckoutPrice = calculateFinalCheckoutPrice();

  const handleFeeCalculated = (fee) => {
    setShippingFee(fee);
  };

  const itemCheckout = items.map((item, index) => ({
    image: item.image,
    name: item.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
    saledPrice: item.saledPrice,
  }));

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const subTotal = () => {
    const total = itemCheckout.reduce((accumulator, item) => {
      return accumulator + item.saledPrice * item.quantity;
    }, 0);
    setSubTT(total);
  };

  useEffect(() => {
    subTotal();
  }, items);

  const handleHouseNumberChange = (e) => {
    setHouseNumber(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDiscountCheck = () => {
    if (discountCode === "SinhVienFPT") {
      const discount = {
        discountType: "PERCENTAGE",
        discountValue: 15,
      };

      // Đặt discountApply trước khi tính toán
      setDiscountApply(discount);

      // Tính số tiền giảm giá
      const discountAmount = calculateDiscount(cartTotal, discount);
      setDiscountMinus(discountAmount); // Cập nhật discountMinus với giá trị giảm giá
    } else if (discountCode === "SinhVienCTU") {
      const discount = {
        discountType: "FIXED_AMOUNT",
        discountValue: 10000,
      };

      // Đặt discountApply trước khi tính toán
      setDiscountApply(discount);

      // Tính số tiền giảm giá
      const discountAmount = calculateDiscount(cartTotal, discount);
      setDiscountMinus(discountAmount); // Cập nhật discountMinus với giá trị giảm g
    }
  };

  // Cập nhật hàm calculateDiscount
  const calculateDiscount = (originalPrice, discount) => {
    let discountAmount = 0; // Số tiền giảm

    if (discount.discountType === "PERCENTAGE") {
      discountAmount = (originalPrice * discount.discountValue) / 100;
    } else if (discount.discountType === "FIXED_AMOUNT") {
      discountAmount = discount.discountValue;
    }
    return discountAmount; // Trả về số tiền giảm
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
      <div className="checkoutInfomation w-full">
        <div className="bgCartItem bg-gray-100 md:px-9">
          <div className="checkoutHeader md:p-10 flex justify-between items-center font-poppins">
            <p className="font-semibold text-2xl">Your Order</p>
            <Link className="flex items-center" to="/cart">
              <p>Edit Cart</p>
              <MdOutlineKeyboardArrowRight className="text-xl" />
            </Link>
          </div>
          <List sx={style}>
            {itemCheckout.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    <Badge
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ECCFA", // Background color
                          color: "white",
                        },
                      }}
                      badgeContent={item.quantity}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-24 rounded-lg"
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText sx={{ px: "10px" }}>
                    <p className="font-poppins font-semibold text-lg md:text-xl">
                      {item.name}
                    </p>
                    <span>Size: </span>
                    <span className="font-semibold font-poppins">
                      {item.size}
                    </span>
                    <span className="px-2">|</span>
                    <span>Color: </span>
                    <span className="font-semibold font-poppins">
                      {item.color}
                    </span>
                  </ListItemText>
                  <ListItemText sx={{ placeItems: "end" }}>
                    {item.price > item.saledPrice ? (
                      <>
                        <p>{formatPrice(item.saledPrice)}</p>
                        <p className="line-through text-red-500">
                          {formatPrice(item.price)}
                        </p>
                      </>
                    ) : (
                      <span>{formatPrice(item.price)}</span>
                    )}
                  </ListItemText>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <p className="font-poppins font-semibold text-xl py-5">
            Discount Code
          </p>
          <TextField
            variant="outlined"
            fullWidth
            disabled={discountApply.discountType.length > 0}
            onChange={(e) => setDiscountCode(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleDiscountCheck}
                    sx={{ height: "100%", color: "green" }}
                    disabled={discountApply.discountType.length > 0}
                  >
                    {discountApply.discountType.length > 0
                      ? "Applied"
                      : "Apply"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Divider sx={{ py: "15px" }} />
          <div className="FinalCheckoutPrice">
            <div className="Subtotal flex justify-between py-5 font-poppins">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-semibold">{formatPrice(subTT)}</p>
            </div>
            <div className="shippingCost flex justify-between py-5 font-poppins">
              <ShipmentSelector
                provinceName={location.tinh}
                onFeeCalculated={handleFeeCalculated}
              />
              <p className="text-gray-500">Shipping Cost</p>
              <p className="font-semibold">{formatPrice(shippingFee)}</p>
            </div>
            {discountMinus > 0 && (
              <div className="Subtotal flex justify-between py-5 font-poppins fade-in">
                <p className="text-gray-500">
                  Coupon Discount
                  {discountApply.discountType === "PERCENTAGE"
                    ? ` (${discountApply.discountValue}%)`
                    : ""}
                </p>
                <p className="font-semibold">{formatPrice(discountMinus)}</p>
              </div>
            )}
          </div>
          <Divider sx={{ py: "15px" }} />
          <div className="lastOrderPrice flex justify-between py-5 font-poppins text-xl">
            <p className="font-semibold">Total</p>
            <p className="font-bold">
              {formatPrice(finalCheckoutPrice)}
            </p>
          </div>
        </div>
      </div>
      <div className="cartTotal w-full px-10">
        <div className="infomationHeader font-poppins text-2xl text-center font-bold">
          <h1>Your Infomation</h1>
        </div>
        <div className="userInfomation">
          <p className="font-poppins font-semibold text-2xl py-3">Email</p>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Your email address"
            // onChange={}
          />
        </div>
        <div className="BillingAddress font-poppins space-y-5">
          <p className=" font-semibold text-2xl pt-3">Billing Address</p>
          <LocationSelector onLocationChange={handleLocationChange} />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="House number, village"
            onChange={handleHouseNumberChange}
          />
        </div>
        <div className="Payment py-3 space-y-3">
          <p className=" font-poppins font-semibold text-2xl">Payments</p>
          <CommonRadioCard
            value="COD"
            label="Cash on Delivery"
            checked={paymentMethod === "COD"}
            onChange={handlePaymentMethodChange}
            description="Pay for your order in cash when it is delivered to your doorstep."
          />
          <CommonRadioCard
            value="PayOs"
            label="Payment via PayOs"
            checked={paymentMethod === "PayOs"}
            onChange={handlePaymentMethodChange}
            description="Complete your payment through PayOs using a QR code for a quick and secure transaction."
          />
          <CommonRadioCard
            value="VNPay"
            label="Payment via VNPay"
            checked={paymentMethod === "VNPay"}
            onChange={handlePaymentMethodChange}
            description="Use VNPay to pay via QR code, ensuring a fast and reliable payment experience."
          />
          <CommonRadioCard
            value="TRANSFER"
            label="Bank Transfer"
            checked={paymentMethod === "TRANSFER"}
            onChange={handlePaymentMethodChange}
            description="Transfer the total amount to our bank account prior to delivery."
          />
        </div>
        <div className="btnCheckout flex justify-end">
          <Button sx={
            {
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              textTransform: "none"
            }
          }>
            Pay {formatPrice(finalCheckoutPrice)}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
