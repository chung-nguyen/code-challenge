self.onmessage = function (e) {
  const [start, end] = e.data;
  let sum = 0;
  for (let i = start; i <= end; i++) {
    sum += i;
  }
  postMessage(sum);
};
