import { Dispatch, SetStateAction } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { NumberInput } from './NumberInput';

interface Overrides {
  value?: string;
  from?: string;
  gasPrice?: string;
  gasLimit?: string;
  blockTag?: string;
}

interface OverridesProps {
  ifac: any;
  overrides: Overrides;
  setOverrides: Dispatch<SetStateAction<Overrides>>;
}

const Overrides: React.FunctionComponent<OverridesProps> = ({ ifac, overrides, setOverrides }) => {
  const isPayable = ifac.stateMutability === 'payable';

  return (
    <Accordion sx={{ mt: 2 }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2">Overrides</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack direction="row" spacing={2}>
          {isPayable && (
            <NumberInput
              size="small"
              variant="outlined"
              label="value"
              sx={{ minWidth: '420px' }}
              callback={(value) => {
                setOverrides({ ...overrides, value });
              }}
            ></NumberInput>
          )}

          <TextField size="small" label="from" variant="outlined" onChange={(e) => setOverrides({ ...overrides, from: e.target.value })} />
          <NumberInput
            size="small"
            variant="outlined"
            label="gasPrice"
            sx={{ minWidth: '280px' }}
            callback={(value) => {
              setOverrides({ ...overrides, gasPrice: value });
            }}
          ></NumberInput>
          <NumberInput
            size="small"
            variant="outlined"
            label="gasLimit"
            sx={{ minWidth: '280px' }}
            callback={(value) => {
              setOverrides({ ...overrides, gasLimit: value });
            }}
          ></NumberInput>
          <TextField size="small" label="blockTag" variant="outlined" onChange={(e) => setOverrides({ ...overrides, blockTag: e.target.value })} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default Overrides;
