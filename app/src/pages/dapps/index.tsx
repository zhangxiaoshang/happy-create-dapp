import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import dayjs from 'dayjs';

import { getDapps, deleteDapp } from '@/database/dapp';

export default function Dashboard() {
  const route = useRouter();
  const [dapps, setDapps] = useState<any[]>([]);

  useEffect(() => {
    queryDapps();
  }, []);

  const queryDapps = async () => {
    const _dapps = await getDapps();
    setDapps(_dapps);
  };

  const handlePlay = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    route.push({ pathname: '/dapp', query: { address } });
  };
  const handleDelete = async (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    await deleteDapp(address);
    await queryDapps();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>ChainId</TableCell>
            <TableCell>Network</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Create At</TableCell>
            <TableCell>Update At</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dapps.map((row) => (
            <TableRow
              key={row.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
              hover
              onClick={() =>
                route.push({
                  pathname: '/dapp',
                  query: { address: row.address },
                })
              }
            >
              <TableCell>{row.name || row.address}</TableCell>
              <TableCell>{row.chainId}</TableCell>
              <TableCell>{row.chainName}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.createAt ? dayjs(row.createAt).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
              <TableCell>{row.updateAt ? dayjs(row.updateAt).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button size="small" variant="contained" endIcon={<SendIcon />} onClick={(e) => handlePlay(e, row.address)}>
                    Play
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={(e) => handleDelete(e, row.address)}>
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
