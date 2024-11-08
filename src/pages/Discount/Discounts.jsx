import { Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import CouponCard from "./DiscountItem";

const DiscountPage = () => {
  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu />
      </Grid2>
      <Grid2 size={7}>
        <CouponCard brand={"Discount"} discountType="PERCENTAGE" discount={10} expiry={"09-11-2024"} timesUsed={0}/>
        <CouponCard brand={"Discount"} discount={20000} expiry={"09-11-2024"} timesUsed={0}/>
        <CouponCard brand={"Discount"} discount={20000} expiry={"09-11-2024"} timesUsed={0}/>
      </Grid2>
    </Grid2>
  );
};
export default DiscountPage;
