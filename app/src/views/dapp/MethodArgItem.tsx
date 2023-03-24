import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { ChangeArgFn } from './OneMethod';
import { utils } from 'ethers';
import { units } from '@/constants';
import { NumberInput } from './NumberInput';

interface ArgItemProps {
  index: number;
  name: string | undefined;
  internalType: string;
  onChange: ChangeArgFn;
}

interface AutocompleteOption {
  unit: string;
  decimals: number;
  value: string;
  label: string;
}

const getInputPlaceholder = (type: string) => {
  const arrayReg = /[0-9a-z]+\[\]/gi; // 数组类型参数：address[]、uint256[]、int128[]...
  const isArrayType = arrayReg.test(type);

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

// 获取小数位数
const getNumberDecimals = (num: string | number) => {
  const numStr = String(num).split('.');

  const decimalPart = numStr[1];
  if (!decimalPart) return 0;

  return String(decimalPart).length;
};

/**
 * @dev 如果是数字类型的参数，支持转换
 * @param props
 * @returns
 */
export function MethodArgItem(props: ArgItemProps) {
  const { index, name, internalType, onChange } = props;
  const [options, setOptions] = useState<AutocompleteOption[]>([]); // number 类型自动完成转化

  const isNumberType = /[u]?int\d+$/.test(internalType); // uint256|int128...

  const handleAutoInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    if (!isNumberType) {
      // 非数字参数直接回调
      onChange(index, e.target.value, internalType);

      return;
    }

    // 数字类型支持自动转换

    const value = Number(e.target.value);
    let newOptions: AutocompleteOption[] = [];

    if (value) {
      newOptions = [];

      units.forEach((u) => {
        // wei 不用转换
        if (u.decimals === 0) {
          newOptions.push({
            ...u,
            value: String(value),
            label: String(value),
          });
        }

        // 输入数值精度低于单位精度才可以转换
        // 如：输入0.0001 不可以转为成 kwei(3)
        if (getNumberDecimals(value) < u.decimals) {
          const unitVal = utils.parseUnits(String(value), u.decimals).toString();

          newOptions.push({
            ...u,
            value: unitVal,
            label: unitVal,
          });
        }
      });
    }

    setOptions(newOptions); // 将数据作为选项提供给用户选择
  };

  return isNumberType ? (
    <NumberInput
      size="small"
      sx={{ minWidth: '420px' }}
      variant="outlined"
      label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
      placeholder={getInputPlaceholder(internalType)}
      callback={(val) => {
        onChange(index, val, internalType);
      }}
    ></NumberInput>
  ) : (
    <TextField
      size="small"
      sx={{ minWidth: '420px' }}
      label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
      variant="outlined"
      placeholder={getInputPlaceholder(internalType)}
      onChange={(e) => onChange(index, e.target.value, internalType)}
    />
  );
}
