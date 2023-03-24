import Stack from '@mui/material/Stack';
import { InputOrOutput } from './OutputList';
import { ChangeArgFn } from './OneMethod';
import { MethodArgItem } from './MethodArgItem';

interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: ChangeArgFn;
}

const MethodArgs: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
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
        return <MethodArgItem key={index} index={index} name={input.name} internalType={input.internalType} onChange={onChange}></MethodArgItem>;
      })}
    </Stack>
  );
};

export default MethodArgs;
