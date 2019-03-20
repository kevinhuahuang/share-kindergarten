function multiArrayAsc (ary, index) { // index start from 0
  let aryObject = ary.map((aryChild, i) => {
    return {value: aryChild[index], index: i}
  })
  aryObject.sort(function (a, b) {
    return a.value - b.value
  })
  return aryObject.map(obj => {
    return ary[obj.index]
  })
}

function multiArrayDesc (ary, index) {
  let aryObject = ary.map((aryChild, i) => {
    return {value: aryChild[index], index: i}
  })
  aryObject.sort(function (a, b) {
    return b.value - a.value
  })
  return aryObject.map(obj => {
    return ary[obj.index]
  })
}

export {
  multiArrayAsc,
  multiArrayDesc
}
