import { useState } from 'react';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';

import { utils } from 'ethers';

import { addDapp } from '@/database/dapp';
import { networks } from '@/pages/_app';

export default function Create() {
  const route = useRouter();
  const [dapp, setDapp] = useState({
    chainId: 1,
    name: '',
    address: '',
    abi: '',
    description: '',
  });

  const addressError = !!dapp.address && !utils.isAddress(dapp.address);

  const handleCreate = async () => {
    await addDapp(dapp);

    route.push({
      pathname: '/dapp',
      query: {
        address: dapp.address,
      },
    });
  };

  return (
    <CardContent>
      <Stack spacing={2}>
        <FormControl fullWidth required>
          <InputLabel>Chain</InputLabel>
          <Select value={dapp.chainId} label="Chain" onChange={(e) => setDapp({ ...dapp, chainId: Number(e.target.value) })}>
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
  );
}
