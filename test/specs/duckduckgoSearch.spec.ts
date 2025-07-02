import { expect } from 'chai';
import DuckDuckGoSearchObject from '../pageobjects/DuckDuckGoSearchObject';
import DuckDuckGoSearchPage from '../pages/DuckDuckGoSearchPage';
import XmlDataReader from '../utils/xmlDataReader';
import BaseTest from '../utils/BaseTest';

describe('DuckDuckGo Search Tests', () => {
  
  // Setup and teardown using BaseTest (like Java @BeforeMethod/@AfterMethod)
  beforeEach(async () => {
    await BaseTest.beforeEach();
  });

  afterEach(async () => {
    await BaseTest.afterEach();
  });

  it('should search for cheese using XML data on DuckDuckGo', async () => {
    // Read test data from XML file
    const testData = await XmlDataReader.getTestDataById('searchData.xml', '1');
    
    BaseTest.logTestInfo(`Running test: ${testData.description}`);
    
    await DuckDuckGoSearchPage.open();
    await DuckDuckGoSearchPage.search(testData.searchTerm);
    
    // Check if results contain the expected term
    const resultsText = await DuckDuckGoSearchPage.getResultsText();
    expect(resultsText.toLowerCase()).to.include(testData.expectedResult.toLowerCase());
    
    BaseTest.logTestSuccess('DuckDuckGo search test completed successfully');
  });

  it('should search for JavaScript tutorial using XML data on DuckDuckGo', async () => {
    // Read test data for JavaScript search
    const testData = await XmlDataReader.getTestDataById('searchData.xml', '2');
    
    BaseTest.logTestInfo(`Running test: ${testData.description}`);
    
    await DuckDuckGoSearchPage.open();
    await DuckDuckGoSearchPage.search(testData.searchTerm);
    
    // Check if results contain the expected term
    const resultsText = await DuckDuckGoSearchPage.getResultsText();
    expect(resultsText.toLowerCase()).to.include(testData.expectedResult.toLowerCase());
    
    BaseTest.logTestSuccess('JavaScript search test completed successfully');
  });

  it('should search for WebdriverIO automation using XML data on DuckDuckGo', async () => {
    // Read test data for WebdriverIO search
    const testData = await XmlDataReader.getTestDataById('searchData.xml', '3');
    
    BaseTest.logTestInfo(`Running test: ${testData.description}`);
    
    await DuckDuckGoSearchPage.open();
    await DuckDuckGoSearchPage.search(testData.searchTerm);
    
    // Check if results contain the expected term
    const resultsText = await DuckDuckGoSearchPage.getResultsText();
    expect(resultsText.toLowerCase()).to.include(testData.expectedResult.toLowerCase());
    
    BaseTest.logTestSuccess('WebdriverIO search test completed successfully');
  });

  it('should verify search functionality works correctly', async () => {
    BaseTest.logTestInfo('Running basic search functionality test');
    
    await DuckDuckGoSearchPage.open();
    
    // Verify page loads correctly
    const pageTitle = await DuckDuckGoSearchPage.getPageTitle();
    expect(pageTitle.toLowerCase()).to.include('duckduckgo');
    
    // Perform search
    await DuckDuckGoSearchPage.search('automation testing');
    
    // Verify results are displayed
    const hasResults = await DuckDuckGoSearchPage.isResultsDisplayed();
    expect(hasResults).to.be.true;
    
    // Get result titles
    const resultTitles = await DuckDuckGoSearchPage.getResultTitles();
    expect(resultTitles.length).to.be.greaterThan(0);
    
    BaseTest.logTestSuccess('Search functionality test completed successfully');
  });
});
