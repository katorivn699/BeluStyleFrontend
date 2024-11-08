import { Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import { OrderList } from "./OrderList";
import {OrderListData} from "../../MockData/OrderDemo";

const OrderPage = () => {
  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu></UserSideMenu>
      </Grid2>
      <Grid2 size={7}>
      <OrderList OrderList={OrderListData}/>
      </Grid2>
    </Grid2>
  );
};

export default OrderPage;
