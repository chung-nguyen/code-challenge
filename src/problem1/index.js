var sum_to_n_a = function (n) {
  // School solution
  return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
  // Map reduce
  return (new Array(n)).fill(0, 0, n).reduce((prev, _curr, idx) => prev + (idx + 1), 0);
};

var sum_to_n_c = function (n) {  
  // I want to propose additional solution d but it requires to worker thread and it does not work out-of-the-box.
  // Therefore I put a simple solution here as the 3rd one - just in case.
  var result = 0;
  for (var i = 1; i <= n; ++i) {
    result += i;
  }
  return result;
};

var sum_to_n_d = function (n) {
  // This solution use multithreads to do the sum. The demonstrations can be seen by browsing index.html
  // I know this solution is overkill for a simple problem but as I understand, it is not about just solving it.
  return new Promise((resolve) => {
    var workersCount = 8;
    var workers = [];

    const chunkSize = Math.floor(n / workersCount);
    var completed = 0;
    var totalSum = 0;

    for (var i = 0; i < workersCount; i++) {
      const worker = new Worker('worker.js');
      workers.push(worker);

      const start = i * chunkSize + 1;
      const end = i === workersCount - 1 ? n : (i + 1) * chunkSize;

      worker.onmessage = function (e) {
        totalSum += e.data;
        completed++;
        if (completed === workersCount) {
          resolve(totalSum);
        }
      };

      worker.postMessage([start, end]);
    }
  });
};
