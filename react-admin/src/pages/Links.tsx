import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";

import { Layout } from "../components/Layout";
import { Link } from "../models/link";

// TODO propsの型定義やる
export const Links = (props: any) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [page, setPage] = useState(0);

  const perPage = 10;

  const getLinksForUser = async () => {
    const { data } = await axios.get(`users/${props.match.params.id}/links`);
    setLinks(data);
  };

  useEffect(() => {
    getLinksForUser();
  }, []);

  return (
    <Layout>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.slice(page * perPage, (page + 1) * perPage).map((link) => {
            return (
              <TableRow key={link.id}>
                <TableCell>{link.id}</TableCell>
                <TableCell>{link.code}</TableCell>
                <TableCell>{link.orders.length}</TableCell>
                <TableCell>
                  {link.orders.reduce((s, o) => s + o.total, 0)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TablePagination
            count={links.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={perPage}
            rowsPerPageOptions={[]}
          />
        </TableFooter>
      </Table>
    </Layout>
  );
};
