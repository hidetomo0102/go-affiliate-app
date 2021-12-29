import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const getRankings = async () => {
      const { data } = await axios.get("rankings");
      setRankings(data);
    };
    getRankings();
  }, []);

  return (
    <Layout>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(rankings).map((key: any, index) => {
              return (
                <tr key={key}>
                  <td>{index + 1}</td>
                  <td>{key}</td>
                  <td>{rankings[key]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
