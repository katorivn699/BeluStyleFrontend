import { Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import DiscountCard from "./DiscountItem";
import { myDiscount } from "../../MockData/DiscountMockData";

const DiscountPage = () => {
  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu />
      </Grid2>
      <Grid2 size={7}>
        <div className="w-2/3">
          <Grid2 container spacing={2} className="DiscountItem">
            {myDiscount.map((discount) => (
              <Grid2 item xs={3} sm={6} md={4}>
                <DiscountCard
                  brand={discount.discountCode}
                  discountType={discount.discountType}
                  discount={discount.discountValue}
                  expiry={discount.endDate}
                  timesUsed={discount.usageCount}
                />
              </Grid2>
            ))}
          </Grid2>
        </div>
      </Grid2>
    </Grid2>
  );
};
export default DiscountPage;
