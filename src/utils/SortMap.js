/**
 * @description Sort the shelves alphabetically
 * @param {map} map - The shelves
 * @returns {object} the sorted new map
 */
export default (map) => {
  let keys = []
  let sortedMap = new Map()

  map.forEach((value, key) => {
    keys.push(key)
  })

  // Alphabetically
  keys.sort().forEach((key) => {
    sortedMap.set(key, map.get(key))
  })

  return sortedMap
}