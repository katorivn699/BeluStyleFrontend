import React from "react";

const ProductDetailPage = () => {
    return (
        <div>
            <h1>Product Detail Page</h1>
        </div>
    );
}

const productDetail = [
    {
        productId: "",
        productName: "",
        availability: "", //check số lượng bên trong kho,
        description: "",
        rating: "", //tính trung bình điểm toàn bộ rating trên mặt hàng
        reviewCount: "", //số lượng khách hàng đánh giá
        variation: [
            {
                variationId: "",
                hexCode: "",
                sizeName: "",
                productVariationImage: "",
                productPrice: "",
            },
            {
                variationId: "",
                hexCode: "",
                sizeName: "",
                productVariationImage: "",
                productPrice: "",
            },
            {
                variationId: "",
                hexCode: "",
                sizeName: "",
                productVariationImage: "",
                productPrice: "",
            },
        ],
        reviews: [
            {
                reviewId: "",
                fullName: "",
                reviewText: "",
                reviewRating: "",
                createAt: ""
            },
            {
                reviewId: "",
                fullName: "",
                reviewText: "",
                reviewRating: "",
                createAt: ""
            },
            {
                reviewId: "",
                fullName: "",
                reviewText: "",
                reviewRating: "",
                createAt: ""
            },
        ]
        
    }
]

export default ProductDetailPage;