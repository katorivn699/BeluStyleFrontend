import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardViewUserDiscount = () => {
  const [accounts, setAccounts] = useState([]);
  const [discount, setDiscount] = useState(null);
  const { discountId } = useParams();

  const varToken = useAuthHeader();

  useEffect(() => {
    // Fetch discount details
    apiClient
      .get(`/api/discounts/${discountId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setDiscount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching discount details:", error);
      });

    // Fetch users who have this discount
    apiClient
      .get(`/api/discounts/${discountId}/users`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setAccounts(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users for discount:", error);
      });
  }, [discountId, varToken]);

  // Function to remove user from discount
  const handleRemoveUser = (userId) => {
    apiClient
      .delete(`/api/discounts/${discountId}/users?userId=${userId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then(() => {
        setAccounts(accounts.filter((account) => account.userId !== userId));
        toast.success("User removed from discount", {
          position: "bottom-center",
          transition: Zoom,
        });
      })
      .catch((error) => {
        console.error("Error removing user from discount:", error);
        toast.error("Failed to remove user from discount", {
          position: "bottom-center",
          transition: Zoom,
        });
      });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Discount Details</h1>
      </div>

      {/* Discount Information Section */}
      {discount ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Discount ID: {discount.discountId}
          </h2>
          <p>Code: {discount.discountCode}</p>
          <p>Type: {discount.discountType}</p>
          <p>Value: {discount.discountValue}</p>
          <p>Start Date: {new Date(discount.startDate).toLocaleString()}</p>
          <p>End Date: {new Date(discount.endDate).toLocaleString()}</p>
          <p>Status: {discount.discountStatus}</p>
          <p>Description: {discount.discountDescription}</p>
          <p>Minimum Order Value: {discount.minimumOrderValue}</p>
          <p>Maximum Order Value: {discount.maximumDiscountValue}</p>
          <p>Usage Limit: {discount.usageLimit}</p>
        </div>
      ) : (
        <p>Loading discount details...</p>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Users with Discount</h1>
        <Link to={`/Dashboard/Discounts/${discountId}/AddAccount`}>
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Add Users To Discount
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Remove</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((account) => (
              <tr key={account.userId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{account.userId}</td>
                <td className="px-4 py-2">{account.fullName}</td>
                <td className="px-4 py-2">{account.email}</td>
                <td className="px-4 py-2">{account.userAddress}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRemoveUser(account.userId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardViewUserDiscount;
