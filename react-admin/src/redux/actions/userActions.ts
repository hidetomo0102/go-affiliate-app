import { UserData } from "../../models/user";

export const setUser = (user: UserData) => ({
  type: "SET_USER",
  payload: user,
});
