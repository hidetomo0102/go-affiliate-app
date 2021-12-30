import Head from "next/head";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Layout = (props: Props) => {
  const { children } = props;
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <div className="container">{children}</div>
    </>
  );
};
