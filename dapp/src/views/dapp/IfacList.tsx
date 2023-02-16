import { Contract, providers } from "ethers";

import IfacItem from "./IfacItem";

const IfacList: React.FunctionComponent<{
  contractAddress: string;
  abi: any;
  library: providers.JsonRpcProvider | providers.FallbackProvider | undefined;
  ifacs: any[];
  signAccount?: string;
  callback: (ifac: any, ret: any) => void;
}> = ({ contractAddress, abi, library, ifacs, signAccount, callback }) => {
  return (
    <>
      {ifacs.map((item, index) => (
        <IfacItem
          key={`${item.name}_${index}`}
          contractAddress={contractAddress}
          abi={abi}
          library={library}
          ifac={item}
          signAccount={signAccount}
          callback={callback}
        ></IfacItem>
      ))}
    </>
  );
};

export default IfacList;
