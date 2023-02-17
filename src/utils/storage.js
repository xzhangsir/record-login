
export const setItem = (key, val) => {
  if (typeof val == 'object') {
    localStorage.setItem(key, JSON.stringify(val))
  } else {
    localStorage.setItem(key, val)
  }
}
export const getItem = (key) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : null
}
export const getKey = (key, k) => {
  var val = getItem(key)
  return val ? val[k] : ""
}
export const rm = (key) => {
  localStorage.removeItem(key)
}
export const clearStorage = () => {
  localStorage.clear()
}
