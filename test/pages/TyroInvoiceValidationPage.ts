import { TyroInvoiceValidationObjects } from '../pageobjects/TyroInvoiceValidationObjects';
import Logger from '../utils/Logger';

export class TyroInvoiceValidationPage {
  private pageObject = new TyroInvoiceValidationObjects();

  /**
   * Get invoice validation values from the page
   */
  async getInvoiceValidationValues(): Promise<{ claimStatus: string; gatewayReference: string; tyroReference: string }> {
    await (global as any).browser.pause(30000);
    Logger.info('------>STARTED getInvoiceValidationValues');
    Logger.logTestStep('Getting invoice validation values from page');
    try {
      await this.pageObject.claimStatus.waitForDisplayed({ timeout: 15000 });
      await this.pageObject.invoiceReference.waitForDisplayed({ timeout: 15000 });
      await this.pageObject.tyroReference.waitForDisplayed({ timeout: 15000 });

      Logger.debug('Extracting validation values from elements');
      const claimStatus = await this.pageObject.claimStatus.getText();
      const gatewayReference = await this.pageObject.invoiceReference.getText();
      const tyroReference = await this.pageObject.tyroReference.getText();

      const validationResults = {
        claimStatus: claimStatus.trim(),
        gatewayReference: gatewayReference.trim(),
        tyroReference: tyroReference.trim()
      };


      Logger.info('------>>>>SUCCESSS<<<<--------');
      Logger.info(`Validation Results: ${claimStatus}`);
      Logger.info(`Gateway Reference: ${gatewayReference}`);
      Logger.info(`Tyro Reference: ${tyroReference}`);


      Logger.logTestData('Invoice Validation Results', validationResults);
      Logger.logSuccess('Successfully retrieved invoice validation values');
      return validationResults;
    } catch (error: unknown) {
      Logger.logFailure('Failed to get invoice validation values', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  /**
   * Verify that the invoice is under review
   */
  async verifyInvoiceUnderReview(): Promise<boolean> {
    Logger.logTestStep('Verifying invoice is under review');
    try {
      await this.pageObject.claimStatus.waitForDisplayed({ timeout: 15000 });
      const claimStatusText = await this.pageObject.claimStatus.getText();
      Logger.debug(`Claim status text: "${claimStatusText}"`);

      if (claimStatusText.trim() === 'UNDER REVIEW') {
        Logger.logSuccess('Invoice is correctly under review');
        return true;
      } else {
        Logger.logFailure(`Expected "UNDER REVIEW" but got "${claimStatusText}"`);
        return false;
      }
    } catch (error: unknown) {
      Logger.logFailure('Failed to verify invoice under review status', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  /**
   * Get gateway reference number
   */
  async getGatewayReference(): Promise<string> {
    Logger.logTestStep('Getting gateway reference number');
    try {
      await this.pageObject.invoiceReference.waitForDisplayed({ timeout: 15000 });
      const gatewayRef = await this.pageObject.invoiceReference.getText();
      Logger.logSuccess(`Gateway reference retrieved: ${gatewayRef}`);
      return gatewayRef.trim();
    } catch (error: unknown) {
      Logger.logFailure('Failed to get gateway reference', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  /**
   * Get Tyro reference number
   */
  async getTyroReference(): Promise<string> {
    Logger.logTestStep('Getting Tyro reference number');
    try {
      await this.pageObject.tyroReference.waitForDisplayed({ timeout: 15000 });
      const tyroRef = await this.pageObject.tyroReference.getText();
      Logger.logSuccess(`Tyro reference retrieved: ${tyroRef}`);
      return tyroRef.trim();
    } catch (error: unknown) {
      Logger.logFailure('Failed to get Tyro reference', error instanceof Error ? error : String(error));
      throw error;
    }
  }

  /**
   * Verify all validation elements are present
   */
  async verifyValidationElementsPresent(): Promise<boolean> {
    Logger.logTestStep('Verifying all validation elements are present');
    try {
      const elements = [
        { name: 'Claim Status', element: this.pageObject.claimStatus },
        { name: 'Gateway Reference', element: this.pageObject.invoiceReference },
        { name: 'Tyro Reference', element: this.pageObject.tyroReference }
      ];

      for (const item of elements) {
        Logger.debug(`Checking presence of ${item.name}`);
        const isDisplayed = await item.element.isDisplayed();
        if (isDisplayed) {
          Logger.debug(`✓ ${item.name} is present`);
        } else {
          Logger.logFailure(`${item.name} is not displayed`);
          return false;
        }
      }

      Logger.logSuccess('All validation elements are present');
      return true;
    } catch (error: unknown) {
      Logger.logFailure('Failed to verify validation elements presence', error instanceof Error ? error : String(error));
      throw error;
    }
  }
}

