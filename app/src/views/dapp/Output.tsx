import OutputList from './OutputList';

interface OutputProps {
  isRead: boolean;
  isWrite: boolean;
  ifac: any;
  result: any;
}

export function Output(props: OutputProps) {
  const { isRead, isWrite, ifac, result } = props;

  if (isRead) return <OutputList outputs={ifac.outputs} result={result}></OutputList>;

  if (isWrite) return <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>;

  return null;
}
