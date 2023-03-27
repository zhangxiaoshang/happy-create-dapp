import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

import { AbiFunction } from 'abitype';
import { providers, Contract, ContractInterface } from 'ethers';
import { ChainId, useCall, CallResult, useConfig, useSigner, useContractFunction, transactionErrored } from '@usedapp/core';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { SendReceipt } from './SendReceipt';
import { SendFail } from './SendFail';
import { IOverrides } from './Overrides';

interface SendFunctionProps {
  chainId: ChainId;
  address: string;

  args: (string | number | string[] | number[])[];
  overrides: IOverrides;
  abiFunc: AbiFunction;
}
export function SendFunction(props: SendFunctionProps) {
  const { address, args, overrides, abiFunc } = props;
  const [loading, setLoading] = useState(false);

  const signer = useSigner();
  const { state, send } = useContractFunction(new Contract(address, [abiFunc] as ContractInterface, signer), abiFunc.name);
  const [sendReceipt, setSendReceipt] = useState<TransactionReceipt>();

  useEffect(() => {
    if (transactionErrored(state)) {
      setSendReceipt(undefined);
    }
  }, [state]);

  const handleSend = async () => {
    setLoading(true);

    const receipt = await send(...args, overrides);
    setSendReceipt(receipt);

    setLoading(false);
  };

  return (
    <>
      {/* button */}

      {abiFunc.inputs.length > 0 && (
        <LoadingButton size="small" variant="outlined" sx={{ width: '100px', mb: 2 }} onClick={handleSend} loading={loading} loadingIndicator="Loading...">
          <span>Send</span>
        </LoadingButton>
      )}

      {!!sendReceipt && <SendReceipt receipt={sendReceipt}></SendReceipt>}

      {transactionErrored(state) && <SendFail state={state}></SendFail>}
    </>
  );
}
