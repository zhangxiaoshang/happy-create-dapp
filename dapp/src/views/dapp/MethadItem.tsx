import { useState, Dispatch, SetStateAction } from 'react';
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
  internalType: string;
  name: string;
}
interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: (i: number, val: string) => void;
}
interface OverridesProps {
  value?: string;
  from?: string;
  gasPrice?: string;
  gasLimit?: string;
  blockTag?: string;
}

const ArgsContent: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
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

interface OutputContentProps {
  outputs: InputOrOutput[];
  result: any;
}

interface OutputItemProps {
  internalType: string;
  name: string;
  output: string | boolean | BigNumber | undefined;
}
const OutputItem: React.FunctionComponent<OutputItemProps> = ({ internalType, name, output }) => {
  let val = output;
  if (val === undefined) {
    return <img src="/shape-1.svg" style={{ width: '8px', marginRight: '0.5em' }} />;
  }

  if (val instanceof BigNumber) {
    return (
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Typography variant="body1">{val.toString()}</Typography>

        <Typography variant="caption">
          <span>{internalType}</span>
        </Typography>
        <Typography variant="caption">
          <span>{name}</span>
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <Typography variant="body1">{String(val)}</Typography>

      <Typography variant="caption">
        <span>{internalType}</span>
      </Typography>
      <Typography variant="caption">
        <span>{name}</span>
      </Typography>
    </Stack>
  );
};
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

const Overrides: React.FunctionComponent<{ overrides: OverridesProps; setOverrides: Dispatch<SetStateAction<OverridesProps>> }> = ({
  overrides,
  setOverrides,
}) => {
  return (
    <Accordion sx={{ mt: 2 }}>
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

export function MethodItem(props: MethodItemProps) {
  const { index, type, name, ifac, address, library, signAccount } = props;
  const [args, setArgs] = useState<(string | number)[]>([]);
  const [overrides, setOverrides] = useState<OverridesProps>({});
  const [result, setResult] = useState<any>(); // call method result

  const changeArgs = (index: number, val: string | number) => {
    const copyArgs = [...args];
    copyArgs.splice(index, 1, val);

    setArgs(copyArgs);
  };

  const handleChange = async (event: React.SyntheticEvent, expanded: boolean) => {
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
      const ret = await contract[ifac.name](...args, overrides);

      console.log(ret);
      setResult(ret);
    } catch (error: any) {
      setResult(error);
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
        {type === 'write' && <Overrides overrides={overrides} setOverrides={setOverrides}></Overrides>}

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
        {type === 'write' && <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>}
      </AccordionDetails>
    </Accordion>
  );
}
