/**
 * SearchPage - Page Object Model class for Search functionality
 * Following Java-based WebDriver POM pattern with all locators and methods
 */
import BasePage from '../base/BasePage';
import ConfigReader from '../utils/configReader';

class SearchPage extends BasePage {
  // ==================== LOCATORS ====================
  // All XPath and CSS selectors defined here (like Java POM)
  private readonly SEARCH_INPUT = '[name="q"]';
  private readonly SEARCH_INPUT_ALT = 'input[type="search"]';
  private readonly BODY_ELEMENT = 'body';
  private readonly SEARCH_BUTTON = '[name="btnK"]';
  private readonly SEARCH_BUTTON_ALT = 'input[type="submit"]';
  private readonly RESULTS_CONTAINER = '#search';
  private readonly SEARCH_RESULTS = '#rso';
  private readonly RESULT_TITLES = 'h3';
  private readonly CAPTCHA_INDICATOR = '.g-recaptcha';
  private readonly CONSENT_BUTTON = '#L2AGLb';

  // ==================== PAGE ELEMENT GETTERS ====================
  private get searchInput() {
    return $(this.SEARCH_INPUT);
  }

  private get searchInputAlt() {
    return $(this.SEARCH_INPUT_ALT);
  }

  private get bodyElement() {
    return $(this.BODY_ELEMENT);
  }

  private get searchButton() {
    return $(this.SEARCH_BUTTON);
  }

  private get searchButtonAlt() {
    return $(this.SEARCH_BUTTON_ALT);
  }

  private get resultsContainer() {
    return $(this.RESULTS_CONTAINER);
  }

  private get searchResults() {
    return $(this.SEARCH_RESULTS);
  }

  private get resultTitles() {
    return $(this.RESULT_TITLES);
  }

  private get captchaIndicator() {
    return $(this.CAPTCHA_INDICATOR);
  }

  private get consentButton() {
    return $(this.CONSENT_BUTTON);
  }

  // ==================== PAGE ACTIONS/METHODS ====================
  
  /**
   * Navigate to search homepage
   * @param url - Optional URL to navigate to (will use DuckDuckGo AUT config if not provided)
   */
  async open(url?: string) {
    // Get DuckDuckGo URL from configuration if not provided
    const targetUrl = url || ConfigReader.getDuckDuckGoUrl('base');
    
    // Use BasePage navigation method
    await this.navigateTo(targetUrl);
    
    // Maximize browser using base class method
    await this.maximizeBrowser();
    
    // Handle consent dialog if present
    await this.handleConsentDialog();
    
    // Wait for search input with base class method
    await this.waitForSearchInput();
  }

  /**
   * Handle consent dialog if present
   */
  async handleConsentDialog() {
    try {
      await this.consentButton.waitForDisplayed({ timeout: 3000 });
      if (await this.consentButton.isDisplayed()) {
        await this.consentButton.click();
        console.log('✅ Accepted consent dialog');
        await browser.pause(1000);
      }
    } catch {
      // No consent dialog present, continue
      console.log('ℹ️  No consent dialog found');
    }
  }

  /**
   * Wait for search input to be available
   */
  async waitForSearchInput() {
    try {
      // Try primary search input first
      await this.waitForElementDisplayed(this.searchInput, 5000);
    } catch {
      try {
        // Try alternative search input
        await this.waitForElementDisplayed(this.searchInputAlt, 5000);
      } catch {
        throw new Error('Search input not found on the page');
      }
    }
  }

  /**
   * Get the active search input element
   */
  async getActiveSearchInput() {
    if (await this.isElementDisplayed(this.searchInput)) {
      return this.searchInput;
    } else if (await this.isElementDisplayed(this.searchInputAlt)) {
      return this.searchInputAlt;
    } else {
      throw new Error('No search input is available');
    }
  }

  /**
   * Perform search operation
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string) {
    // Check for CAPTCHA first
    await this.checkForCaptcha();
    
    // Get the active search input
    const activeSearchInput = await this.getActiveSearchInput();
    
    // Use BasePage safe type method
    await this.safeType(activeSearchInput, searchTerm);
    
    // Add small delay to mimic human behavior
    await browser.pause(500);
    
    // Press Enter to search
    await browser.keys('Enter');
    
    // Wait for results to load using base class method
    await this.waitForSearchResults();
  }

  /**
   * Check if CAPTCHA is present and handle appropriately
   */
  async checkForCaptcha() {
    try {
      const isCaptchaPresent = await this.isElementDisplayed(this.captchaIndicator);
      if (isCaptchaPresent) {
        console.log('⚠️  CAPTCHA detected! Taking screenshot...');
        await this.takeScreenshot('captcha_detected.png');
        throw new Error('CAPTCHA challenge detected. Please run test manually or use a different approach.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('CAPTCHA')) {
        throw error;
      }
      // Element not found, continue - this is expected
    }
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults() {
    try {
      await this.waitForElementDisplayed(this.resultsContainer, this.SEARCH_TIMEOUT);
    } catch {
      // If results container not found, check for CAPTCHA
      await this.checkForCaptcha();
      
      // If still no results, check page content
      const pageText = await this.bodyElement.getText();
      if (pageText.includes('unusual traffic') || pageText.includes('not a robot')) {
        console.log('⚠️  Anti-bot protection detected');
        await this.takeScreenshot('anti_bot_detected.png');
        throw new Error('Anti-bot protection detected. Try using different search terms or approach.');
      }
      
      throw new Error('Search results did not load within expected time');
    }
  }

  /**
   * Get the text content of the page body
   * @returns Promise<string> - Page body text
   */
  async getResultsText(): Promise<string> {
    await this.bodyElement.waitForDisplayed();
    return await this.bodyElement.getText();
  }

  /**
   * Get current search input value
   * @returns Promise<string> - Current search input value
   */
  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.getValue();
  }

  /**
   * Check if search results are displayed
   * @returns Promise<boolean> - True if results are visible
   */
  async isResultsDisplayed(): Promise<boolean> {
    try {
      await this.resultsContainer.waitForDisplayed({ 
        timeout: ConfigReader.getElementWaitTimeout() 
      });
      return await this.resultsContainer.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Get all search result titles
   * @returns Promise<string[]> - Array of result titles
   */
  async getResultTitles(): Promise<string[]> {
    await this.searchResults.waitForDisplayed();
    const titleElements = await browser.$$('h3');
    const titleTexts: string[] = [];
    
    for (const title of titleElements) {
      const text = await title.getText();
      if (text.trim() !== '') {
        titleTexts.push(text);
      }
    }
    
    return titleTexts;
  }

  /**
   * Clear search input field
   */
  async clearSearchInput() {
    await this.searchInput.clearValue();
  }
}

export default new SearchPage();
