/**
 * BaseTest - Base class for all test classes
 * Equivalent to Java Selenium BaseTest class with setup/teardown and common test utilities
 */
import ConfigReader from '../utils/configReader';

class BaseTest {
  
  // ==================== TEST SETUP/TEARDOWN ====================
  
  /**
   * Setup method - runs before each test
   * Equivalent to @BeforeMethod in TestNG or @Before in JUnit
   */
  static async beforeEach() {
    console.log(`-->Starting test: ${this.getCurrentTestName()}`);
    console.log(`-->Environment: ${ConfigReader.getCurrentEnvironment()}`);
    console.log(`-->Base URL: ${ConfigReader.getBaseUrl()}`);
    console.log(`-->Browser: ${ConfigReader.getBrowserName()}`);
    
    // Maximize browser if configured
    if (ConfigReader.shouldMaximizeBrowser()) {
      await browser.maximizeWindow();
    }
    
    // Set timeouts
    await browser.setTimeout({
      'pageLoad': ConfigReader.getPageLoadTimeout(),
      'implicit': ConfigReader.getElementWaitTimeout()
    });
  }

  /**
   * Teardown method - runs after each test
   * Equivalent to @AfterMethod in TestNG or @After in JUnit
   */
  static async afterEach() {
    // Do nothing - keeping browser session alive
    console.log('-->Keeping browser session open...');
  }

  /**
   * Setup method - runs once before all tests in a suite
   * Equivalent to @BeforeClass in TestNG or @BeforeAll in JUnit
   */
  static async beforeAll() {
    console.log('-->Starting test suite execution');
    console.log(`-->Configuration loaded from: ${ConfigReader.getCurrentEnvironment()}`);
    
    // Create screenshots directory if it doesn't exist
    await this.createScreenshotsDirectory();
  }

  /**
   * Teardown method - runs once after all tests in a suite
   * Equivalent to @AfterClass in TestNG or @AfterAll in JUnit
   */
  static async afterAll() {
    console.log('-->Test suite execution completed');
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Get current test name
   * @returns string - Current test name
   */
  static getCurrentTestName(): string {
    // In WebdriverIO, this would be available through the test context
    return (global as any).currentTest?.title || 'Unknown Test';
  }

  /**
   * Take screenshot with test name
   * @param testName - Name of the test
   * @param status - Test status (passed/failed)
   */
  static async takeTestScreenshot(testName: string, status: 'passed' | 'failed' = 'failed') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${status}_${testName}_${timestamp}.png`;
    
    try {
      await browser.saveScreenshot(`./test-output/screenshots/${filename}`);
      console.log(`--> Screenshot saved: test-output/screenshots/${filename}`);
    } catch (error) {
      console.log(`-->Failed to take screenshot: ${error}`);
    }
  }

  /**
   * Dismiss any browser alerts
   */
  static async dismissAnyAlerts() {
    try {
      await browser.acceptAlert();
    } catch {
      // No alert present, continue
    }
  }

  /**
   * Create screenshots directory
   */
  static async createScreenshotsDirectory() {
    const fs = require('fs');
    const path = './test-output/screenshots';
    
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
      console.log('-->Created screenshots directory: test-output/screenshots');
    }
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad() {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => {
          return (globalThis as any).document.readyState;
        });
        return readyState === 'complete';
      },
      {
        timeout: ConfigReader.getPageLoadTimeout(),
        timeoutMsg: 'Page did not load completely within timeout'
      }
    );
  }

  /**
   * Print test information
   * @param message - Message to print
   */
  static logTestInfo(message: string) {
    console.log(`--> [${new Date().toLocaleTimeString()}] ${message}`);
  }

  /**
   * Print test error
   * @param message - Error message to print
   */
  static logTestError(message: string) {
    console.error(`--> [${new Date().toLocaleTimeString()}] ${message}`);
  }

  /**
   * Print test success
   * @param message - Success message to print
   */
  static logTestSuccess(message: string) {
    console.log(`-->[${new Date().toLocaleTimeString()}] ${message}`);
  }

  /**
   * Generate random test data
   * @param prefix - Prefix for the generated data
   * @returns string - Random test data
   */
  static generateTestData(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Retry function - similar to TestNG retry analyzer
   * @param fn - Function to retry
   * @param maxRetries - Maximum number of retries
   * @param delay - Delay between retries in ms
   */
  static async retry<T>(
    fn: () => Promise<T>, 
    maxRetries: number = 3, 
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries) {
          this.logTestError(`Retry failed after ${maxRetries} attempts: ${lastError.message}`);
          throw lastError;
        }
        
        this.logTestInfo(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

export default BaseTest;
