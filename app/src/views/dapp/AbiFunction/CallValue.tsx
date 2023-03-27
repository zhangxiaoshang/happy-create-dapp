import Typography from '@mui/material/Typography';
import { AbiParameter } from 'abitype';
import { CallValueItem } from './CallValueItem';

export interface InputOrOutput {
  internalType: string;
  name: string;
}
interface CallValueProps {
  parameter: readonly AbiParameter[];
  value: any;
}

export function CallValue({ parameter, value }: CallValueProps) {
  if (parameter.length === 0) {
    return <Typography variant="body1">no output</Typography>;
  }

  if (parameter.length === 1) {
    const ifac = parameter[0];
    return <CallValueItem internalType={ifac.internalType} name={ifac.name} output={value}></CallValueItem>;
  }

  return (
    <>
      {parameter.map((ifac, index) => (
        <CallValueItem key={index} internalType={ifac.internalType} name={ifac.name} output={value ? value[index] : undefined}></CallValueItem>
      ))}
    </>
  );
}
