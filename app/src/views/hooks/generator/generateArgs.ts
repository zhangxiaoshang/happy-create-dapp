import { AbiParameter } from 'abitype';
import { generateArgName } from './generateArgName';

/**
 * @description
 * @param inputs
 * @returns
 */
export function generateArgs(inputs: readonly AbiParameter[]): string[] {
  const args: string[] = inputs.map((input, index) => generateArgName(input.name, index));

  return args;
}
