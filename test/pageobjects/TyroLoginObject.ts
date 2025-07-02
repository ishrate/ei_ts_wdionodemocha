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
  
  /**
   * Username input field locator 
   */
  get usernameInput() {
    return $(this.USEREMAIL_INPUT);
  }

  /**
   * Password input field locator
   */
  get passwordInput() {
    return $(this.PASSWORD_INPUT);
  }

  /**
   * Login button locator (Most Effective for Tyro)
   */
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
