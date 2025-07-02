/**
 * DuckDuckGoSearchObject - Page Object Model class for DuckDuckGo Search functionality
 * Contains only locators and element getters - Focused search engine for testing
 */
import BasePage from '../base/BasePage';

class DuckDuckGoSearchObject extends BasePage {
  // ==================== LOCATORS ====================
  // All XPath and CSS selectors defined here (like Java POM)
  readonly SEARCH_INPUT = '#searchbox_input';
  readonly SEARCH_INPUT_ALT = '[name="q"]';
  readonly BODY_ELEMENT = 'body';
  readonly SEARCH_BUTTON = '#searchbox_homepage .searchbox_searchButton__F5Bwq';
  readonly RESULTS_CONTAINER = '.react-results--main';
  readonly SEARCH_RESULTS = '.nrn-react-div';
  readonly RESULT_TITLES = '.react-results--main h2, .react-results--main [data-testid="result-title-a"]';
  readonly RESULT_LINKS = '.react-results--main a, .react-results--main [data-testid="result"]';

  // ==================== PAGE ELEMENT GETTERS ====================
  get searchInput() {
    return $(this.SEARCH_INPUT);
  }

  get searchInputAlt() {
    return $(this.SEARCH_INPUT_ALT);
  }

  get bodyElement() {
    return $(this.BODY_ELEMENT);
  }

  get searchButton() {
    return $(this.SEARCH_BUTTON);
  }

  get resultsContainer() {
    return $(this.RESULTS_CONTAINER);
  }

  get searchResults() {
    return $(this.SEARCH_RESULTS);
  }

  get resultTitles() {
    return browser.$$(this.RESULT_TITLES);
  }

  get resultLinks() {
    return browser.$$(this.RESULT_LINKS);
  }
}

export default new DuckDuckGoSearchObject();
