declare const __CLIENT__: boolean;
declare const CONFIG_CLIENT: any;

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.scss' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

interface Window {
  __INITIAL_STATE__: any;
  devToolsExtension: any;
  ga: any;
}

interface Error {
  status: number;
}

interface Event {
  error: any;
  reason: any;
}

namespace Chai {
  interface Assertion {
    called: any;
    calledWith: any;
  }
}
