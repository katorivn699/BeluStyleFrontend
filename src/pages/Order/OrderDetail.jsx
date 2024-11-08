import React from 'react'
import { useParams } from 'react-router-dom'

function OrderDetail() {
    const {orderId} = useParams();
  return (
    <div>
      <h1>Hi</h1>
      <h2>{orderId}</h2>
    </div>
  )
}

export default OrderDetail
