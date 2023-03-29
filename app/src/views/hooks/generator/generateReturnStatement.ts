import { AbiParameter, AbiType } from 'abitype';
import { generatePrimitiveType } from './generatePrimitiveType';

export function generateReturnStatement(outputs: readonly AbiParameter[]): string {
  const tsTypes = outputs.map((output) => generatePrimitiveType(output.type as AbiType));

  switch (tsTypes.length) {
    case 0:
      return ``;
    case 1:
      return `return value?.[0]`;
    default:
      return `return value`;
  }
}
