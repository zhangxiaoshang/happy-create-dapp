import { useState, Dispatch, SetStateAction } from 'react';
import { providers, Contract, BigNumber } from 'ethers';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import ArgsContent from './ArgsContent';
import Overrides from './Overrides';

interface OutputItemProps {
  internalType: string;
  name: string;
  output: string | boolean | BigNumber | undefined;
}

const OutputItem: React.FunctionComponent<OutputItemProps> = ({ internalType, name, output }) => {
  let val = output;
  if (val === undefined) {
    return (
      <Stack direction="row">
        <img src="/shape-1.svg" style={{ width: '8px', marginRight: '0.5em' }} />
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
};

export default OutputItem;
