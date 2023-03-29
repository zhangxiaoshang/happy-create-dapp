/**
 * @dev 首字母大写
 * @param string
 * @returns
 */
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @dev hook 名称
 * @param name
 * @returns
 */
export function generateHookName(name: string) {
  if (!name) return `useUnnamed`;

  return `use${capitalizeFirstLetter(name)}`;
}
