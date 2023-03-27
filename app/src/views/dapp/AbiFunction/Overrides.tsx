import { Dispatch, SetStateAction } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { InputNumber } from './InputNumber';
import { AbiFunction } from 'abitype';

export interface IOverrides {
  value?: string;
  from?: string;
  gasPrice?: string;
  gasLimit?: string;
  blockTag?: string;
}

interface OverridesProps {
  abiFunc: AbiFunction;
  overrides: IOverrides;
  setOverrides: Dispatch<SetStateAction<IOverrides>>;
}

export function Overrides({ abiFunc, overrides, setOverrides }: OverridesProps) {
  const isRead = abiFunc.stateMutability === 'view' || abiFunc.stateMutability === 'pure';

  const isPayable = abiFunc.stateMutability === 'payable';

  if (isRead) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Accordion
        sx={{
          mt: 2,
        }}
        variant="outlined"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">Overrides</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack direction="row" spacing={2}>
            {isPayable && (
              <InputNumber
                size="small"
                variant="outlined"
                label="value"
                sx={{ minWidth: '420px' }}
                onArgChange={(value) => {
                  setOverrides({ ...overrides, value: value || undefined });
                }}
              ></InputNumber>
            )}

            <TextField size="small" label="from" variant="outlined" onChange={(e) => setOverrides({ ...overrides, from: e.target.value || undefined })} />
            <InputNumber
              size="small"
              variant="outlined"
              label="gasPrice"
              sx={{ minWidth: '280px' }}
              onArgChange={(value) => {
                setOverrides({ ...overrides, gasPrice: value || undefined });
              }}
            ></InputNumber>
            <InputNumber
              size="small"
              variant="outlined"
              label="gasLimit"
              sx={{ minWidth: '280px' }}
              onArgChange={(value) => {
                setOverrides({ ...overrides, gasLimit: value || undefined });
              }}
            ></InputNumber>
            <TextField
              size="small"
              label="blockTag"
              variant="outlined"
              onChange={(e) => setOverrides({ ...overrides, blockTag: e.target.value || undefined })}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Overrides;
