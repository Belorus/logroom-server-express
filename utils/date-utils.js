function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = "0" + date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const milliseconds = "00" + date.getMilliseconds();
  return `${hours.substr(-2)}:${minutes.substr(-2)}:${seconds.substr(-2)}:${milliseconds.substr(-3)}`;
}

module.exports = {
  formatTimestamp,
}