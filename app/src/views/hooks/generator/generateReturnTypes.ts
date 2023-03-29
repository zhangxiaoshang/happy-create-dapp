import { AbiParameter, AbiType } from 'abitype';
import { AllTsType, generatePrimitiveType } from './generatePrimitiveType';

// todo: test
// output 单个数据
// output 多个数据（tuple）
export function generateReturnTypes(outputs: readonly AbiParameter[]): string {
  const tsTypes = outputs.map((output) => generatePrimitiveType(output.type as AbiType));

  if (tsTypes.length === 0) return '';

  if (tsTypes.length === 1) return `: ${tsTypes.join('')}`;

  // output > 1
  return `: [${tsTypes.join(', ')}]`;
}
