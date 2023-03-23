import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { InputOrOutput } from './OutputList';
import { ChangeArgFn } from './MethadItem';
import { utils } from 'ethers';

interface ArgsContentProps {
  inputs: InputOrOutput[];
  onChange: ChangeArgFn;
}

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

const units = [
  // {
  //   unit: 'wei',
  //   decimals: 0,
  // },
  {
    unit: 'kwei',
    decimals: 3,
  },
  {
    unit: 'mwei',
    decimals: 6,
  },
  {
    unit: 'gwei',
    decimals: 9,
  },
  {
    unit: 'szabo',
    decimals: 12,
  },
  {
    unit: 'finney',
    decimals: 15,
  },
  {
    unit: 'ether',
    decimals: 18,
  },
];

/**
 * @dev 如果是数字类型的参数，支持转换
 * @param props
 * @returns
 */
function ArgItem(props: ArgItemProps) {
  const { index, name, internalType, onChange } = props;
  const isNumberType = /[u]?int\d+/.test(internalType); // uint256|int128...
  const [options, setOptions] = useState<AutocompleteOption[]>([]); // number 类型自动完成转化

  const initPlaceholder = (type: string) => {
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

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    // 数字类型支持自动转换
    if (isNumberType) {
      const num = e.target.value;

      let newOptions: AutocompleteOption[] = [];

      if (num && !num.endsWith('.') && num !== '0') {
        newOptions = [{ unit: 'wei', decimals: 0, label: num, value: num }];

        units.forEach((u) => {
          try {
            const unitVal = utils.parseUnits(num, u.decimals).toString();

            newOptions.push({
              ...u,
              value: unitVal,
              label: unitVal,
            });
          } catch (error) {}
        });
      }

      setOptions(newOptions); // 将数据作为选项提供给用户选择
    } else {
      // 部署数字参数直接回调
      onChange(index, e.target.value, internalType);
    }
  };

  return (
    <Box>
      {isNumberType ? (
        <Autocomplete
          filterOptions={() => options}
          options={options}
          autoHighlight
          getOptionLabel={(option) => `${option.value} ${option.unit}(${option.decimals})`}
          onChange={(event: any, newValue: AutocompleteOption | null) => {
            onChange(index, newValue ? newValue.value : '', internalType);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{ minWidth: '420px' }}
              label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
              variant="outlined"
              placeholder={initPlaceholder(internalType)}
              onChange={handleInputChange}
            />
          )}
        />
      ) : (
        <TextField
          size="small"
          sx={{ minWidth: '420px' }}
          label={name ? `${name} (${internalType})` : `<input> (${internalType})`}
          variant="outlined"
          placeholder={initPlaceholder(internalType)}
          onChange={(e) => onChange(index, e.target.value, internalType)}
        />
      )}
    </Box>
  );
}

const ArgsContent: React.FunctionComponent<ArgsContentProps> = ({ inputs, onChange }) => {
  if (!inputs.length) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      sx={{
        '.MuiFormControl-root': {
          marginBottom: '20px',
        },
      }}
    >
      {inputs.map((input, index) => {
        return <ArgItem key={index} index={index} name={input.name} internalType={input.internalType} onChange={onChange}></ArgItem>;
        // return (
        //   <TextField
        //     size="small"
        //     sx={{ minWidth: '420px' }}
        //     key={index}
        //     label={input.name ? `${input.name} (${input.internalType})` : `<input> (${input.internalType})`}
        //     variant="outlined"
        //     placeholder={/[0-9a-z]+\[\]/gi.test(input.internalType) ? (input.internalType === 'address[]' ? 'e.g: 0x123,0x456' : 'e.g: 123,456') : undefined}
        //     onChange={(e) => onChange(index, e.target.value, input.internalType)}
        //   />
        // );
      })}
    </Stack>
  );
};

export default ArgsContent;
