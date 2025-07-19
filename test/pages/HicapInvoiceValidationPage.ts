import { HicapInvoiceValidationObjects } from '../pageobjects/HicapInvoiceValidationObjects';
import Logger from '../utils/Logger';

export class HicapInvoiceValidationPage {
  private pageObject = new HicapInvoiceValidationObjects();

  /**
   * Get invoice validation values from the page
   */
  async getInvoiceValidationValues(): Promise<{ invoiceStatus: string; invoiceNumber: string }> {
    await (global as any).browser.pause(30000);
    Logger.info('------>STARTED getInvoiceValidationValues');
    Logger.logTestStep('Getting invoice validation values from page');
    try {
      await this.pageObject.invoiceStatus.waitForDisplayed({ timeout: 15000 });
      await this.pageObject.invoiceNumber.waitForDisplayed({ timeout: 15000 });
     
      Logger.debug('Extracting validation values from elements');
      const invoiceStatus = await this.pageObject.invoiceStatus.getText();
      const invoiceNumber = await this.pageObject.invoiceNumber.getText();
      

      const validationResults = {
        invoiceStatus: invoiceStatus.trim(),
        invoiceNumber: invoiceNumber.trim() 
      };


      Logger.info('------>>>>SUCCESSS<<<<--------');
      Logger.info(`Claim or Invoice Status: ${invoiceStatus}`);
      Logger.info(`Invoice Reference Number: ${invoiceNumber}`);
      


      Logger.logTestData('Invoice Submit Validation Results', validationResults);
      Logger.logSuccess('Successfully retrieved invoice submit validation values');
      return validationResults;

    } catch (error: unknown) {
      Logger.logFailure('Failed to get invoice submit validation values', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  

  /**
   * Get Invoice Status
   */
  async getInvoiceStatus(): Promise<string> {
    Logger.logTestStep('Getting gateway reference number');
    try {
      await this.pageObject.invoiceStatus.waitForDisplayed({ timeout: 15000 });
      const status = await this.pageObject.invoiceStatus.getText();
      Logger.logSuccess(`Gateway reference retrieved: ${status}`);
      return status.trim();
    } catch (error: unknown) {
      Logger.logFailure('Failed to get gateway reference', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  /**
   * Get Invoice number
   */
  async getInvoiceNumber(): Promise<string> {
    Logger.logTestStep('Getting Tyro reference number');
    try {
      await this.pageObject.invoiceNumber.waitForDisplayed({ timeout: 15000 });
      const hicapRef = await this.pageObject.invoiceNumber.getText();
      Logger.logSuccess(`Hicap invoice number retrieved: ${hicapRef}`);
      return hicapRef.trim();
    } catch (error: unknown) {
      Logger.logFailure('Failed to get Hicap invoice number', error instanceof Error ? error : String(error));
      throw error;
    }
  }

   
}

