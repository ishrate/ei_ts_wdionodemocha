import { expect } from 'chai';
import LoginPage from '../pages/TyroLoginPage';
import ConfigReader from '../utils/configReader';
import BaseTest from '../utils/BaseTest';

describe('Login Tests', () => {
  
  // Setup and teardown using BaseTest
  beforeEach(async () => {
    await BaseTest.beforeEach();
  });

  afterEach(async () => {
    await BaseTest.afterEach();
  });

  // it('should login successfully with valid test credentials', async () => {
  //   BaseTest.logTestInfo('Testing login with valid test user credentials');
    
  //   // Navigate to Medipass login page using specific AUT URL
  //   await LoginPage.open(ConfigReader.getMedipassUrl('login'));
    
  //   // Login with test credentials from .env
  //   await LoginPage.loginWithConfig('test');
    
  //   // Verify login success
  //   //const isLoggedIn = await LoginPage.verifyLoginSuccess();
  //   //expect(isLoggedIn).to.be.true;
    
  //   BaseTest.logTestSuccess('Login test completed successfully');
  // });

  it('should login with environment-specific credentials', async () => {
    BaseTest.logTestInfo('Login with environment-specific credentials');
    
    await LoginPage.open(ConfigReader.getMedipassUrl('login'));
    
    // This will automatically use credentials based on current environment
    await LoginPage.loginWithEnvironmentCredentials();
    
    const isLoggedIn = await LoginPage.verifyLoginSuccess();
    expect(isLoggedIn).to.be.true;
    
    BaseTest.logTestSuccess('Environment-specific login Success');
  });

  


  // it('should demonstrate direct credential usage', async () => {
  //   BaseTest.logTestInfo('Testing direct credential usage from ConfigReader');
    
  //   // Get credentials directly from config
  //   const testCredentials = ConfigReader.getCredentials('test');
  //   console.log('Using username:', testCredentials.username);
    
  //   await LoginPage.open(ConfigReader.getMedipassUrl('login'));
    
  //   // Use credentials directly
  //   await LoginPage.login(testCredentials.username, testCredentials.password);
    
  //   const isLoggedIn = await LoginPage.verifyLoginSuccess();
  //   expect(isLoggedIn).to.be.true;
    
  //   BaseTest.logTestSuccess('Direct credential usage test completed');
  // });

  // it('should login and keep browser open', async () => {
  //   console.log('Opening login page...');
  //   await LoginPage.open();
    
  //   const username = process.env.TEST_USERNAME || 'eamon_ishrat@worksafe.vic.gov.au';
  //   const password = process.env.TEST_PASSWORD || 'Password123#';
    
  //   console.log(`Logging in with username: ${username}`);
  //   await LoginPage.login(username, password);
    
  //   // Keep the browser open indefinitely
  //   console.log('Login complete - keeping browser open');
  //   await browser.pause(2147483647); // Maximum safe timeout (~24.8 days)
  // });
});
