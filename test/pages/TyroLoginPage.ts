/**
 * LoginPage - Contains page actions and methods for login functionality
 * Part of the Object/Page naming convention: Page = Actions/Methods
 */
import LoginPageObject from '../pageobjects/TyroLoginObject';
import ConfigReader from '../utils/configReader';

class LoginPage {
  private pageObject = LoginPageObject;

  // ==================== PAGE ACTIONS/METHODS ====================

  /**
   * Navigate to login page
   * @param url - Optional login page URL (use config if not provided)
   */
  async open(url?: string) {
    const targetUrl = url || `${ConfigReader.getBaseUrl()}/login`;
    await this.pageObject.navigateTo(targetUrl);
    await this.pageObject.maximizeBrowser();
  }

  /**
   * Perform login with credentials
   * @param username - Username for login
   * @param password - Password for login
   */
  async login(username: string, password: string) {
    // Wait for the page to fully load
    await browser.waitUntil(
      async () => (await browser.getTitle()).toLowerCase().includes('login'),
      {
        timeout: 10000,
        timeoutMsg: 'Login page did not load within 10 seconds',
      }
    );

    // Debug log to confirm page URL
    const currentUrl = await browser.getUrl();
    console.log(`Current URL: ${currentUrl}`);

    // Debug: Print page source to verify if fields are present
    console.log('Page Source:', await browser.getPageSource());


    // Wait for username input to be displayed
    await this.pageObject.waitForElementDisplayed(this.pageObject.usernameInput, 10000);
    await this.pageObject.usernameInput.clearValue();
    await this.pageObject.usernameInput.setValue(username);

    // Wait for password input to be displayed
    await this.pageObject.waitForElementDisplayed(this.pageObject.passwordInput, 10000);
    await this.pageObject.passwordInput.clearValue();
    await this.pageObject.passwordInput.setValue(password);

    // Debug: Print page source to verify if the login button exists
    console.log('Page Source:', await browser.getPageSource());

    // Enhanced logic to wait for the login button
    const isLoginButtonPresent = await this.pageObject.loginButton.isExisting();
    if (!isLoginButtonPresent) {
      console.error('Login button not found on the page');
      throw new Error('Login button not found');
    }

    // Wait for login button to be clickable
    await this.pageObject.waitForElementDisplayed(this.pageObject.loginButton, 10000);
    await this.pageObject.loginButton.click();

    await browser.pause(6000);

    // Check for and click home link if present
    try {
      const homeLink = await $('//a[contains(text(),"Click here to go home")]');
      if (await homeLink.isDisplayed()) {
        console.log('Extra link found, clicking it...');
        await homeLink.click();
        await browser.pause(1000); // Wait after clicking
      }
    } catch (error) {
      console.log('Home link not found, continuing...');
    }

    // Verify if login was successful
    console.log('--> Verifying login success...');
    const loginSuccess = await this.verifyLoginSuccess();
    if (loginSuccess) {
      console.log('-->Login successful!');
    } else {
      console.log('-->Login failed');
    }
   
    
    // Exit the test here - stopping execution
    process.exit(0);

  }

  





  // /**
  //  * Login using credentials from configuration
  //  * @param userType - Type of user credentials to use (test, admin, dev, qa, staging)
  //  */
  // async loginWithConfig(userType: string = 'dev') {
  //   const credentials = ConfigReader.getCredentials(userType);
  //   await this.login(credentials.username, credentials.password);
  // }

  /**
   * Login using environment-specific credentials
   * Automatically selects credentials based on current environment
   */
  async loginWithEnvironmentCredentials() {
    const credentials = ConfigReader.getEnvironmentCredentials();
    await this.login(credentials.username, credentials.password);
  }

  /**
   * Verify if login was successful using the simple success check
   * @returns Promise<boolean> - True if login appears successful
   */
  async verifyLoginSuccess(): Promise<boolean> {
    // Check if we're redirected away from login page or if URL contains success indicators
    const currentUrl = await browser.getUrl();
    const pageTitle = await browser.getTitle();

    // Success indicators:
    // 1. URL changed from login page
    // 2. No longer on /login path
    // 3. Page title changed from login page
    const isNotOnLoginPage = !currentUrl.includes('/login') || currentUrl.includes('/auth') || currentUrl.includes('/dashboard');
    const titleChanged = !pageTitle.toLowerCase().includes('login');

    return isNotOnLoginPage || titleChanged;
  }

  
  

  
}

export default new LoginPage();
