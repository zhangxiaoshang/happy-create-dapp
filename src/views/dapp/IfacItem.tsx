import { useState } from "react";

import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Contract, providers } from "ethers";

const IfacItem: React.FunctionComponent<{
  contractAddress: string;
  abi: any;
  library: providers.JsonRpcProvider | providers.FallbackProvider | undefined;
  ifac: any;
  signAccount?: string;
  callback: (ifac: any, ret: any) => void;
}> = ({ contractAddress, abi, library, ifac, signAccount, callback }) => {
  const [args, setArgs] = useState<(string | number)[]>([]);

  const changeArgs = (index: number, val: string | number) => {
    const copyArgs = [...args];
    copyArgs.splice(index, 1, val);

    setArgs(copyArgs);
  };

  const handleRead = async () => {
    try {
      const contract = new Contract(contractAddress, abi, library);

      const ret = await contract[ifac.name](...args);
      console.log(ret);
      callback(ifac, ret);
    } catch (error) {
      callback(ifac, error);
      console.error(error);
    }
  };

  const handleWrite = async () => {
    if (!signAccount) return;

    try {
      if (!(library instanceof providers.JsonRpcProvider)) {
        return console.log("invalid library:", library);
      }

      const signer = library?.getSigner(signAccount).connectUnchecked();
      const contract = new Contract(contractAddress, abi, signer);

      const ret = await contract[ifac.name](...args);
      console.log(ret);
      callback(ifac, ret);
    } catch (error) {
      callback(ifac, error);
      console.error(error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={ifac.name}
        titleTypographyProps={{ variant: "h6" }}
      ></CardHeader>
      <CardContent>
        <Stack direction="row" spacing={2}>
          {ifac.inputs.map((input: any, index: number) => {
            return (
              <TextField
                sx={{ mb: 2 }}
                key={`${input.name}_${index}`}
                label={`${input.name} (${input.type})`}
                variant="outlined"
                onChange={(e) => changeArgs(index, e.target.value)}
              />
            );
          })}
        </Stack>
      </CardContent>
      <CardActions>
        {ifac.stateMutability === "nonpayable" ? (
          <Button
            sx={{ width: "200px" }}
            variant="contained"
            onClick={handleWrite}
          >
            Write
          </Button>
        ) : (
          <Button
            sx={{ width: "200px" }}
            variant="contained"
            onClick={handleRead}
            disabled={!signAccount}
          >
            Read
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default IfacItem;
