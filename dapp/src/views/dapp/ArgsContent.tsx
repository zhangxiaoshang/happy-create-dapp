import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { InputOrOutput } from './OutputList';

interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: (i: number, val: string) => void;
}

const ArgsContent: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
  if (!inputs.length) return null;

  return (
    <Stack direction="row" spacing={2}>
      {inputs.map((input, index) => {
        return (
          <TextField
            size="small"
            sx={{ minWidth: '420px' }}
            key={index}
            label={input.name ? `${input.name} (${input.internalType})` : `<input> (${input.internalType})`}
            variant="outlined"
            onChange={(e) => onChange(index, e.target.value)}
          />
        );
      })}
    </Stack>
  );
};

export default ArgsContent;
