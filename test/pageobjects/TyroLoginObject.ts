/*
 * This Class Contains locators and getters for login page elements
*/
import BasePage from '../base/BasePage';

class LoginPageObject extends BasePage {
  
  // ==================== LOCATORS ====================
  // All XPath and CSS selectors 
  readonly USEREMAIL_INPUT = '//*[@name="email"]';
  readonly PASSWORD_INPUT = '//*[@name="password"]'; 
  readonly BODY_ELEMENT = 'body';
  
  // Login Button
  readonly LOGIN_BUTTON_XPATH = '//button[contains(text(), "LOGIN") or @type="submit"]';
  
//  get usernameInput(): WebdriverIO.Element {
//     return $('#username'); // or your actual selector
//   }
//   get passwordInput(): WebdriverIO.Element {
//     return $('#password');
//   }
//   get loginButton(): WebdriverIO.Element {
//     return $('#loginBtn');
//   }

get usernameInput() {
  return $(this.USEREMAIL_INPUT); // or your actual selector
}
get passwordInput() {
  return $(this.PASSWORD_INPUT); // or your actual selector
}
get loginButton() {
  return $(this.LOGIN_BUTTON_XPATH);
}

  /**
   * Login form container
   */
  get loginForm() {
    return $('form, .login-form, .signin-form, #login-form');
  }

  
}

export default new LoginPageObject();
