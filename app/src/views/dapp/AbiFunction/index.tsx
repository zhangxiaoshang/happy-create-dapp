import { useEffect, useState } from 'react';
import { providers, Contract, ContractInterface, getDefaultProvider } from 'ethers';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import { AbiFunction, AbiParameter } from 'abitype';
import { ChainId, useCall, useEthers, CallResult, useConfig, useSigner, useContractFunction, transactionErrored } from '@usedapp/core';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
// import MethodArgs from '../MethodArgs';
import { FunctionArgs } from './FunctionArgs';
import { Overrides, IOverrides } from './Overrides';

import { CallFunction } from './CallFunction';
import { SendFunction } from './SendFunction';

interface MethodItemProps {
  index: number;

  abiFunc: AbiFunction;
  address: string;
  chainId: ChainId;
}

export type OnArgsChangeFn = (index: number, val: string | number, internalType?: string) => void;

/**
 * @dev 判断是否是数字类型的参数
 * @param type
 */
function isArrayArg(type?: string) {
  // 0x123,0x456 => ["0x123","0x456"]
  const arrayReg = /[0-9a-z]+\[\]/gi;

  return type && arrayReg.test(type);
}

/**
 * @dev 将输入的字符串转换为数组类型
 * @param val
 */
function parseArrayArgs(val: string) {
  const valStr = String(val).replaceAll(' ', ''); // 去除空白

  let arrayArg: string[] = [];
  if (valStr) {
    arrayArg = valStr.split(',');
  }

  return arrayArg;
}

export function AbiFunction(props: MethodItemProps) {
  const { chainId: connectChainId, account } = useEthers();

  const { index, abiFunc, address, chainId } = props;
  const [args, setArgs] = useState<(string | number | string[] | number[])[]>([]);
  const [overrides, setOverrides] = useState<IOverrides>({});

  const isRead = abiFunc.stateMutability === 'view' || abiFunc.stateMutability === 'pure';
  const isWrite = abiFunc.stateMutability === 'payable' || abiFunc.stateMutability === 'nonpayable';

  const disabled = !isRead && (!account || connectChainId !== chainId);

  const onArgsChange: OnArgsChangeFn = (index, val, internalType) => {
    const copyArgs = [...args];

    // eg: address[]
    // 将输入的字符串转换为数组
    if (isArrayArg(internalType)) {
      const arrayArg = parseArrayArgs(String(val));
      copyArgs.splice(index, 1, arrayArg);
    } else {
      copyArgs.splice(index, 1, val);
    }

    setArgs(copyArgs);
  };

  const methodName = (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>
        {index + 1}. {abiFunc.name}
      </Typography>
    </AccordionSummary>
  );

  return (
    <Accordion variant="outlined" disabled={disabled}>
      {methodName}

      <AccordionDetails>
        <FunctionArgs inputs={abiFunc.inputs} onArgsChange={onArgsChange}></FunctionArgs>
        <Overrides abiFunc={abiFunc} overrides={overrides} setOverrides={setOverrides}></Overrides>

        {isRead && <CallFunction chainId={chainId} address={address} args={args} abiFunc={abiFunc}></CallFunction>}
        {isWrite && <SendFunction chainId={chainId} address={address} args={args} overrides={overrides} abiFunc={abiFunc}></SendFunction>}
      </AccordionDetails>
    </Accordion>
  );
}
