import Image from 'next/image';
import { BigNumber } from 'ethers';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface CallValueItem {
  internalType?: string;
  name?: string;
  output: string | boolean | BigNumber | undefined;
}

export function CallValueItem({ internalType, name, output }: CallValueItem) {
  let val = output;
  if (val === undefined) {
    return (
      <Stack direction="row">
        <Image alt="icon" src="/shape-1.svg" style={{ width: '8px', marginRight: '0.5em' }} />
        <Typography variant="caption">
          <span>{internalType}</span>
        </Typography>
        <Typography variant="caption">
          <span>{name}</span>
        </Typography>
      </Stack>
    );
  }

  if (val instanceof BigNumber) {
    return (
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Typography variant="body1">{val.toString()}</Typography>

        <Typography variant="caption">
          <span>{internalType}</span>
        </Typography>
        <Typography variant="caption">
          <span>{name}</span>
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <Typography variant="body1">{String(val)}</Typography>

      <Typography variant="caption">
        <span>{internalType}</span>
      </Typography>
      <Typography variant="caption">
        <span>{name}</span>
      </Typography>
    </Stack>
  );
}
