import { TransactionStatus } from '@usedapp/core';
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

interface SendFailProps {
  state: TransactionStatus;
}
export function SendFail(props: SendFailProps) {
  const { state } = props;

  return <ReactJson src={state}></ReactJson>;
}
