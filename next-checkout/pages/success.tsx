import { useRouter } from "next/router";
import React, { useEffect } from "react";
import axios from "axios";

import { Layout } from "../components/Layout";

const Success = () => {
  const router = useRouter();
  const { source } = router.query;

  useEffect(() => {
    const confirmOrder = async () => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_CHECKOUT_ENDPOINT}/orders/confirm`,
        { source }
      );
    };

    if (source !== undefined) {
      confirmOrder();
    }
  }, [source]);

  return (
    <Layout>
      <div className="py-5 text-center">
        <h2>Success</h2>
        <p className="lead">Your purchase has been completed!</p>
      </div>
    </Layout>
  );
};

export default Success;
