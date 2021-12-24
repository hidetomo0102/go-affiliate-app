import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { configStore } from "./redux/store";
import { Provider } from "react-redux";

axios.defaults.baseURL = "http://localhost:5555/api/admin";
axios.defaults.withCredentials = true;

const store = configStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
