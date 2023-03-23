import { useState } from 'react';
import { providers, Contract } from 'ethers';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import ArgsContent from './ArgsContent';
import Overrides from './Overrides';
import OutputList from './OutputList';

interface MethodItemProps {
  disabled?: boolean;
  index: number;
  type: 'read' | 'write';
  name: string;
  ifac: any;
  address: string;
  library: providers.JsonRpcProvider | providers.FallbackProvider | undefined;
  signAccount?: string;
}

interface OverridesProps {
  value?: string;
  from?: string;
  gasPrice?: string;
  gasLimit?: string;
  blockTag?: string;
}

export type ChangeArgFn = (index: number, val: string | number, internalType: string) => void;

export function MethodItem(props: MethodItemProps) {
  const { disabled, index, type, name, ifac, address, library, signAccount } = props;
  const [args, setArgs] = useState<(string | number | string[] | number[])[]>([]);
  const [overrides, setOverrides] = useState<OverridesProps>({});
  const [result, setResult] = useState<any>(); // call method result

  const changeArgs: ChangeArgFn = (index: number, val: string | number, internalType: string) => {
    const copyArgs = [...args];

    // address[]
    // 将输入的字符串转换为数组
    // 0x123,0x456 => ["0x123","0x456"]
    const arrayReg = /[0-9a-z]+\[\]/gi;
    if (arrayReg.test(internalType)) {
      const valStr = String(val).replaceAll(' ', '');
      if (valStr) {
        const addrs = valStr.split(',');
        copyArgs.splice(index, 1, addrs);
      } else {
        copyArgs.splice(index, 1, []);
      }
    } else {
      copyArgs.splice(index, 1, val);
    }

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

      console.log('args', args);
      const signerOrLibrary = signAccount ? library?.getSigner(signAccount).connectUnchecked() : library;
      const contract = new Contract(address, [ifac], signerOrLibrary);
      const ret = await contract[ifac.name](...args, overrides);

      setResult(ret);
    } catch (error: any) {
      setResult(error);
      console.error(error);
    }
  };

  return (
    <Accordion onChange={handleChange} variant="outlined" disabled={disabled}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
        <Typography>
          {index + 1}. {name}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <ArgsContent inputs={ifac.inputs} onChange={changeArgs}></ArgsContent>
        {/* only write method has overrides */}
        {type === 'write' && <Overrides overrides={overrides} setOverrides={setOverrides}></Overrides>}

        {/* inputs.length > 1 need query button, otherwise auto query */}
        {!!ifac.inputs.length && (
          <Button size="small" variant="outlined" sx={{ width: '100px', mt: 2 }} onClick={handleQuery}>
            {type === 'read' ? 'Query' : 'Write'}
          </Button>
        )}

        {/* read output */}
        {type === 'read' && <OutputList outputs={ifac.outputs} result={result}></OutputList>}
        {/* write output */}
        {type === 'write' && <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>}
      </AccordionDetails>
    </Accordion>
  );
}
