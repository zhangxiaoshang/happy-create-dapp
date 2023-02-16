import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";
import Grid from "@mui/material/Grid";

import MethodList from "@/views/dapp/MethodList";
import IfacList from "@/views/dapp/IfacList";
import ResultPannel from "@/views/dapp/ExecResult";

import { useMethods, useDapp } from "@/hooks/dapp";

export default function Dapp() {
  const { account, library, chainId, switchNetwork } = useEthers();
  const { query } = useRouter();
  const dapp = useDapp(query.address as string);
  const { read, write } = useMethods(dapp?.abi);

  const [methodIfacs, setMethodIfacs] = useState<any[]>([]); // 可能存在同名方法
  const [execResult, setExecResult] = useState<{ ifac: any; ret: any }>({
    ifac: null,
    ret: null,
  }); // 调用结果

  useEffect(() => {
    if (chainId && dapp?.chainId && chainId !== dapp.chainId) {
      switchNetwork(dapp?.chainId);
    }
  }, [dapp?.chainId, chainId]);

  console.log({ chainId });

  const onClickMethod = (method: string) => {
    const abi = JSON.parse(dapp?.abi);

    const interfaces = abi.filter(
      (i: any) => i.type === "function" && i.name === method
    );

    setMethodIfacs(interfaces);
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <MethodList
            groupName="Read"
            methods={read}
            onClickMethod={onClickMethod}
          ></MethodList>
          <MethodList
            groupName="Write"
            methods={write}
            onClickMethod={onClickMethod}
          ></MethodList>
        </Grid>

        <Grid item xs={10}>
          <IfacList
            contractAddress={dapp?.address}
            abi={dapp?.abi}
            library={library}
            ifacs={methodIfacs}
            signAccount={account}
            callback={(ifac, ret) => setExecResult({ ifac, ret })}
          ></IfacList>

          <ResultPannel
            ifac={execResult.ifac}
            ret={execResult.ret}
          ></ResultPannel>
        </Grid>
      </Grid>
    </div>
  );
}
