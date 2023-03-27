import Stack from '@mui/material/Stack';
import { FunctionArgInput } from './FunctionArgInput';
import { AbiParameter } from 'abitype';
import { OnArgsChangeFn } from '../AbiFunction';

interface FunctionArgsProps {
  inputs: readonly AbiParameter[];
  onArgsChange: OnArgsChangeFn;
}

export function FunctionArgs({ inputs, onArgsChange }: FunctionArgsProps) {
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
        return <FunctionArgInput key={index} index={index} name={input.name} internalType={input.internalType} onArgsChange={onArgsChange}></FunctionArgInput>;
      })}
    </Stack>
  );
}
