import { UserData } from "../../models/user";

const initialState = {
  user: {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
  } as UserData,
};

export const userReducer = (
  state = initialState,
  action: { type: string; payload: UserData }
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
