import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QOx3bSBnvO09ua3hbXBhqg3BBwUVGp7KQV4BLQuoQGUkYr1prlNIrDL5IJMnDlnuABAZ66USUzcTnjiEPMhUMj600k3j4HQnY");

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  const cart = useSelector((state) => state.cart);
  // Ensure cartItems exists and is not empty before accessing index 0
  const totalPrice = cart.cartItems.length > 0 ? cart.cartItems[0].price : 0;


  useEffect(() => {
    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      console.error("Invalid total price:", totalPrice);
      return;
    }
  
    fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        currency: "usd",
        description: "E-commerce product purchase",
        shipping: {
          name: "John Doe", // Replace with actual customer name
          address: {
            line1: "123 Main Street",
            city: "Mumbai",
            state: "MH",
            postal_code: "400001",
            country: "IN",
          },
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            console.error("Error fetching clientSecret:", err);
            throw new Error(err.error || "Failed to fetch payment intent");
          });
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [totalPrice]);
  
  

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
        console.error("Stripe or elements is not loaded.");
        return;
      }
    
      if (!clientSecret) {
        console.error("Missing clientSecret, cannot process payment.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        console.error("Card Element not found.");
        return;
      }
    
    
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        console.error("Payment error:", result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          window.alert('success')
          navigate("/");
        }
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

const StripePaymentScreen = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripePaymentScreen;
