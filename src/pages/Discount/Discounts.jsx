import { Backdrop, CircularProgress, Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import DiscountCard from "./DiscountItem";
import { useEffect, useState, useCallback } from "react";
import { getMyDiscount } from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authHeader = useAuthHeader();

  // Memoized format function to avoid recalculating each render
  const formatRemainingTime = useCallback((remainingTime) => {
    if (remainingTime <= 0) return "Expired";

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getMyDiscount(authHeader);
        setDiscounts(
          response.data.map((discount) => ({
            ...discount,
            remainingTime: new Date(discount.endDate) - new Date(),
          }))
        );
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();

    // Set up interval to update remaining time every second
    const intervalId = setInterval(() => {
      setDiscounts((currentDiscounts) =>
        currentDiscounts.map((discount) => {
          const remainingTime = new Date(discount.endDate) - new Date();
          return { ...discount, remainingTime };
        })
      );
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [authHeader]);

  return (
    <Grid2 container>
      {/* UserSideMenu is displayed immediately */}
      <Grid2 size={4}>
        <UserSideMenu />
      </Grid2>

      {/* Main content: Discount cards */}
      <Grid2 size={7}>
        {loading ? (
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
          >
            <CircularProgress />
          </Backdrop>
        ) : error ? (
          <p>Error loading discounts: {error.message}</p>
        ) : (
          <div className="w-2/3">
            <Grid2 container spacing={2} className="DiscountItem">
              {discounts.map((discount) => (
                <Grid2 item xs={12} sm={6} md={4} key={discount.id}>
                  <DiscountCard
                    brand={discount.discountCode}
                    discountType={discount.discountType}
                    discount={discount.discountValue}
                    expiry={formatRemainingTime(discount.remainingTime)}
                    timesUsed={discount.usageCount}
                  />
                </Grid2>
              ))}
            </Grid2>
          </div>
        )}
      </Grid2>
    </Grid2>
  );
};

export default DiscountPage;
