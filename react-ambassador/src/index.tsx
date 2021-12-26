import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import axios from "axios";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { configStore } from "./redux/configStore";

axios.defaults.baseURL = "http://localhost:8000/api/ambassador";
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
