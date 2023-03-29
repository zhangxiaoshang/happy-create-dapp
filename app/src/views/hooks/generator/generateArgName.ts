/**
 * @dev 格式化参数名称, 当参数名称为定义时，格式化为：arg[index]
 * @param name
 * @param index
 */
export function generateArgName(argName?: string, index: number = 0): string {
  if (!argName) return `arg${index}`;

  return `${argName}`;
}
