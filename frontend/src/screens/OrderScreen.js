import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { detailsOrder } from '../redux/slices/orderSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function OrderScreen() {
  const { id: orderId } = useParams(); // Get order ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.order);
  const { orders, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(detailsOrder(orderId)); // Fetch order details
  }, [dispatch, orderId]);

  return (
    <div>
      <h1>Order {orderId}</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div>
            <h2>Shipping</h2>
            <p>
              <strong>Name:</strong> {orders[0].shippingAddress.fullName} <br />
              <strong>Address:</strong> {orders[0].shippingAddress.address}, {orders[0].shippingAddress.city}, {orders[0].shippingAddress.postalCode}, {orders[0].shippingAddress.country}
            </p>
            {orders[0].isDelivered ? (
              <MessageBox variant="success">Delivered at {orders[0].deliveredAt}</MessageBox>
            ) : (
              <MessageBox variant="danger">Not Delivered</MessageBox>
            )}
          </div>

          <div>
            <h2>Payment</h2>
            <p>
              <strong>Method:</strong> {orders[0].paymentMethod}
            </p>
            {orders[0].isPaid ? (
              <MessageBox variant="success">Paid on {orders[0].paidAt}</MessageBox>
            ) : (
              <>
              <MessageBox variant="danger">Not Paid</MessageBox>
              <button onClick={() => navigate('/stripe-payment')}>
                Proceed to Payment
              </button>
              </>
            )}
          </div>

          <div>
            <h2>Order Items</h2>
            <ul>
              {orders[0].orderItems.map((item) => (
                <li key={item.product}>
                  <img src={item.image} alt={item.name} width="50" /> {item.name} - {item.qty} x ${item.price} = ${item.qty * item.price}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Order Summary</h2>
            <p><strong>Items:</strong> ${orders[0].itemsPrice.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${orders[0].shippingPrice.toFixed(2)}</p>
            <p><strong>Tax:</strong> ${orders[0].taxPrice.toFixed(2)}</p>
            <p><strong>Total:</strong> ${orders[0].totalPrice.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
