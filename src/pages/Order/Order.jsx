import { Backdrop, Grid2, Pagination } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import { OrderList } from "./OrderList";
import { useEffect, useState } from "react";
import { getMyorders } from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { CircularProgress } from "@mui/material"; // Import CircularProgress for loading indicator

const OrderPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const authHeader = useAuthHeader();

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const response = await getMyorders(authHeader, page); // Pass page number to API call
      const { orders, totalPages, currentPage } = response.data;

      setOrderData(orders);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [authHeader, currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1); // Adjust for zero-based index
  };

  return (
    <Grid2 container>
      <Grid2 size={4}>
        <UserSideMenu />
      </Grid2>
      <Grid2 size={7}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={true}
            >
              <CircularProgress />
            </Backdrop>
          </div>
        ) : orderData.length > 0 ? (
          <>
            <OrderList OrderList={orderData} />
            <div className="pagination-controls max-w-[800px] flex justify-center py-4">
              <Pagination
                count={totalPages}
                page={currentPage + 1} // Adjust for one-based index
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
              />
            </div>
          </>
        ) : (
          <div className="text-center max-w-[800px] py-4 font-montserrat">
            No orders available!
          </div>
        )}
      </Grid2>
    </Grid2>
  );
};

export default OrderPage;
