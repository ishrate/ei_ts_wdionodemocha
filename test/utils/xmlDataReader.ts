import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';

/**
 * XmlDataReader - Utility class for reading test data from XML files
 * Similar to Java-based data providers for reading XML test data
 */
class XmlDataReader {

  /**
   * Read search data from XML file
   * @param fileName - Name of the XML file (without path)
   * @returns Promise<any> - Parsed XML data object
   */
  async readSearchData(fileName: string = 'searchData.xml'): Promise<any> {
    const filePath = path.join(__dirname, '../data', fileName);
    
    console.log('Reading XML from:', filePath);
    
    try {
      const xmlContent = fs.readFileSync(filePath, 'utf8');
      
      return new Promise((resolve, reject) => {
        parseString(xmlContent, (err, result) => {
          if (err) {
            reject(new Error(`Failed to parse XML file ${fileName}: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to read XML file ${fileName}: ${error}`);
    }
  }

  /**
   * Get search term from XML data by test ID
   * @param fileName - Name of the XML file
   * @param testId - ID of the test case (default: "1")
   * @returns Promise<string> - Search term from XML
   */
  async getSearchTerm(fileName: string = 'searchData.xml', testId: string = '1'): Promise<string> {
    const xmlData = await this.readSearchData(fileName);
    
    // Handle new XML structure: <testSuite><test id="1"><search>cheese</search></test></testSuite>
    if (xmlData && xmlData.testSuite && xmlData.testSuite.test) {
      const tests = xmlData.testSuite.test;
      
      // Find test by ID
      const targetTest = tests.find((test: any) => test.$.id === testId);
      
      if (targetTest && targetTest.search && targetTest.search[0]) {
        return targetTest.search[0];
      }
    }
    
    throw new Error(`Search term not found for test ID: ${testId} in XML file: ${fileName}`);
  }

  /**
   * Get expected result from XML data by test ID
   * @param fileName - Name of the XML file
   * @param testId - ID of the test case (default: "1")
   * @returns Promise<string> - Expected result from XML
   */
  async getExpectedResult(fileName: string = 'searchData.xml', testId: string = '1'): Promise<string> {
    const xmlData = await this.readSearchData(fileName);
    
    if (xmlData && xmlData.testSuite && xmlData.testSuite.test) {
      const tests = xmlData.testSuite.test;
      const targetTest = tests.find((test: any) => test.$.id === testId);
      
      if (targetTest && targetTest.expectedResult && targetTest.expectedResult[0]) {
        return targetTest.expectedResult[0];
      }
    }
    
    throw new Error(`Expected result not found for test ID: ${testId} in XML file: ${fileName}`);
  }

  /**
   * Get test description from XML data by test ID
   * @param fileName - Name of the XML file  
   * @param testId - ID of the test case (default: "1")
   * @returns Promise<string> - Test description from XML
   */
  async getTestDescription(fileName: string = 'searchData.xml', testId: string = '1'): Promise<string> {
    const xmlData = await this.readSearchData(fileName);
    
    if (xmlData && xmlData.testSuite && xmlData.testSuite.test) {
      const tests = xmlData.testSuite.test;
      const targetTest = tests.find((test: any) => test.$.id === testId);
      
      if (targetTest && targetTest.description && targetTest.description[0]) {
        return targetTest.description[0];
      }
    }
    
    throw new Error(`Test description not found for test ID: ${testId} in XML file: ${fileName}`);
  }

  /**
   * Get complete test data by test ID
   * @param fileName - Name of the XML file
   * @param testId - ID of the test case (default: "1")
   * @returns Promise<object> - Complete test data object
   */
  async getTestDataById(fileName: string = 'searchData.xml', testId: string = '1'): Promise<any> {
    const xmlData = await this.readSearchData(fileName);
    
    if (xmlData && xmlData.testSuite && xmlData.testSuite.test) {
      const tests = xmlData.testSuite.test;
      const targetTest = tests.find((test: any) => test.$.id === testId);
      
      if (targetTest) {
        return {
          id: targetTest.$.id,
          searchTerm: targetTest.search[0],
          expectedResult: targetTest.expectedResult[0],
          description: targetTest.description[0]
        };
      }
    }
    
    throw new Error(`Test data not found for test ID: ${testId} in XML file: ${fileName}`);
  }

  /**
   * Get all test cases from XML file
   * @param fileName - Name of the XML file
   * @returns Promise<any[]> - Array of all test data objects
   */
  async getAllTestCases(fileName: string = 'searchData.xml'): Promise<any[]> {
    const xmlData = await this.readSearchData(fileName);
    
    if (xmlData && xmlData.testSuite && xmlData.testSuite.test) {
      const tests = xmlData.testSuite.test;
      
      return tests.map((test: any) => ({
        id: test.$.id,
        searchTerm: test.search[0],
        expectedResult: test.expectedResult[0], 
        description: test.description[0]
      }));
    }
    
    throw new Error(`No test cases found in XML file: ${fileName}`);
  }

  /**
   * Get all key-value pairs for a section from any XML file in /data.
   * @param fileName - XML file name (e.g., 'invoiceData.xml')
   * @param section - Section/tag to retrieve (e.g., 'standardInvoice')
   * @returns Promise<Record<string, string>>
   */
  async getSectionData(fileName: string, section: string): Promise<Record<string, string>> {
    // Adjust the path if your data folder is different
    const filePath = path.join(__dirname, '../data', fileName);
    console.log('Reading XML from:', filePath);

    try {
      const xmlContent = fs.readFileSync(filePath, 'utf8');
      return new Promise((resolve, reject) => {
        parseString(xmlContent, (err, result) => {
          if (err) {
            reject(new Error(`Failed to parse XML file ${fileName}: ${err.message}`));
          } else {
            // result.testData[section][0] is the section object
            if (
              result &&
              result.testData &&
              result.testData[section] &&
              result.testData[section][0]
            ) {
              const sectionObj = result.testData[section][0];
              const data: Record<string, string> = {};
              for (const key of Object.keys(sectionObj)) {
                data[key] = sectionObj[key][0];
              }
              resolve(data);
            } else {
              reject(new Error(`Section ${section} not found in ${fileName}`));
            }
          }
        });
      });
    } catch (error) {
      console.error('Error reading XML file:', error);
      throw new Error(`Failed to read XML file ${fileName}: ${error}`);
    }
  }
}

export default new XmlDataReader();
