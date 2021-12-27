import axios from "axios";
import { FC, useState } from "react";
import { Filter } from "../models/filter";
import { Product } from "../models/product";

interface Props {
  products: Product[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  lastPage: number;
}

interface Notify {
  show: boolean;
  error: boolean;
  message: string;
}

const Products: FC<Props> = (props: Props) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [notify, setNotify] = useState<Notify>({
    show: false,
    error: false,
    message: "",
  });

  const { products, filter, setFilter, lastPage } = props;

  const search = (s: string) => {
    setFilter({
      ...filter,
      page: 1,
      s,
    });
  };

  const sort = (sort: string) => {
    setFilter({
      ...filter,
      page: 1,
      sort,
    });
  };

  const load = () => {
    setFilter({
      ...filter,
      page: filter.page + 1,
    });
  };

  const select = (id: number) => {
    if (selected.some((s) => s === id)) {
      setSelected(selected.filter((s) => s !== id));
      return;
    }
    setSelected([...selected, id]);
  };

  const generate = async () => {
    try {
      const { data } = await axios.post("links", { products: selected });
      setNotify({
        show: true,
        error: false,
        message: `Link generated: http://localhost:5000/${data.code}`,
      });
    } catch (e: any) {
      setNotify({
        show: true,
        error: true,
        message: "Login first to generate link!",
      });
    } finally {
      setTimeout(() => {
        setNotify({
          show: false,
          error: false,
          message: "",
        });
      }, 3000);
    }
  };

  let button;
  if (filter.page !== lastPage) {
    button = (
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-primary" onClick={load}>
          Load More
        </button>
      </div>
    );
  }

  let generateButton, info;
  if (selected.length > 0) {
    generateButton = (
      <div className="input-group-append">
        <button className="btn btn-info" onClick={generate}>
          Generate Link
        </button>
      </div>
    );
  }

  if (notify.show) {
    info = (
      <div className="col-md-12 mb-4">
        <div
          className={notify.error ? "alert alert-danger" : "alert alert-info"}
          role="alert"
        >
          {notify.message}
        </div>
      </div>
    );
  }
  return (
    <>
      {info}

      <div className="col-md-12 mb-4 input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          onChange={(e) => search(e.target.value)}
        />
        {generateButton}
        <div className="input-group-append">
          <select
            className="form-select"
            onChange={(e) => sort(e.target.value)}
          >
            <option>Select</option>
            <option value="asc">Price Ascending</option>
            <option value="desc">Price Descending</option>
          </select>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {products.map((product) => {
          return (
            <div
              className="col"
              key={product.id}
              onClick={() => select(product.id)}
            >
              <div
                className={
                  selected.some((s) => s === product.id)
                    ? "card shadow-sm selected"
                    : "card shadow-sm"
                }
              >
                <img src={product.image} alt={product.title} height={200} />

                <div className="card-body">
                  <p className="card-text">{product.title}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">${product.price}</small>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {button}
    </>
  );
};

export default Products;
