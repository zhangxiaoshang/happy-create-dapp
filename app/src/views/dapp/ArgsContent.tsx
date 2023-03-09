import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { InputOrOutput } from './OutputList';

interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: (i: number, val: string, internalType: string) => void;
}

const ArgsContent: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
  if (!inputs.length) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      sx={{
        '.MuiFormControl-root': {
          marginBottom: '20px',
        },
      }}
    >
      {inputs.map((input, index) => {
        return (
          <TextField
            size="small"
            sx={{ minWidth: '420px' }}
            key={index}
            label={input.name ? `${input.name} (${input.internalType})` : `<input> (${input.internalType})`}
            variant="outlined"
            placeholder={/[0-9a-z]+\[\]/gi.test(input.internalType) ? (input.internalType === 'address[]' ? 'e.g: 0x123,0x456' : 'e.g: 123,456') : undefined}
            onChange={(e) => onChange(index, e.target.value, input.internalType)}
          />
        );
      })}
    </Stack>
  );
};

export default ArgsContent;
