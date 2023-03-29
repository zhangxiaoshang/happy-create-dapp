import { AbiParameter, AbiType } from 'abitype';
import { generateArgs } from './generateArgs';
import { generatePrimitiveType } from './generatePrimitiveType';

export function generateArgsWithTs(inputs: readonly AbiParameter[]): string[] {
  const args = generateArgs(inputs);

  const argsWithTs = inputs.map((input, index) => {
    const tsType = generatePrimitiveType(input.type as AbiType);

    // address 允许未定义
    if (input.type === 'address') {
      return `${args[index]}?: ${tsType}`;
    }
    if (input.type === 'address[]') {
      return `${args[index]}: (string | undefined)[]`;
    }

    // BigNumber作为hook参数时，还可以使用 string | number
    if (tsType === 'BigNumber') {
      return `${args[index]}: ${tsType} | string | number`;
    }

    return `${args[index]}: ${tsType}`;
  });

  return argsWithTs;
}
