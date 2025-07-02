/**
 * DuckDuckGoSearchPage - Page Actions class for DuckDuckGo Search functionality
 * Contains all page actions and methods - Focused search engine for testing
 */
import DuckDuckGoSearchObject from '../pageobjects/DuckDuckGoSearchObject';
import ConfigReader from '../utils/configReader';

class DuckDuckGoSearchPage {
  private pageObject = DuckDuckGoSearchObject;

  // ==================== PAGE ACTIONS/METHODS ====================
  
  /**
   * Get page title
   * @returns Promise<string> - Current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.pageObject.getPageTitle();
  }

  /**
   * Navigate to DuckDuckGo homepage
   * @param url - Optional URL to navigate to (will use DuckDuckGo config if not provided)
   */
  async open(url?: string) {
    // Get DuckDuckGo URL from configuration if not provided
    const targetUrl = url || ConfigReader.getDuckDuckGoUrl('base');
    
    // Use BasePage navigation method
    await this.pageObject.navigateTo(targetUrl);
    
    // Maximize browser using base class method
    await this.pageObject.maximizeBrowser();
    
    // Wait for search input with base class method
    await this.waitForSearchInput();
  }

  /**
   * Wait for search input to be available
   */
  async waitForSearchInput() {
    try {
      // Try primary search input first
      await this.pageObject.waitForElementDisplayed(this.pageObject.searchInput, 10000);
    } catch {
      try {
        // Try alternative search input
        await this.pageObject.waitForElementDisplayed(this.pageObject.searchInputAlt, 5000);
      } catch {
        throw new Error('Search input not found on DuckDuckGo page');
      }
    }
  }

  /**
   * Get the active search input element
   */
  async getActiveSearchInput() {
    if (await this.pageObject.isElementDisplayed(this.pageObject.searchInput)) {
      return this.pageObject.searchInput;
    } else if (await this.pageObject.isElementDisplayed(this.pageObject.searchInputAlt)) {
      return this.pageObject.searchInputAlt;
    } else {
      throw new Error('No search input is available on DuckDuckGo');
    }
  }

  /**
   * Perform search operation
   * @param searchTerm - Term to search for
   */
  async search(searchTerm: string) {
    // Get the active search input
    const activeSearchInput = await this.getActiveSearchInput();
    
    // Use BasePage safe type method
    await this.pageObject.safeType(activeSearchInput, searchTerm);
    
    // Add small delay to mimic human behavior
    await browser.pause(500);
    
    // Press Enter to search
    await browser.keys('Enter');
    
    // Wait for results to load
    await this.waitForSearchResults();
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResults() {
    try {
      // Wait for results container or any result elements
      await browser.waitUntil(
        async () => {
          const hasResults = await this.pageObject.isElementDisplayed(this.pageObject.resultsContainer);
          const hasResultElements = await this.pageObject.resultTitles.length > 0;
          return hasResults || hasResultElements;
        },
        {
          timeout: ConfigReader.getSearchResultsTimeout(),
          timeoutMsg: 'DuckDuckGo search results did not load within expected time'
        }
      );
    } catch {
      console.log('⚠️  Search results not loaded, checking page content...');
      await this.pageObject.takeScreenshot('duckduckgo_search_failed.png');
      throw new Error('DuckDuckGo search results did not load within expected time');
    }
  }

  /**
   * Get the text content of the page body
   * @returns Promise<string> - Page body text
   */
  async getResultsText(): Promise<string> {
    await this.pageObject.waitForElementDisplayed(this.pageObject.bodyElement);
    return await this.pageObject.bodyElement.getText();
  }

  /**
   * Get current search input value
   * @returns Promise<string> - Current search input value
   */
  async getSearchInputValue(): Promise<string> {
    const activeInput = await this.getActiveSearchInput();
    return await activeInput.getValue();
  }

  /**
   * Check if search results are displayed
   * @returns Promise<boolean> - True if results are visible
   */
  async isResultsDisplayed(): Promise<boolean> {
    try {
      return await this.pageObject.isElementDisplayed(this.pageObject.resultsContainer) || 
             (await this.pageObject.resultTitles.length) > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get all search result titles
   * @returns Promise<string[]> - Array of result titles
   */
  async getResultTitles(): Promise<string[]> {
    // Wait for results to load
    await this.pageObject.resultsContainer.waitForDisplayed({ timeout: 10000 });
    
    // Try multiple selectors for different DuckDuckGo layouts
    const selectors = [
      '.react-results--main h2',
      '.react-results--main [data-testid="result-title-a"]',
      '.react-results--main .result__title a',
      '.react-results--main .result_title',
      '.react-results--main h3',
      '.react-results--main .result-header a'
    ];
    
    for (const selector of selectors) {
      try {
        const elements = await browser.$$(selector);
        if (elements.length > 0) {
          const titles: string[] = [];
          for (let i = 0; i < Math.min(elements.length, 10); i++) {
            try {
              const text = await elements[i].getText();
              if (text.trim() !== '') {
                titles.push(text.trim());
              }
            } catch {
              continue;
            }
          }
          if (titles.length > 0) {
            return titles;
          }
        }
      } catch {
        continue;
      }
    }
    
    // If no results with specific selectors, try to get any text content from results
    try {
      const resultsContainer = await this.pageObject.resultsContainer;
      if (await resultsContainer.isDisplayed()) {
        return ['Search results found']; // Return something to indicate results exist
      }
    } catch {
      // Fallback failed
    }
    
    return [];
  }

  /**
   * Clear search input field
   */
  async clearSearchInput() {
    const activeInput = await this.getActiveSearchInput();
    await activeInput.clearValue();
  }
}

export default new DuckDuckGoSearchPage();
