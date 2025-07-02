/**
 * BasePage - Base class for all Page Objects
 * Equivalent to Java Selenium BasePage class with common page functionality
 */
import ConfigReader from '../utils/configReader';

abstract class BasePage {
  
  // ==================== COMMON WAITS AND TIMEOUTS ====================
  protected readonly DEFAULT_TIMEOUT = ConfigReader.getElementWaitTimeout();
  protected readonly PAGE_LOAD_TIMEOUT = ConfigReader.getPageLoadTimeout();
  protected readonly SEARCH_TIMEOUT = ConfigReader.getSearchResultsTimeout();

  // ==================== COMMON PAGE ACTIONS ====================
  
  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string) {
    await browser.url(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => {
          return (globalThis as any).document.readyState;
        });
        return readyState === 'complete';
      },
      {
        timeout: this.PAGE_LOAD_TIMEOUT,
        timeoutMsg: 'Page did not load completely within timeout'
      }
    );
  }

  /**
   * Maximize browser window
   */
  async maximizeBrowser() {
    if (ConfigReader.shouldMaximizeBrowser()) {
      await browser.maximizeWindow();
    }
  }

  /**
   * Get page title
   * @returns Promise<string> - Current page title
   */
  async getPageTitle(): Promise<string> {
    return await browser.getTitle();
  }

  /**
   * Get current URL
   * @returns Promise<string> - Current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return await browser.getUrl();
  }

  /**
   * Refresh the current page
   */
  async refreshPage() {
    await browser.refresh();
    await this.waitForPageLoad();
  }

  /**
   * Navigate back in browser history
   */
  async navigateBack() {
    await browser.back();
    await this.waitForPageLoad();
  }

  /**
   * Navigate forward in browser history
   */
  async navigateForward() {
    await browser.forward();
    await this.waitForPageLoad();
  }

  /**
   * Wait for element to be displayed
   * @param element - WebdriverIO element
   * @param timeout - Optional timeout (uses default if not provided)
   */
  async waitForElementDisplayed(element: any, timeout?: number) {
    await element.waitForDisplayed({
      timeout: timeout || this.DEFAULT_TIMEOUT,
      timeoutMsg: `Element not displayed within ${timeout || this.DEFAULT_TIMEOUT}ms`
    });
  }

  /**
   * Wait for element to be clickable
   * @param element - WebdriverIO element
   * @param timeout - Optional timeout
   */
  async waitForElementClickable(element: any, timeout?: number) {
    await element.waitForClickable({
      timeout: timeout || this.DEFAULT_TIMEOUT,
      timeoutMsg: `Element not clickable within ${timeout || this.DEFAULT_TIMEOUT}ms`
    });
  }

  /**
   * Safe click - waits for element to be clickable then clicks
   * @param element - WebdriverIO element
   */
  async safeClick(element: any) {
    await this.waitForElementClickable(element);
    await element.click();
  }

  /**
   * Safe type - waits for element to be displayed then types
   * @param element - WebdriverIO element
   * @param text - Text to type
   */
  async safeType(element: any, text: string) {
    await this.waitForElementDisplayed(element);
    await element.clearValue();
    await element.setValue(text);
  }

  /**
   * Check if element exists and is displayed
   * @param element - WebdriverIO element
   * @returns Promise<boolean> - True if element is displayed
   */
  async isElementDisplayed(element: any): Promise<boolean> {
    try {
      await element.waitForDisplayed({ timeout: 2000 });
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot
   * @param filename - Optional filename for screenshot
   */
  async takeScreenshot(filename?: string) {
    const screenshotName = filename || `screenshot_${Date.now()}.png`;
    await browser.saveScreenshot(`./test-output/screenshots/${screenshotName}`);
    console.log(`Screenshot saved: test-output/screenshots/${screenshotName}`);
  }

  /**
   * Scroll to element
   * @param element - WebdriverIO element
   */
  async scrollToElement(element: any) {
    await element.scrollIntoView();
  }

  /**
   * Wait for text to be present in element
   * @param element - WebdriverIO element
   * @param expectedText - Text to wait for
   * @param timeout - Optional timeout
   */
  async waitForTextInElement(element: any, expectedText: string, timeout?: number) {
    await browser.waitUntil(
      async () => {
        const text = await element.getText();
        return text.includes(expectedText);
      },
      {
        timeout: timeout || this.DEFAULT_TIMEOUT,
        timeoutMsg: `Text "${expectedText}" not found in element within ${timeout || this.DEFAULT_TIMEOUT}ms`
      }
    );
  }
}

export default BasePage;
