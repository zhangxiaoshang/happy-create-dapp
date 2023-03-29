import { AbiType } from 'abitype';
import { bytesRegex, integerRegex, isArrayRegex } from '../regex';

type PrimitiveType = 'string' | 'boolean' | 'number' | 'object' | 'undefined';
type ExtendType = 'BigNumber';
type PrimitiveArrayType = `${PrimitiveType}[]` | `${ExtendType}[]`;

export type AllTsType = PrimitiveType | PrimitiveArrayType | ExtendType;

/**
 * @description solidityType => ts type
 * @description handled: address | bool | string | [u]int<M>
 *
 * @dev address => string
 * @dev bool => boolean
 * @dev string => string
 * @dev [u]int<M> => number (M < 53)
 * @dev [u]int<M> => BigNumber (M > 53)
 * @dev bytes<M> => string
 * @dev tuple => object
 *
 * @param solidityType
 * @returns
 */
export function generatePrimitiveType(solidityType: AbiType): AllTsType {
  const baseTypes = ['address', 'bool', 'string'];

  let primitiveType: AllTsType = 'undefined';

  // base type
  // bool | string | address
  if (baseTypes.includes(solidityType)) {
    if (solidityType === 'bool') {
      primitiveType = 'boolean';
    } else {
      primitiveType = 'string';
    }

    return primitiveType;
  }

  // int
  // MBits < 53 => number
  // MBits > 53 => BigNumber
  // https://docs.ethers.org/v5/api/contract/contract/#Contract-functionsCall
  const matchInt = integerRegex.exec(solidityType);
  if (matchInt) {
    const [_, MBits] = matchInt;
    const less53 = Number(MBits) < 53;
    if (less53) {
      primitiveType = 'number';
    } else {
      primitiveType = 'BigNumber';
    }

    return primitiveType;
  }

  // bytes<M>
  if (bytesRegex.test(solidityType)) {
    primitiveType = 'string';

    return primitiveType;
  }

  // tuple
  // todo: 应该还可以更具体
  if (solidityType === 'tuple') {
    primitiveType = 'object';

    return primitiveType;
  }

  // SolidityArray
  const matchArray = isArrayRegex.exec(solidityType);

  if (matchArray) {
    const [_, _solidityType] = matchArray;
    const _primitiveType = generatePrimitiveType(_solidityType as AbiType) as PrimitiveType | ExtendType;

    primitiveType = `${_primitiveType}[]`;
  }

  return primitiveType;
}

// type AbiType = SolidityArray   | SolidityBytes | SolidityFunction | SolidityInt  | SolidityTuple;
