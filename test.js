function switchTest (value) {
  let result = 0
  switch (true) {
    case value > 10:
      result = 1
      break
    case value > 5:
      result = 2
          break
    case value > 1:
      result = 3
          break
  }
  return result
}


function test () {
  let row = 17
  let column = 4
  let levelData = Array.from({length: row}, () => Array.from({length: column}, () => 0))
  levelData.forEach((ary, i) => {
    ary.forEach((value, j) => {
      levelData[i][j] = ((i + 1) * 10) - (j + 2) * (i + 1) + 2
    })
  })
  console.log(levelData)
}

