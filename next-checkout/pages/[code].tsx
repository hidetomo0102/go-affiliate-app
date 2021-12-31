import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`, {
  apiVersion: "2020-08-27",
});

const Home = () => {
  return <div></div>;
};

export default Home;
