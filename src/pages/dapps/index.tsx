import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { getDapps } from "@/database/dapp";

export default function Dashboard() {
  const route = useRouter();
  const [dapps, setDapps] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const _dapps = await getDapps();

      setDapps(_dapps);
    })();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>ChainId</TableCell>
            <TableCell>Network</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dapps.map((row) => (
            <TableRow
              key={row.address}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
              onClick={() =>
                route.push({
                  pathname: "/dapp",
                  query: { address: row.address },
                })
              }
            >
              <TableCell>{row.name || row.address}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.chainId}</TableCell>
              <TableCell>{row.network}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
