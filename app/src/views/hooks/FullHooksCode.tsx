import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { AbiFunction } from 'abitype';
import { generateHookFunction } from './generator/generateHookFunction';
import prettier from 'prettier/standalone';
import parserTypeScript from 'prettier/parser-typescript';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

interface FullHooksCodeProps {
  address: string;
  abiFuncs: AbiFunction[];
}

export function FullHooksCode(props: FullHooksCodeProps) {
  const { address, abiFuncs } = props;

  const [copied, setCopied] = useState(false);

  const methodName = (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Full hooks code with typescript</Typography>
    </AccordionSummary>
  );

  const hooks = abiFuncs.map((abiFunc) => generateHookFunction(abiFunc));
  const fullHooksCode = hooks.join('\n');

  const fullCode =
    `
  import { Contract, ContractInterface, utils } from 'ethers';
  
  const { isAddress } = utils

  const contractAddrress = '${address}';
  const contractAbi: ContractInterface = [];
  const contract = new Contract(contractAddrress, contractAbi);
  ` + fullHooksCode;

  const formattedCode = prettier.format(fullCode, {
    parser: 'typescript',
    plugins: [parserTypeScript],
  });
  return (
    <Accordion variant="outlined">
      {methodName}

      <AccordionActions>
        <CopyToClipboard
          text={formattedCode}
          onCopy={() => {
            setCopied(true);

            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }}
        >
          <IconButton color="primary" aria-label="upload picture" component="label">
            {copied ? <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon> : <ContentCopyIcon></ContentCopyIcon>}
          </IconButton>
        </CopyToClipboard>
      </AccordionActions>

      <AccordionDetails>
        <SyntaxHighlighter language="typescript" style={vs2015}>
          {formattedCode}
        </SyntaxHighlighter>
      </AccordionDetails>
    </Accordion>
  );
}
