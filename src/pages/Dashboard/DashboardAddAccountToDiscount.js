import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api"; // Your API client
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardAddAccountToDiscount = () => {
  const { discountId } = useParams(); // Get discountId from the URL
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get("/api/admin/users/search", { headers: { Authorization: varToken } }) // Adjust this endpoint based on your API
      .then((response) => {
        const fetchedAccounts = response.data || [];
        // Filter accounts to only include those with role 'CUSTOMER'
        const customerAccounts = fetchedAccounts.filter(
          (account) => account.role === "CUSTOMER"
        );
        setAccounts(customerAccounts);
        setFilteredAccounts(customerAccounts);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      });

    // Fetch accounts already in the discount
    apiClient
      .get(`/api/discounts/${discountId}/users`, {
        headers: { Authorization: varToken },
      })
      .then((response) => {
        const existingAccountIds = response.data.users.map(
          (account) => account.userId // Use userId from the API response
        );
        // Filter out accounts that are already in the discount
        setAccounts((prevAccounts) =>
          prevAccounts.filter(
            (account) => !existingAccountIds.includes(account.userId) // Filter by userId
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching existing accounts in discount:", error);
      });
  }, [discountId, varToken]);

  useEffect(() => {
    const filtered = accounts.filter((account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchQuery, accounts]);

  const handleAccountChange = (accountId) => {
    if (selectedAccountIds.includes(accountId)) {
      setSelectedAccountIds(
        selectedAccountIds.filter((id) => id !== accountId)
      );
    } else {
      setSelectedAccountIds([...selectedAccountIds, accountId]);
    }
  };

  const handleAddAccounts = () => {
    apiClient
      .post(`/api/discounts/${discountId}/users`, selectedAccountIds, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success("Add users to discount successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Discounts/${discountId}`); // Redirect to discount details page
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Add users to discount failed",
          {
            position: "bottom-right",
            transition: Zoom,
          }
        );
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Accounts to Discount</h1>
      <input
        type="text"
        placeholder="Search by username"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAccounts.map((account) => (
          <div
            key={account.userId} // Use userId for unique key
            className={`border rounded-md p-2 flex flex-col relative transition-all duration-300 ${
              selectedAccountIds.includes(account.userId)
                ? "border-blue-500 border-[5px]"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              id={`account-${account.userId}`} // Use userId for checkbox id
              checked={selectedAccountIds.includes(account.userId)}
              onChange={() => handleAccountChange(account.userId)}
              className="absolute opacity-0"
            />
            <label
              htmlFor={`account-${account.userId}`} // Use userId for label
              className="flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <h2 className="font-semibold">{account.username}</h2>
              <p className="text-sm">{account.email}</p>
              <p className="text-gray-500">Name: {account.fullName}</p>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddAccounts}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Accounts
      </button>
    </div>
  );
};

export default DashboardAddAccountToDiscount;
