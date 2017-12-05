export default (map) => {
  let keys = []
  let sortedMap = new Map()

  map.forEach((value, key) => {
    keys.push(key)
  })

  keys.sort().forEach((value, key) => {
    sortedMap.set(key, map.get(key))
  })

  return sortedMap
}