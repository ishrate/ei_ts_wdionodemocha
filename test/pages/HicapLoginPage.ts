/// <reference types="@wdio/globals/types" />

//LoginPage - Contains page actions and methods for login functionality

import LoginPageObject from '../pageobjects/HicapLoginObject';
import ConfigReader from '../utils/configReader';
import Logger from '../utils/Logger';
//import type { ChainablePromiseElement } from 'webdriverio';

class HicapLoginPage {
  /**
   * Logs in using AUT/environment-specific credentials (e.g., HICAP_TS2_USERNAME)
   * @param aut - Application under test (e.g., 'hicap')
   * @param env - Environment (e.g., 'ts2', 'prod'). Defaults to current env.
   */
  async loginWithAutEnvironmentCredentials(aut: string = 'hicap', env?: string) {
    Logger.logTestStep(`Logging in with ${aut.toUpperCase()} credentials for env: ${env || 'current'}`);
    try {
      const credentials = ConfigReader.getAutCredentials(aut, env);
      Logger.debug('Retrieved AUT credentials from config', { username: credentials.username });
      await this.login(credentials.username, credentials.password);
      Logger.logSuccess('Successfully logged in with AUT/environment credentials');
    } catch (error) {
      Logger.logFailure('Failed to login with AUT/environment credentials', error);
      throw error;
    }
  }
  /**
   * Opens the Hicap login page using the new multi-AUT config pattern.
   * Uses ConfigReader.getHicapUrl() and appends '/login'.
   *
   */
  async openLoginPage(urlOverride?: string) {
    let loginUrl: string;
    if (urlOverride) {
      loginUrl = urlOverride;
    } else {
      // Use the new multi-AUT config pattern for Tyro/Medipass login
      const baseUrl = ConfigReader.getHicapUrl();
      loginUrl = baseUrl.endsWith('/') ? `${baseUrl}login` : `${baseUrl}/login`;
    }
    Logger.logTestStep('Opening Hicap login page', { loginUrl });
    await this.open(loginUrl);
  }
  private pageObject = LoginPageObject;

  /**
   * Navigate to the login page and maximize the browser window.
   * (private helper, only used by openLoginPage)
   */
  private async open(url?: string) {
    Logger.logTestStep('Opening login page', { url });
    try {
      const targetUrl = url || `${ConfigReader.getBaseUrl()}/login`;
      await (global as any).browser.url(targetUrl);
      await (global as any).browser.maximizeWindow();
      Logger.logSuccess(`Successfully navigated to: ${targetUrl}`);
    } catch (error) {
      Logger.logFailure(`Failed to open login page: ${url}`, error);
      throw error;
    }
  }

  /**
   * Performs the login action with a given username and password.
   */
  async login(username: string, password: string) {
    Logger.logTestStep('Performing login', { username });

    try {
      // Enter username
      const usernameField = this.pageObject.usernameInput;
      await usernameField.waitForDisplayed({ timeout: 10000 });
      await usernameField.setValue(username);
      Logger.debug('Username entered successfully');
      

      // Enter password
      const passwordField = this.pageObject.passwordInput;
      await passwordField.waitForDisplayed({ timeout: 10000 });
      await passwordField.setValue(password);
      Logger.debug('Password entered successfully');
      

      // Click login button
      const loginButton = this.pageObject.loginButton;
      await loginButton.waitForEnabled({ timeout: 10000 });
      await loginButton.click();
      Logger.debug('Login button clicked');
      

    await browser.pause(7000); // simulate page load buffer (adjust if needed)

    const popUp = $("//button[text()='Ok']");

    // Wait up to 10 seconds until it's displayed (if exists)
    const isPresent = await popUp.waitForDisplayed({ timeout: 7000, reverse: false }).catch(() => false);

    if (isPresent) {
        Logger.info("Detected popup. Clicking OK...");
        await popUp.click();
        await browser.pause(10000); // wait after click for redirect
    } else {
        Logger.info("No popup present. Page is normal.");
    }

      // Wait for login to complete
      // Logger.debug('Waiting for login to complete');
      // await this.waitForLoginComplete();

      Logger.logSuccess('Login completed successfully');
    } catch (error) {
      Logger.logFailure('Login failed', error);
      throw error;
    }
  }

  /**
   * A helper method that logs in using credentials from the new multi-AUT config (.env pattern: <AUT>_<ENV>_USERNAME/PASSWORD)
   * Defaults to 'hicap' and current environment if not specified.
   */
  async loginWithEnvironmentCredentials(aut: string = 'hicap', env?: string) {
    Logger.logTestStep(`Logging in with ${aut.toUpperCase()} credentials for env: ${env || 'current'}`);
    try {
      const credentials = ConfigReader.getAutCredentials(aut, env);
      Logger.debug('Retrieved AUT credentials from config', { username: credentials.username });
      await this.login(credentials.username, credentials.password);
      Logger.logSuccess('Successfully logged in with AUT/environment credentials');
    } catch (error) {
      Logger.logFailure('Failed to login with AUT/environment credentials', error);
      throw error;
    }
  }

  /**
   * Wait for login to complete
   */
  async waitForLoginComplete() {
    Logger.debug('Waiting for login completion');

    try {
      // Wait for URL to change (indicating successful login)
      await (global as any).browser.waitUntil(async () => {
        const currentUrl = await (global as any).browser.getUrl();
        const isLoginPage = currentUrl.includes('login');
        Logger.debug(`Current URL: ${currentUrl}, Is login page: ${isLoginPage}`);
        return !isLoginPage;
      }, {
        timeout: 30000,
        timeoutMsg: 'Login did not complete within 30 seconds'
      });

      Logger.debug('Login completion detected');

      // Additional wait for page to stabilize
      await (global as any).browser.pause(2000);

    } catch (error) {
      Logger.logFailure('Failed to wait for login completion', error);
      throw error;
    }
  }

  /**
   * Verifies that the login was successful by waiting for a reliable element
   * that appears on the page only after a successful login.
   */
  async verifyLoginSuccess() {
    Logger.logTestStep('Verifying login success');

    try {
      const currentUrl = await (global as any).browser.getUrl();
      const isLoggedIn = !currentUrl.includes('login');

      if (isLoggedIn) {
        Logger.logSuccess('Login verification successful');
        Logger.debug(`Current URL after login: ${currentUrl}`);
        return true;
      } else {
        Logger.logFailure('Login verification failed - still on login page');
        return false;
      }

    } catch (error) {
      Logger.logFailure('Failed to verify login success', error);
      throw error;
    }
  }

  
}

export default new HicapLoginPage();
