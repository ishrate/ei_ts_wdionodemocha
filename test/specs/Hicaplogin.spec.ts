import { expect } from 'chai';
import LoginPage from '../pages/HicapLoginPage';
import ConfigReader from '../utils/configReader';
import BaseTest from '../utils/BaseTest';

describe('Login Tests', () => {
  

  // Debug log: print current environment at test startup
  before(async () => {
    // Print out the environment as seen by ConfigReader
    // and the relevant environment variables
    // (useful for debugging environment issues)
    // eslint-disable-next-line no-console
    console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
    // eslint-disable-next-line no-console
    console.log('[DEBUG] ENVIRONMENT:', process.env.ENVIRONMENT);
    // eslint-disable-next-line no-console
    console.log('[DEBUG] ConfigReader.getCurrentEnvironment():', ConfigReader.getCurrentEnvironment());
  });

  // Setup and teardown using BaseTest
  beforeEach(async () => {
    await BaseTest.beforeEach();
  });

  afterEach(async () => {
    await BaseTest.afterEach();
  });

  

  it('should login with environment-specific credentials', async () => {
    BaseTest.logTestInfo('Login with environment-specific credentials');
    
     //allure.startStep('Navigate to login page and authenticate');
    await LoginPage.openLoginPage();
    const currentUrl = await (browser as any).getUrl();
    //expect(currentUrl).to.include('medipass');
    // Use new AUT/env credential login (defaults to TYRO and current env)
    await LoginPage.loginWithAutEnvironmentCredentials('hicap');
    await (global as any).browser.waitUntil(async () => {
      const url = await (global as any).browser.getUrl();
      return !url.includes('login');
    }, {
      timeout: 30000,
      timeoutMsg: 'Login should complete within 30 seconds'
    });
    //allure.endStep();

    //BaseTest.logTestSuccess('Login successful - proceeding with invoice entry');
    
    BaseTest.logTestSuccess('Environment-specific login Success');
  });

  
});
