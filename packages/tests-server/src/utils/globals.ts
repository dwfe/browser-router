export const delayAsync = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})
