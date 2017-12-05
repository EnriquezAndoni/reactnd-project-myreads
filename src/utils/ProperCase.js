export default (str) => {
  const cleanSmallCase = str.split(/(?=[A-Z])/).join(" ")
  return cleanSmallCase.charAt(0).toUpperCase() + cleanSmallCase.slice(1)
}
