import { useState } from 'react';
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

interface MethodItemProps {
  index: number;
  type: 'read' | 'write';
  name: string;
  ifac: any;
  address: string;
  library: providers.JsonRpcProvider | providers.FallbackProvider | undefined;
  signAccount?: string;
}

interface InputOrOutput {
  type: string;
  name: string;
}
interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: (i: number, val: string) => void;
}
const ArgsContent: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
  return (
    <Stack direction="row" spacing={2}>
      {inputs.map((input, index) => {
        return (
          <TextField
            size="small"
            key={index}
            label={input.name ? `${input.name} (${input.type})` : `<input> (${input.type})`}
            variant="outlined"
            onChange={(e) => onChange(index, e.target.value)}
          />
        );
      })}
    </Stack>
  );
};

interface OutputContentProps {
  outputs: InputOrOutput[];
  result: any;
}
const OutputContent: React.FunctionComponent<OutputContentProps> = ({ outputs, result }) => {
  console.log(outputs);
  if (outputs.length > 1) {
    return <Typography variant="body1">unhandled: outputs length more then one</Typography>;
  }

  const { name, type } = outputs[0];
  let val = '';

  if (result === undefined) {
    val = '';
  } else if (result instanceof BigNumber) {
    val = result.toString();
  } else {
    val = String(result);
  }

  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <Typography variant="body1">{val}</Typography>

      <Typography variant="caption">
        {!val && <img src="/shape-1.svg" style={{ width: '8px', marginRight: '0.5em' }} />}
        <span>{type}</span>
      </Typography>
    </Stack>
  );
};

export function MethodItem(props: MethodItemProps) {
  const { index, type, name, ifac, address, library, signAccount } = props;
  const [args, setArgs] = useState<(string | number)[]>([]);
  const [result, setResult] = useState<any>(); // call method result

  const changeArgs = (index: number, val: string | number) => {
    const copyArgs = [...args];
    copyArgs.splice(index, 1, val);

    setArgs(copyArgs);
  };

  const handleChange = async (event: React.SyntheticEvent, expanded: boolean) => {
    console.log({ expanded, result, os: ifac.inputs });
    if (expanded && !result && ifac.inputs.length === 0) {
      await handleQuery();
    }
  };

  const handleQuery = async () => {
    try {
      if (!(library instanceof providers.JsonRpcProvider)) {
        return console.log('invalid library:', library);
      }

      const signerOrLibrary = signAccount ? library?.getSigner(signAccount).connectUnchecked() : library;
      const contract = new Contract(address, [ifac], signerOrLibrary);
      const ret = await contract[ifac.name](...args);

      console.log(ret);
      setResult(ret);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Accordion onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
        <Typography>
          {index + 1}. {name}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {!!ifac.inputs.length && <ArgsContent inputs={ifac.inputs} onChange={changeArgs}></ArgsContent>}

        {/* query button */}
        {!!ifac.inputs.length && (
          <Stack direction="column" spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Button size="small" variant="outlined" sx={{ width: '100px' }} onClick={handleQuery}>
              {type === 'read' ? 'Query' : 'Write'}
            </Button>
          </Stack>
        )}

        {/* output && type */}
        {type === 'read' && <OutputContent outputs={ifac.outputs} result={result}></OutputContent>}
        {/* {type === 'write' && <Typography variant="body1">{JSON.stringify(result, null, 2)}</Typography>} */}
        {type === 'write' && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </AccordionDetails>
    </Accordion>
  );
}
