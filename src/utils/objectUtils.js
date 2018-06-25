Object.byString = function(object, key) {
  key = key.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  key = key.replace(/^\./, '') // strip a leading dot
  let a = key.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i]
    if (k in object) {
      object = object[k]
    } else {
      return
    }
  }
  return object
}

Object.setValueByString = function(object, key, value) {
  if (!object) object = data //outside (non-recursive) call, use "data" as our base object
  let ka = key.split(/\./) //split the key by the dots
  if (ka.length < 2) {
    object[ka[0]] = value //only one part (no dots) in key, just set value
  } else {
    if (!object[ka[0]]) object[ka[0]] = {} //create our "new" base obj if it doesn't exist
    object = object[ka.shift()] //remove the new "base" obj from string array, and hold actual object for recursive call
    Object.setValueByString(object, ka.join('.'), value) //join the remaining parts back up with dots, and recursively set data on our new "base" obj
  }
}

Object.removeUndefined = function(object) {
  Object.keys(object).forEach(key => object[key] == null && delete object[key])
}

Object.removingUndefined = function(object) {
  Object.removeUndefined(object)
  return object
}
