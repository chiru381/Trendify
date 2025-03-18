import React, { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaymentScreen({ totalAmount }) {
  return (
    <PayPalScriptProvider options={{ "client-id": "AQB7c1788FibVJl8n9ZWAb9j-0XOM7Vs84ZvhRRTMv8VeLtkMMVMLJMtSxLvWDVdSMHzS-XHIka508hT" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: totalAmount.toFixed(2) },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            alert("Payment successful! Transaction ID: " + details.id);
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
