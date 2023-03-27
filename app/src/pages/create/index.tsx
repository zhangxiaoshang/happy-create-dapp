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
    id: '',
    chainId: 31337,
    chainName: 'Hardhat',
    name: '',
    address: '',
    abi: [],
    description: '',
  });

  const addressError = !!dapp.address && !utils.isAddress(dapp.address);

  const handleNetworkChanged = (e: SelectChangeEvent<number>) => {
    const chainId = Number(e.target.value);
    const chain = networks.find((c) => c.chainId === chainId);

    setDapp({ ...dapp, chainId, chainName: chain?.chainName ?? shortenIfAddress(dapp.address) });
  };

  const handleABIChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    try {
      const str = e.target.value;
      const _json = JSON.parse(str);

      const abi: any[] = _json.abi || _json;
      const name = _json?.contractName;

      setDapp({ ...dapp, abi, name });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    await addDapp(dapp);

    route.push({ pathname: '/dapp', query: { chainId: dapp.chainId, address: dapp.address } });
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
            <Select value={dapp.chainId} label="Chain" onChange={handleNetworkChanged}>
              {networks.map((network) => (
                <MenuItem key={network.chainId} value={network.chainId}>
                  {(network.chainId === 56 || network.chainId === 97) && 'BSC '}
                  {network.chainName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Contract Address"
            variant="outlined"
            required
            value={dapp.address}
            onChange={(e) => setDapp({ ...dapp, address: e.target.value })}
            error={addressError}
            helperText={addressError ? 'validAddress' : ''}
          />

          <TextField required label="ABI or Artiface" variant="outlined" onChange={handleABIChanged} />

          <TextField label="Name" variant="outlined" value={dapp.name} onChange={(e) => setDapp({ ...dapp, name: e.target.value })} />
          <TextField label="Description" variant="outlined" onChange={(e) => setDapp({ ...dapp, description: e.target.value })} />

          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </Stack>
      </CardContent>
    </>
  );
}
