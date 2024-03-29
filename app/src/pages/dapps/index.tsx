import Head from 'next/head';
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
import CodeIcon from '@mui/icons-material/Code';
import Stack from '@mui/material/Stack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import dayjs from 'dayjs';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { initDefaultDapp, getDapps, deleteDapp, IDapp } from '@/database/dapp';
import { shortenIfAddress } from '@usedapp/core';

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      <Button
        onClick={(e) => e.stopPropagation()}
        size="small"
        variant="outlined"
        endIcon={copied ? <CheckCircleOutlineIcon color="success" /> : <ContentCopyIcon />}
      >
        {label}
      </Button>
    </CopyToClipboard>
  );
}

export default function Dashboard() {
  const route = useRouter();
  const [dapps, setDapps] = useState<IDapp[]>([]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      await initDefaultDapp();

      queryDapps();
    })();
  }, []);

  const queryDapps = async () => {
    const _dapps = await getDapps();
    setDapps(_dapps);
  };

  const handlePlay = (e: React.MouseEvent, address: string, chainId: string) => {
    e.stopPropagation();
    route.push({ pathname: '/dapp', query: { address, chainId } });
  };

  const viewHooks = (e: React.MouseEvent, address: string, chainId: string) => {
    e.stopPropagation();
    route.push({ pathname: '/hooks', query: { address, chainId } });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteDapp(id);
    await queryDapps();
  };

  return (
    <>
      <Head>
        <title>DApps</title>
      </Head>

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
                sx={{ cursor: 'pointer' }}
                hover
                onClick={() =>
                  route.push({
                    pathname: '/dapp',
                    query: { address: row.address, chainId: row.chainId },
                  })
                }
              >
                <TableCell>{row.name || shortenIfAddress(row.address)}</TableCell>
                <TableCell>{row.chainId}</TableCell>
                <TableCell>{row.chainName}</TableCell>
                <TableCell>{shortenIfAddress(row.address)}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.createAt ? dayjs(row.createAt).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
                <TableCell>{row.updateAt ? dayjs(row.updateAt).format('YYYY-MM-DD HH:mm') : ''}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button size="small" variant="contained" endIcon={<SendIcon />} onClick={(e) => handlePlay(e, row.address, String(row.chainId))}>
                      Play
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      endIcon={<CodeIcon />}
                      onClick={(e) => viewHooks(e, row.address, String(row.chainId))}
                    >
                      Hooks
                    </Button>

                    <CopyButton label="Copy ABI" text={JSON.stringify(row.abi)}></CopyButton>

                    <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={(e) => handleDelete(e, row.id)}>
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
