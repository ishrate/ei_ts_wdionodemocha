declare global {
  const $: (selector: string) => WebdriverIO.Element;
  const browser: WebdriverIO.Browser;
}

export {};
