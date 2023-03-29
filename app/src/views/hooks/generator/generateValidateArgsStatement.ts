import { AbiParameter } from 'abitype';
import { generateArgName } from './generateArgName';

export function generateValidateArgsStatement(inputs: readonly AbiParameter[]): string {
  let statements: string[] = [];

  inputs.forEach((input, index) => {
    // address 参数不能为空
    // address 参数必须是有效地址
    if (input.type === 'address') {
      const argName = generateArgName(input.name);
      statements.push(argName);
      statements.push(`isAddress(${argName})`);
    }

    if (input.type === 'address[]') {
      // todo
    }
  });

  if (!statements.length) return '';

  return `const validArgs =` + statements.join(' && ');
}
