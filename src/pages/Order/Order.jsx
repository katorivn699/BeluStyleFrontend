import { Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";

const OrderPage = () => {
  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu></UserSideMenu>
      </Grid2>
      <Grid2 size={7}></Grid2>
    </Grid2>
  );
};

export default OrderPage;
