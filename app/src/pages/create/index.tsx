import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';

import { utils } from 'ethers';
import { shortenIfAddress } from '@usedapp/core';

import { addDapp, IDapp } from '@/database/dapp';
import { networks } from '@/pages/_app';

export default function Create() {
  const route = useRouter();
  const [dapp, setDapp] = useState<IDapp>({
    chainId: 31337,
    chainName: '',
    name: '',
    address: '',
    abi: '',
    description: '',
  });

  const addressError = !!dapp.address && !utils.isAddress(dapp.address);

  const handleNetworkChanged = (e: SelectChangeEvent<number>) => {
    const chainId = Number(e.target.value);
    const chain = networks.find((c) => c.chainId === chainId);

    setDapp({ ...dapp, chainId, chainName: chain?.chainName ?? shortenIfAddress(dapp.address) });
  };

  const handleCreate = async () => {
    await addDapp(dapp);

    route.push({ pathname: '/dapp', query: { address: dapp.address } });
  };

  return (
    <>
      <Head>
        <title>Create</title>
      </Head>
      <CardContent sx={{ ml: 'auto', mr: 'auto', maxWidth: 'sm' }}>
        <Stack spacing={2}>
          <FormControl fullWidth required>
            <InputLabel>Chain</InputLabel>
            <Select defaultValue={dapp.chainId} label="Chain" onChange={handleNetworkChanged}>
              {networks.map((network) => (
                <MenuItem key={network.chainId} value={network.chainId}>
                  {network.chainName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Contract Address"
            variant="outlined"
            required
            onChange={(e) => setDapp({ ...dapp, address: e.target.value })}
            error={addressError}
            helperText={addressError ? 'validAddress' : ''}
          />

          <TextField required label="ABI" variant="outlined" onChange={(e) => setDapp({ ...dapp, abi: e.target.value })} />

          <TextField label="Name" variant="outlined" onChange={(e) => setDapp({ ...dapp, name: e.target.value })} />
          <TextField label="Description" variant="outlined" onChange={(e) => setDapp({ ...dapp, description: e.target.value })} />

          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </Stack>
      </CardContent>
    </>
  );
}
