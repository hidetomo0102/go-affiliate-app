import { User } from "../../models/user";

export const setUser = (user: User | null) => ({
  type: "SET_USER",
  payload: user,
});

export type setUserActionType = typeof setUser;
