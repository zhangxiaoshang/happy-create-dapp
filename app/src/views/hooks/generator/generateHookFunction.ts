import { AbiFunction } from 'abitype';
import { generateHookName } from './generateHookName';
import { generateArgs } from './generateArgs';
import { generateArgsWithTs } from './generateArgsWithTs';
import { generateReturnTypes } from './generateReturnTypes';
import { generateValidateArgsStatement } from './generateValidateArgsStatement';
import { generateDefaultValue } from './generateDefaultValue';
import { generateReturnStatement } from './generateReturnStatement';

/**
 *

  import { Contract, ContractInterface, utils } from 'ethers';
  
  const { isAddress } = utils

  const contractAddrress = '';
  const contractAbi: ContractInterface = [];
  const contract = new Contract(contractAddrress, contractAbi);

 */

export function generateHookFunction(abiFunc: AbiFunction) {
  const hookName = generateHookName(abiFunc.name);
  const argsWithTs = generateArgsWithTs(abiFunc.inputs);
  const returnTypes = generateReturnTypes(abiFunc.outputs);

  const validateArgsStatement = generateValidateArgsStatement(abiFunc.inputs);

  const args = generateArgs(abiFunc.inputs); // call args
  const defaultValue = generateDefaultValue(abiFunc.outputs);
  const returnStatement = generateReturnStatement(abiFunc.outputs);

  return `


  export function ${hookName}(${argsWithTs.join(', ')}) ${returnTypes} {
    ${validateArgsStatement}

    const call = {
      contract,
      method: "${abiFunc.name}",
      args: [${args.join(', ')}],
    };
    const { value, error } = useCall(validArgs && call) ?? {};
    
    if (error || !value) {
      return ${defaultValue};
    }

    ${returnStatement}
  }
  `;
}
