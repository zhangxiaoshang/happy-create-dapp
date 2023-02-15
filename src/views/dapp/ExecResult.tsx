import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { BigNumber } from "ethers";

const ResultPannel: React.FunctionComponent<{ ifac: any; ret: any }> = ({
  ifac,
  ret,
}) => {
  let contents: any[] = [];

  if (!ret) return null;

  // render Error
  if (ret instanceof Error) {
    return <code>{JSON.stringify(ret)}</code>;
  }

  // Transaction
  if (ret?.hash) {
    contents.push(`tx hash: ${ret.hash}`);
  } else if (ret instanceof BigNumber) {
    contents.push(ret.toString());
  } else {
    contents.push(String(ret));
  }

  return (
    <Card>
      <CardHeader
        title="Result"
        titleTypographyProps={{ variant: "h6" }}
      ></CardHeader>
      <CardContent>
        {ifac?.outputs?.length
          ? ifac?.outputs.map((output: any, index: number) => (
              <div key={`${output.name}_${output.type}_${index}`}>
                <Typography variant="h6" gutterBottom>
                  {output.name} ({output.type}):
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {contents[index]}
                </Typography>
              </div>
            ))
          : contents.join(" ")}
      </CardContent>
    </Card>
  );
};

export default ResultPannel;
