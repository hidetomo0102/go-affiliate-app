import axios from "axios";
import { useEffect, useState } from "react";

import { Layout } from "../components/Layout";
import { UserData } from "../models/User";

export const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [page, setPage] = useState(0);

  const perPage = 10;

  useEffect(() => {
    const getAmbassadors = async () => {
      const { data } = await axios.get("ambassadors");
      setUsers(data);
    };
  }, []);

  return (
    <Layout>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Header</th>
            <th scope="col">Header</th>
            <th scope="col">Header</th>
            <th scope="col">Header</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(page * perPage, (page + 1) * perPage).map((user) => {
            return (
              <tr>
                <td>{user.id}</td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
};
