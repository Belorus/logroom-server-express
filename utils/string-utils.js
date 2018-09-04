const EMPTY_STRING = '   ';

function adjustString(str, length) {
  return (str + EMPTY_STRING).substr(0, length);
}

module.exports = {
  adjustString,
}