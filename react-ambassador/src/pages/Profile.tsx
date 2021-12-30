import axios from "axios";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Layout from "../components/Layout";
import { User } from "../models/user";
import { setUser } from "../redux/actions/userActions";

interface Props {
  user: User;
}

const Profile: FC<Props> = (props: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { user } = props;

  const infoSubmitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { data } = await axios.put("users/info", {
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    setUser(data);
  };

  const passwordSubmitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios.put("users/password", {
      password: password,
      password_config: passwordConfirm,
    });
  };

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
  }, [user]);

  return (
    <Layout>
      <h3>Account Information</h3>
      <form onSubmit={infoSubmitHandler}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            className="form-control"
            defaultValue={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input
            className="form-control"
            defaultValue={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-secondary" type="submit">
          Submit
        </button>
      </form>

      <h3 className="mt-4">Change Password</h3>
      <form onSubmit={passwordSubmitHandler}>
        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password Confirm</label>
          <input
            className="form-control"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-secondary" type="submit">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default connect(
  (state: { user: User }) => ({
    user: state.user,
  }),
  (dispatch: Dispatch) => ({
    setUser: (user: User) => dispatch(setUser(user)),
  })
)(Profile);
