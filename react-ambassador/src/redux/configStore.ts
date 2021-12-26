import { createStore } from "redux";

import { userReducer } from "./reducers/userReducers";

export const configStore = () => createStore(userReducer);
