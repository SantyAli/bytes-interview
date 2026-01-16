const loginQueue = [];
let isProcessing = false;

export const addToQueue = (task) => {
  loginQueue.push(task);
  processQueue();
};

const processQueue = async () => {
  if (isProcessing || loginQueue.length === 0) return;

  isProcessing = true;
  const task = loginQueue.shift();

  await task();
  isProcessing = false;

  processQueue();
};
