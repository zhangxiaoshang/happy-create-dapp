import TextField from '@mui/material/TextField';
import { InputNumber } from './InputNumber';
import { OnArgsChangeFn } from '../AbiFunction';

interface FunctionArgInputProps {
  index: number;
  name: string | undefined;
  internalType?: string;
  onArgsChange: OnArgsChangeFn;
}

const getInputPlaceholder = (type?: string) => {
  const arrayReg = /[0-9a-z]+\[\]/gi; // 数组类型参数：address[]、uint256[]、int128[]...
  const isArrayType = type && arrayReg.test(type);

  let text: string | undefined;
  if (isArrayType) {
    if (type === 'address[]') {
      text = 'e.g: 0x123,0x456';
    } else {
      text = 'e.g: 123,456';
    }
  }

  return text;
};

/**
 * @dev 如果是数字类型的参数，支持转换
 * @param props
 * @returns
 */
export function FunctionArgInput(props: FunctionArgInputProps) {
  const { index, name, internalType, onArgsChange } = props;
  const isNumberType = internalType && /[u]?int\d+$/.test(internalType); // uint256|int128...

  return isNumberType ? (
    <InputNumber
      size="small"
      sx={{ minWidth: '420px' }}
      variant="outlined"
      label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
      placeholder={getInputPlaceholder(internalType)}
      onArgChange={(val) => onArgsChange(index, val, internalType)}
    ></InputNumber>
  ) : (
    <TextField
      size="small"
      sx={{ minWidth: '420px' }}
      label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
      variant="outlined"
      placeholder={getInputPlaceholder(internalType)}
      onChange={(e) => onArgsChange(index, e.target.value, internalType)}
    />
  );
}
