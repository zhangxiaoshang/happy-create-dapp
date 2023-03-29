import { BigNumber } from 'ethers';
import { AbiParameter, AbiType } from 'abitype';
import { AllTsType, generatePrimitiveType } from './generatePrimitiveType';
import { isArrayRegex } from '../regex';

/**
 * @description 根据类型返回对应的默认值
 * @param tsType
 */
function getDefaultValue(tsType: AllTsType) {
  const defaultValues = {
    string: `''`,
    boolean: `false`,
    number: `0`,
    object: `{}`,
    undefined: `undefined`,
    BigNumber: `BigNumber.from(0)`,
    'string[]': `[]`,
    'boolean[]': `[]`,
    'number[]': `[]`,
    'object[]': `[]`,
    'undefined[]': `[]`,
    'BigNumber[]': `[]`,
  };

  return defaultValues[tsType];
}

/**
 * @description 没有调用查询或查询错误时，根据output.type 返回对应类型的默认值，方便dapp开发者处理业务逻辑
 * @dev 没有 output => undefined
 * @dev 有多个 output => []
 * @dev 有1个 output =>
 * @dev
 * @param outputs
 */
export function generateDefaultValue(outputs: readonly AbiParameter[]) {
  const tsTypes = outputs.map((output) => generatePrimitiveType(output.type as AbiType));

  switch (tsTypes.length) {
    case 0:
      return undefined;
    case 1:
      return getDefaultValue(tsTypes[0]);
    default:
      return [];
  }
}
