import { useState } from 'react';
import { BaseTextFieldProps } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { utils } from 'ethers';
import { units } from '@/constants';

interface NumberInputProps {
  label: string;
  placeholder?: string;
  callback: (val: string) => void;
}

interface AutocompleteOption {
  unit: string;
  decimals: number;
  value: string;
  label: string;
}

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
export function NumberInput(props: BaseTextFieldProps & NumberInputProps) {
  const { label, placeholder, callback } = props;
  const [options, setOptions] = useState<AutocompleteOption[]>([]); // number 类型自动完成转化

  const handleAutoInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
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

  return (
    <Autocomplete
      filterOptions={() => options}
      options={options}
      autoHighlight
      getOptionLabel={(option) => `${option.value} ${option.unit}(${option.decimals})`}
      onChange={(event: any, newValue: AutocompleteOption | null) => {
        callback(newValue ? newValue.value : '');
      }}
      renderInput={(params) => <TextField {...params} {...props} label={label} placeholder={placeholder} onChange={handleAutoInputChange} />}
    />
  );
}
