import { createStore } from "redux";

import { userReducer } from "./reducers/userReducer";

export const configStore = () => createStore(userReducer);
