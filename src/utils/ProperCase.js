/**
 * @description Convert the smallCase (shelf) to a normal phrase
 * @param {string} str - The string that has to be converted
 * @returns {string} the converted string
 */
export default (str) => {
  const cleanSmallCase = str.split(/(?=[A-Z])/).join(" ")
  return cleanSmallCase.charAt(0).toUpperCase() + cleanSmallCase.slice(1)
}
