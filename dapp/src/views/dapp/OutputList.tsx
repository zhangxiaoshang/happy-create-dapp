import Typography from '@mui/material/Typography';
import OutputItem from './OutputItem';

export interface InputOrOutput {
  internalType: string;
  name: string;
}
interface OutputContentProps {
  outputs: InputOrOutput[];
  result: any;
}

const OutputContent: React.FunctionComponent<OutputContentProps> = ({ outputs, result }) => {
  if (outputs.length === 0) {
    return <Typography variant="body1">no output</Typography>;
  }

  if (outputs.length === 1) {
    const ifac = outputs[0];
    return <OutputItem internalType={ifac.internalType} name={ifac.name} output={result}></OutputItem>;
  }

  return (
    <>
      {outputs.map((ifac, index) => (
        <OutputItem key={index} internalType={ifac.internalType} name={ifac.name} output={result ? result[index] : undefined}></OutputItem>
      ))}
    </>
  );
};

export default OutputContent;
