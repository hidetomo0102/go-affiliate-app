import React, { useEffect, useState } from "react";
import { Product } from "../models/product";
import { Filter } from "../models/filter";
import axios from "axios";
import Layout from "../components/Layout";
import Products from "./Products";

export const ProductsFrontend = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<Filter>({ s: "", sort: "", page: 1 });
  const [lastPage, setLastPage] = useState(0);

  const perPage = 9;

  useEffect(() => {
    const getProductsFrontend = async () => {
      const { data } = await axios.get("products/frontend");

      setProducts(data);
      setFilteredProducts(data);
      setLastPage(Math.ceil(data.length / perPage));
    };

    const displayProducts = () => {
      let productsFiltered = products.filter(
        (p) =>
          p.title.toLowerCase().indexOf(filter.s.toLowerCase()) >= 0 ||
          p.description.toLowerCase().indexOf(filter.s.toLowerCase()) >= 0
      );

      if (filter.sort === "asc") {
        productsFiltered.sort((a, b) => {
          if (a.price > b.price) {
            return 1;
          }

          if (a.price < b.price) {
            return -1;
          }
          return 0;
        });
      } else if (filter.sort === "desc") {
        productsFiltered.sort((a, b) => {
          if (a.price > b.price) {
            return -1;
          }

          if (a.price < b.price) {
            return 1;
          }
          return 0;
        });
      }

      setLastPage(Math.ceil(products.length / perPage));
      setFilteredProducts(products.slice(0, filter.page * perPage));
    };
    getProductsFrontend();
    displayProducts();
  }, [filter, products]);

  return (
    <Layout>
      <Products
        products={filteredProducts}
        filter={filter}
        setFilter={setFilter}
        lastPage={lastPage}
      />
    </Layout>
  );
};
