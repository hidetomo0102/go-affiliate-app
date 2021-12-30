import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Filter } from "../models/filter";
import { Product } from "../models/product";
import Products from "./Products";

export const ProductsBackend = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<Filter>({
    s: "",
    sort: "",
    page: 1,
  });
  const [lastpage, setLastPage] = useState(0);

  useEffect(() => {
    const filterProducts = async () => {
      const arr = [];
      if (filter.s) {
        arr.push(`s=${filter.s}`);
      }
      if (filter.sort) {
        arr.push(`sort=${filter.sort}`);
      }
      if (filter.page) {
        arr.push(`page=${filter.page}`);
      }

      const { data } = await axios.get(`products/backend?${arr.join("&")}`);
      setProducts(filter.page === 1 ? data.data : [...products, ...data.data]);
      setLastPage(data.meta.last_page);
    };

    filterProducts();
  }, [filter, products]);

  return (
    <Layout>
      <Products
        products={products}
        filter={filter}
        setFilter={setFilter}
        lastPage={lastpage}
      />
    </Layout>
  );
};
