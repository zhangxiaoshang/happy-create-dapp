import { TransactionReceipt } from '@ethersproject/abstract-provider';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

interface SendReceiptProps {
  receipt: TransactionReceipt;
}
export function SendReceipt(props: SendReceiptProps) {
  const { receipt } = props;
  console.log('rec', receipt);
  if (!receipt) return null;

  return <ReactJson src={receipt} collapsed={true} collapseStringsAfterLength={42} />;
}
