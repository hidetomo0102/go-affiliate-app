import { User } from "../../models/user";

const initialState = {
  user: {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
  } as User,
};

export const userReducer = (
  state = initialState,
  action: { type: string; payload: User }
) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
