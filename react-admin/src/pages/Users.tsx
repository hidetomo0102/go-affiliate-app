import React from "react";
import { Header } from "../components/Header";
import { NavMenu } from "../components/NavMenu";

export const Users = () => {
  return (
    <div>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <NavMenu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="table-responsive">
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
                  <tr>
                    <td>1,001</td>
                    <td>random</td>
                    <td>data</td>
                    <td>placeholder</td>
                    <td>text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
