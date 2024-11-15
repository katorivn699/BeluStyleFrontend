import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCart } from "react-use-cart";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import LocationSelector from "../../service/LocationService";
import { formatPrice } from "../../components/format/formats";
import ShipmentSelector from "../../service/ShipmentService";
import { CommonRadioCard } from "../../components/inputs/Radio";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { checkDiscount, checkoutOrder } from "../../service/CheckoutService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, Zoom } from "react-toastify";

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
  const { items, isEmpty } = useCart();
  const [discountApply, setDiscountApply] = useState({
    discountType: "",
    discountValue: 0,
    maximumDiscountValue: 0,
  });
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountMinus, setDiscountMinus] = useState(0);
  const [subTT, setSubTT] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const calculateFinalCheckoutPrice = () => {
    return Math.max(0, subTT + shippingFee - discountMinus);
  };
  const userState = useAuthUser();
  const authHeader = useAuthHeader();
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);

  useEffect(() => {
    if (isEmpty) {
      navigate(-1);
    }
  }, [isEmpty, navigate]);

  const handleFeeCalculated = (fee) => {
    setShippingFee(fee);
  };

  const subTotal = () => {
    const total = items.reduce((accumulator, item) => {
      return accumulator + item.saledPrice * item.quantity;
    }, 0);
    setSubTT(total);
  };

  useEffect(() => {
    const calculatedFinalTotal = calculateFinalCheckoutPrice();
    setFinalTotal(calculatedFinalTotal);
  }, [subTT, shippingFee, discountMinus]); // Only trigger when these values change

  useEffect(() => {
    subTotal();
  }, [items]);

  const handleHouseNumberBlur = (e) => {
    setHouseNumber(e.target.value);
    updateShippingAddress(houseNumber, location);
  };

  const handleNoteBlur = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
  };

  const updateShippingAddress = (houseNumber, location) => {
    const fullAddress = `${houseNumber}, ${location.phuong || ""}, ${
      location.quan || ""
    }, ${location.tinh || ""}`;
    setCheckoutData((prevData) => ({
      ...prevData,
      shippingAddress: fullAddress,
    }));
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    updateShippingAddress(houseNumber, newLocation); // update with current house number
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleDiscountCheck = async () => {
    try {
      const response = await checkDiscount(discountCode, authHeader, subTT);

      if (response?.data) {
        const discount = {
          discountType: response.data.discountType,
          discountValue: response.data.discountValue,
          maximumDiscountValue: response.data.maximumDiscountValue,
        };

        setDiscountApply(discount);
        const discountAmount = calculateDiscount(subTT, discount);
        setDiscountMinus(discountAmount);
      }
    } catch (error) {
      console.error("Failed to check discount:", error);
    }
  };

  // Discount calculation function
  const calculateDiscount = (originalPrice, discount) => {
    let discountAmount = 0;

    if (discount.discountType === "PERCENTAGE") {
      discountAmount =
        (originalPrice * discount.discountValue) / 100 >
        (discount.maximumDiscountValue !== null || undefined
          ? discount.maximumDiscountValue
          : discount.discountValue)
          ? discount.maximumDiscountValue
          : (originalPrice * discount.discountValue) / 100;
    } else if (discount.discountType === "FIXED_AMOUNT") {
      discountAmount = discount.discountValue;
    }
    return discountAmount;
  };

  // Định nghĩa itemCheckout sau khi tính toán subtotal
  const itemCheckout = items.map((item, index) => ({
    id: item.id.split("@")[1],
    image: item.image,
    name: item.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
    saledPrice: item.saledPrice,
  }));

  const [checkoutData, setCheckoutData] = useState({
    notes: "",
    discountCode: "",
    discountMinus: 0,
    totalAmount: finalTotal,
    shippingFee: 0,
    orderDetails: [],
    userEmail: userState?.email || "",
    shippingAddress: {
      houseNumber: houseNumber,
      location: location,
    },
    paymentMethod: paymentMethod,
  });

  useEffect(() => {
    // Recalculate the final price and order details whenever there's a change
    const finalCheckoutPrice = calculateFinalCheckoutPrice();

    // Create the updated order details based on the items and discounts applied
    const updatedOrderDetails = items.map((item) => {
      const itemDiscount = calculateItemDiscount(
        item.saledPrice * item.quantity,
        discountApply
      ); // apply discount to each item

      return {
        variationId: item.id.split("@")[1],
        orderQuantity: item.quantity,
        unitPrice: item.saledPrice,
        discountAmount: itemDiscount,
      };
    });

    // Create the new checkout data based on updated values
    const newCheckoutData = {
      ...checkoutData,
      orderDetails: updatedOrderDetails, // Updated order details with discount applied
      totalAmount: finalCheckoutPrice, // Updated total with shipping fee and discount
      shippingFee: shippingFee, // Updated shipping fee
      discountMinus: discountMinus, // Updated discount value
      discountCode: discountCode,
      paymentMethod: paymentMethod, // Updated payment method
      userAddress: `${houseNumber}, ${location.phuong || ""}, ${
        location.quan || ""
      }, ${location.tinh || ""}`, // Updated shipping address
      notes: note,
    };

    // Only update `checkoutData` if there's an actual change
    if (
      newCheckoutData.totalAmount !== checkoutData.totalAmount ||
      newCheckoutData.shippingFee !== checkoutData.shippingFee ||
      newCheckoutData.discountMinus !== checkoutData.discountMinus ||
      JSON.stringify(newCheckoutData.orderDetails) !==
        JSON.stringify(checkoutData.orderDetails) ||
      newCheckoutData.paymentMethod !== checkoutData.paymentMethod ||
      newCheckoutData.shippingAddress !== checkoutData.shippingAddress ||
      newCheckoutData.notes !== checkoutData.notes ||
      newCheckoutData.discountCode !== checkoutData.discountCode ||
      newCheckoutData.userAddress !== checkoutData.userAddress
    ) {
      setCheckoutData(newCheckoutData);
      console.log("Checkout Data Updated:", newCheckoutData);
    }
  }, [
    items, // Trigger when items change
    subTT, // Trigger when subtotal changes
    shippingFee, // Trigger when shipping fee changes
    discountMinus, // Trigger when discount value changes
    discountCode,
    paymentMethod, // Trigger when payment method changes
    houseNumber, // Trigger when house number changes
    location, // Trigger when location changes
    note, // Trigger when note changes
    discountApply, // Ensure that the discount data is correctly tracked
  ]);

  const isCheckoutDataComplete = useMemo(() => {
    return (
      (checkoutData.notes.trim().length === 0 ||
        checkoutData.notes.trim().length > 0) &&
      (discountCode.length === 0 || discountCode.length > 0) &&
      checkoutData.totalAmount > 0 &&
      checkoutData.shippingFee > 0 &&
      checkoutData.orderDetails.length > 0 &&
      checkoutData.paymentMethod.length > 0 &&
      houseNumber.trim().length > 0
    );
  }, [
    checkoutData.notes,
    discountCode,
    checkoutData.totalAmount,
    checkoutData.shippingFee,
    checkoutData.orderDetails,
    checkoutData.paymentMethod,
    houseNumber,
  ]);

  useEffect(() => {
    setIsCheckoutReady(isCheckoutDataComplete);
  }, [checkoutData, isCheckoutDataComplete]);

  const calculateItemDiscount = (originalPrice, discount) => {
    let itemDiscount = 0;

    if (originalPrice > 0) {
      itemDiscount = (originalPrice / subTT) * discountMinus;
    }
    return itemDiscount;
  };

  const handlePlaceOrder = async () => {
    const payload = {
      notes: checkoutData.note || checkoutData.notes,
      discountCode: checkoutData.discountCode,
      billingAddress: checkoutData.userAddress,
      shippingMethod: "Standard",
      totalAmount: checkoutData.totalAmount,
      paymentMethod: checkoutData.paymentMethod,
      userAddress: checkoutData.userAddress,
      orderDetails: checkoutData.orderDetails.map((item) => ({
        variationId: item.variationId,
        orderQuantity: item.orderQuantity,
        unitPrice: item.unitPrice,
        discountAmount: item.discountAmount,
      })),
    };

    try {
      const response = await checkoutOrder(payload, authHeader);
      if (response && response.data) {
        console.log(response.data.redirectUrl);
        if (response.data.redirectUrl) {
          localStorage.setItem("orderId", response.data.orderId);
          window.location.href = response.data.redirectUrl;
        } else {
          if (paymentMethod === "TRANSFER") {
            localStorage.setItem("orderId", response.data.orderId);
            navigate("/orders/bankTransfer?total=" + checkoutData.totalAmount);
          } else {
            localStorage.setItem("orderId", response.data.orderId);
            navigate("/orders/success");
          }
        }
      }
    } catch (error) {
      console.error("Order placement failed:", error);
    }
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
                        className="max-w-24 max-h-24 rounded-lg"
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
            onBlur={(e) => setDiscountCode(e.target.value)}
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
            <p className="font-bold">{formatPrice(finalTotal)}</p>
          </div>
        </div>
      </div>
      <div className="cartTotal w-full px-10">
        <div className="infomationHeader font-poppins text-2xl text-center font-bold">
          <h1>Your Infomation</h1>
        </div>
        <div className="userInfomation">
          <p className="font-poppins font-semibold text-2xl pt-3">Email</p>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Your email address"
            value={userState?.email?.length > 0 ? userState?.email : ""}
            disabled={userState?.email?.length > 0 ? true : false}
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
            onBlur={handleHouseNumberBlur}
          />
        </div>
        <div className="Payment pt-3 space-y-3">
          <p className=" font-poppins font-semibold text-2xl">Payments</p>
          <CommonRadioCard
            value="COD"
            label="Cash on Delivery"
            checked={paymentMethod === "COD"}
            onChange={handlePaymentMethodChange}
            description="Pay for your order in cash when it is delivered to your doorstep."
          />
          <CommonRadioCard
            value="PAYOS"
            label="Payment via PayOs"
            checked={paymentMethod === "PAYOS"}
            onChange={handlePaymentMethodChange}
            description="Complete your payment through PayOs using a QR code for a quick and secure transaction."
          />
          <CommonRadioCard
            value="VNPAY"
            label="Payment via VNPay"
            checked={paymentMethod === "VNPAY"}
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
        <div className="note py-5">
          <p className="font-poppins font-semibold text-2xl pt-3">Note</p>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Any special request?"
            onBlur={handleNoteBlur}
            multiline
          />
        </div>
        <div className="btnCheckout flex justify-end pb-3">
          <Button
            onClick={handlePlaceOrder}
            disabled={!isCheckoutReady}
            sx={{
              backgroundColor: isCheckoutReady && "black",
              color: !isCheckoutReady ? "gray" : "white", // Set text color to gray when disabled
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            {isCheckoutReady
              ? `Pay ${formatPrice(finalTotal)}`
              : "Please complete the information"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
