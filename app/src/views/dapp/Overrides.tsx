import { Dispatch, SetStateAction } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

interface OverridesProps {
  value?: string;
  from?: string;
  gasPrice?: string;
  gasLimit?: string;
  blockTag?: string;
}

const Overrides: React.FunctionComponent<{ overrides: OverridesProps; setOverrides: Dispatch<SetStateAction<OverridesProps>> }> = ({
  overrides,
  setOverrides,
}) => {
  return (
    <Accordion sx={{ mt: 2 }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2">Overrides</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack direction="row" spacing={2}>
          <TextField size="small" label="value" variant="outlined" onChange={(e) => setOverrides({ ...overrides, value: e.target.value })} />
          <TextField size="small" label="from" variant="outlined" onChange={(e) => setOverrides({ ...overrides, from: e.target.value })} />
          <TextField size="small" label="gasPrice" variant="outlined" onChange={(e) => setOverrides({ ...overrides, gasPrice: e.target.value })} />
          <TextField size="small" label="gasLimit" variant="outlined" onChange={(e) => setOverrides({ ...overrides, gasLimit: e.target.value })} />
          <TextField size="small" label="blockTag" variant="outlined" onChange={(e) => setOverrides({ ...overrides, blockTag: e.target.value })} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default Overrides;
