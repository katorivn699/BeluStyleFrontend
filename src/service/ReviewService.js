import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api"

export const createReview = async (review, authHeader) => {
    console.log(review);
    console.log(authHeader);
    try {
        const response = apiClient.post("/api/reviews", {
            productId: review.productId,
            orderDetailId: review.orderDetailId,
            reviewComment: review.reviewComment,
            reviewRating: review.reviewRating
        },
        {
            headers: {
                Authorization: authHeader
            },
        },
    )
    return response;
    } catch (error) {
        toast.error("Error during review product: " + error?.data, {
            position: "top-center",
            transition: Zoom
        })
    }
};