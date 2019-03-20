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

console.log(switchTest(6))


