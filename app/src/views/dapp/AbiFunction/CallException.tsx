import { useEffect, useState } from 'react';

function FormatError({ error }: { error: Error }) {
  const [errJson, setErrJson] = useState<any>(null);

  useEffect(() => {
    try {
      const errStr = JSON.stringify(error);

      setErrJson(JSON.parse(errStr));
    } catch (error) {
      errJson && setErrJson(null);
    }
  }, [error]);

  if (!errJson) return null;

  return <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{JSON.stringify(errJson, null, 4)}</pre>;
}

//  https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall
export function CallException({ error }: { error: Error }) {
  return (
    <>
      <FormatError error={error}></FormatError>

      <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{error.message}</pre>
    </>
  );
}
