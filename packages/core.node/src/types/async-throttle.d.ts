declare module 'async-throttle' {
  function createThrottle(max: number): (callback: () => Promise<any>) => Promise<any>
  namespace createThrottle {}
  export = createThrottle
}
