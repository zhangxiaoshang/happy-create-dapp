import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

import { AbiFunction } from 'abitype';
import { providers, Contract, ContractInterface } from 'ethers';
import { ChainId, useCall, CallResult, useConfig } from '@usedapp/core';

import { CallException } from './CallException';
import { CallValue } from './CallValue';

interface ReadFunctionProps {
  chainId: ChainId;
  address: string;

  args: (string | number | string[] | number[])[];
  abiFunc: AbiFunction;
}
export function CallFunction(props: ReadFunctionProps) {
  const { chainId, address, args, abiFunc } = props;
  const { readOnlyUrls } = useConfig();

  const [callValue, setCallValue] = useState<any>(null); // call成功 https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall
  const [callException, setCallException] = useState<Error>(); // call失败 https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall

  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    setCallValue(null);
    setCallException(undefined);

    try {
      if (!readOnlyUrls) return;

      const readOnlyUrl = readOnlyUrls[chainId];
      let provider: providers.Provider;

      switch (typeof readOnlyUrl) {
        case 'string':
          provider = providers.getDefaultProvider(readOnlyUrl);
          break;
        case 'function':
          provider = readOnlyUrl();
          break;
        default:
          provider = readOnlyUrl;
      }

      const contract = new Contract(address, [abiFunc] as ContractInterface, provider);
      const val = await contract[abiFunc.name](...args);

      setCallValue(val);
      setCallException(undefined);
    } catch (error: any) {
      setCallValue(undefined);
      setCallException(error);
    } finally {
      setLoading(false);
    }
  };

  // useCall可以使用MultCall
  const callResult: CallResult<Contract, string> = useCall(
    abiFunc.inputs.length === 0 && {
      contract: new Contract(address, [abiFunc] as ContractInterface),
      method: abiFunc.name,
      args,
    },
    {
      chainId,
    },
  );

  useEffect(() => {
    if (callResult?.error) {
      setCallException(callResult.error);
    }
    if (callResult?.value) {
      setCallValue(callResult.value);
    }
  }, [callResult]);

  return (
    <>
      {/* button */}
      {abiFunc.inputs.length > 0 && (
        <LoadingButton size="small" variant="outlined" sx={{ width: '100px', mb: 2 }} onClick={handleQuery} loading={loading} loadingIndicator="Loading...">
          <span>Query</span>
        </LoadingButton>
      )}

      {/* output */}
      {callValue !== null && <CallValue parameter={abiFunc.outputs} value={callValue}></CallValue>}

      {!!callException && <CallException error={callException}></CallException>}
    </>
  );
}
