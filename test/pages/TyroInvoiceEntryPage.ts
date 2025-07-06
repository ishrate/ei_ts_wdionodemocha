import TyroInvoiceEntryObjects from '../pageobjects/TyroInvoiceEntryObjects';
import Logger from '../utils/Logger';

class TyroInvoiceEntry {
  private pageObject = TyroInvoiceEntryObjects;

  /**
   * Click on the "Get Paid" link
   */
  async clickGetPaidLink() {
    Logger.logPageAction('Click', 'Get Paid Link');
    try {
      const getPaidLink = await (global as any).$(this.pageObject.GETPAID_LINK);
      await getPaidLink.waitForDisplayed({ timeout: 10000 });
      await getPaidLink.click();
      Logger.logSuccess('Successfully clicked on "Get Paid" link');
    } catch (error) {
      Logger.logFailure('Failed to click "Get Paid" link', error);
      throw error;
    }
  }

  /**
   * Click on the "WorkSafe Victoria" link
   */
  async clickWorkSafeLink() {
    Logger.logPageAction('Click', 'WorkSafe Victoria Link');
    try {
      const workSafeLink = await (global as any).$(this.pageObject.WORKSAFE_LINK);
      await workSafeLink.waitForDisplayed({ timeout: 10000 });
      await workSafeLink.click();
      Logger.logSuccess('Successfully clicked on "WorkSafe Victoria" link');
    } catch (error) {
      Logger.logFailure('Failed to click "WorkSafe Victoria" link', error);
      throw error;
    }
  }

  /**
   * Enter the Invoice Reference Number
   */
  async enterInvoiceReference(invoiceRef: string) {
    Logger.logPageAction('Enter text', 'Invoice Reference Input', invoiceRef);
    try {
      const invoiceRefInput = await (global as any).$(this.pageObject.INVOICEREF_INPUT);
      await invoiceRefInput.waitForDisplayed({ timeout: 10000 });
      await invoiceRefInput.setValue(invoiceRef);
      Logger.logSuccess(`Successfully entered Invoice Reference: ${invoiceRef}`);
    } catch (error) {
      Logger.logFailure(`Failed to enter Invoice Reference: ${invoiceRef}`, error);
      throw error;
    }
  }

  async selectDropdownByVisibleText(type: 'location' | 'provider' | 'injuredWorker' | 'item', value: string) {
    Logger.logTestStep(`Selecting ${type} dropdown`, { value });
    
    switch (type) {
      case 'location': {
        try {
          Logger.debug('Attempting to select location dropdown');
          const locationDropdown = await (global as any).$(this.pageObject.LOCATION_DROPDOWN);
          await locationDropdown.waitForClickable({ timeout: 10000 });
          await locationDropdown.scrollIntoView();
          await locationDropdown.click();
          Logger.debug('Location dropdown clicked, waiting for options...');

          await (global as any).browser.pause(2000);

          const options = await (global as any).$$("//div[contains(@class,'Select-option')]");
          Logger.debug(`Found ${options.length} dropdown options`);

          let found = false;
          for (let i = 0; i < options.length; i++) {
            const txt = await options[i].getText();
            Logger.debug(`Option ${i + 1}: "${txt}"`);
            if (txt.trim() === value.trim()) {
              await options[i].click();
              Logger.logSuccess(`Successfully selected location: ${txt}`);
              found = true;
              break;
            }
          }
          if (!found) {
            Logger.logFailure(`Location option "${value}" not found`, { availableOptions: options.length });
            throw new Error(`Option "${value}" not found. Available options listed above.`);
          }
        } catch (error) {
          Logger.logFailure(`Failed to select location dropdown: ${value}`, error);
          throw error;
        }
        break;
      }
      
      case 'provider': {
        try {
          Logger.debug('Attempting to select provider dropdown');
          const providerDropdown = await (global as any).$(this.pageObject.PROVIDER_DROPDOWN);
          await providerDropdown.waitForClickable({ timeout: 10000 });
          await providerDropdown.scrollIntoView();
          await providerDropdown.click();
          Logger.debug('Provider dropdown clicked, waiting for options...');

          await (global as any).browser.pause(2000);

          const options = await (global as any).$$("//div[contains(@class,'Select-option')]");
          Logger.debug(`Found ${options.length} provider options`);

          let found = false;
          for (let i = 0; i < options.length; i++) {
            const txt = await options[i].getText();
            Logger.debug(`Provider option ${i + 1}: "${txt}"`);
            if (txt.trim() === value.trim()) {
              await options[i].click();
              Logger.logSuccess(`Successfully selected provider: ${txt}`);
              found = true;
              break;
            }
          }
          if (!found) {
            Logger.logFailure(`Provider option "${value}" not found`, { availableOptions: options.length });
            throw new Error(`Provider option "${value}" not found.`);
          }
        } catch (error) {
          Logger.logFailure(`Failed to select provider dropdown: ${value}`, error);
          throw error;
        }
        break;
      }
      
      case 'injuredWorker': {
        try {
          Logger.debug('Attempting to select injured worker dropdown');
          await (global as any).browser.pause(2000);
          const injuredWorkerDropdown = await (global as any).$(this.pageObject.INJURED_WORKER_INPUT);
          await injuredWorkerDropdown.waitForClickable({ timeout: 10000 });
          await injuredWorkerDropdown.scrollIntoView();
          await injuredWorkerDropdown.click();
          Logger.debug('Injured worker dropdown clicked, waiting for options...');

          await (global as any).browser.pause(2000);

          // Print all options for debug
          Logger.debug('Listing all visible dropdown options for injured worker...');
          const allOptions = await (global as any).$$('//ul//li//span');
          for (let i = 0; i < allOptions.length; i++) {
            const txt = await allOptions[i].getText();
            Logger.debug(`Option ${i + 1}: "${txt}"`);
          }

          // Try to select by visible text
        const allNameSpans = await (global as any).$$("//span[contains(@class, 'bb-Text') and not(contains(@class, 'css-1n98q3v'))]");
        let found = false;
        for (const span of allNameSpans) {
          const txt = await span.getText();
          Logger.debug(`Injured worker option: "${txt}"`);
          if (txt.trim() === value.trim()) {
            await span.click();
            Logger.logSuccess(`Successfully selected injured worker: ${txt}`);
            found = true;
            break;
          }
        }
        if (!found) {
          Logger.logFailure(`Injured worker option "${value}" not found`, { availableOptions: allNameSpans.length });
          throw new Error(`Injured worker option "${value}" not found.`);
        }
      } catch (error) {
        Logger.logFailure(`Failed to select injured worker dropdown: ${value}`, error);
        throw error;
      }
      break;
      }
      
      case 'item': {
        try {
          Logger.debug('Attempting to select item dropdown');
          const itemDropdown = await (global as any).$(this.pageObject.ITEM_DROPDOWN);
          await itemDropdown.waitForClickable({ timeout: 10000 });
          await itemDropdown.scrollIntoView();
          await itemDropdown.click();
          Logger.debug('Item dropdown clicked, waiting for input...');
          await (global as any).browser.pause(5000);

          // Type the value into the input field
          const itemInput = await (global as any).$(this.pageObject.ITEM_INPUT); // Make sure ITEM_INPUT points to the <input>
          await itemInput.waitForDisplayed({ timeout: 5000 });
          await itemInput.setValue(value);

          Logger.debug(`Typed "${value}" in item input, waiting for options...`);
          await (global as any).browser.pause(3000);

          // Now select the filtered option
          const options = await (global as any).$$("//div[contains(@class,'Select-option')]");
          Logger.debug(`Found ${options.length} item options`);

          let found = false;
          for (let i = 0; i < options.length; i++) {
            const txt = await options[i].getText();
            Logger.debug(`Item option ${i + 1}: "${txt}"`);
            if (txt.trim().toLowerCase().includes(value.trim().toLowerCase())) {
              await options[i].click();
              Logger.logSuccess(`Successfully selected item: ${txt}`);
              found = true;
              break;
            }
          }
          if (!found) {
            Logger.logFailure(`Item option "${value}" not found`, { availableOptions: options.length });
            throw new Error(`Item option "${value}" not found.`);
          }

        const descriptionInput = await (global as any).$(this.pageObject.DESCRIPTION_INPUT);
        await descriptionInput.waitForDisplayed({ timeout: 10000 });
        await descriptionInput.setValue('This is automated test');

        } catch (error) {
          Logger.logFailure(`Failed to select item dropdown: ${value}`, error);
          throw error;
        }
        break;
      }
    }
  }

  /**
   * Submit the claim
   */
  async submitClaim() {
    Logger.logTestStep('Submitting claim');
    try {
        // Disable Ctrl+C during critical operation
        process.removeAllListeners('SIGINT');
        
        Logger.debug('Looking for submit claim button');
        const submitClaimButton = await (global as any).$(this.pageObject.SUBMIT_CLAIM_BUTTON);
        await submitClaimButton.waitForClickable({ timeout: 5000 });
        await submitClaimButton.click();
        await (global as any).browser.pause(30000);
        
        Logger.info('Submit button clicked, waiting for response...');
        
        // Wait for the actual element to appear
        await (global as any).browser.waitUntil(async () => {
            try {
                const closeBtn = await (global as any).$(this.pageObject.CLOSE_AND_VIEW_INVOICE_BUTTON);
                return await closeBtn.isDisplayed();
            } catch (e) {
                Logger.debug('Still waiting for Close & View Invoice button...');
                return false;
            }
        }, {
            timeout: 60000,
            timeoutMsg: 'Close & View Invoice button did not appear within 60 seconds'
        });
        
        Logger.debug('Close & View Invoice button found, clicking...');
        const closeAndViewInvoiceBtn = await (global as any).$(this.pageObject.CLOSE_AND_VIEW_INVOICE_BUTTON);
        await closeAndViewInvoiceBtn.click();
        
        Logger.logSuccess('Invoice submitted successfully');
        
    } catch (error) {
        Logger.logFailure('Submit claim failed', error);
        throw error;
    } finally {
        // Re-enable signal handling
        process.on('SIGINT', () => {
            Logger.info('Received SIGINT, gracefully shutting down...');
            process.exit(0);
        });
    }
  }

  /**
   * Complete the invoice entry flow with provided data
   */
  async completeInvoiceEntry(invoiceRef: string, location: string, provider: string, injuredWorker: string, item: string) {
    const testData = { invoiceRef, location, provider, injuredWorker, item };
    Logger.logTestStart('Complete Invoice Entry Flow');
    Logger.logTestData('Invoice Entry Parameters', testData);

    try {
      await this.clickGetPaidLink();
      Logger.debug('Pausing 2 seconds after Get Paid link click');
      await (global as any).browser.pause(2000);
      
      await this.clickWorkSafeLink();
      Logger.debug('Pausing 2 seconds after WorkSafe link click');
      await (global as any).browser.pause(2000);
      
      await this.enterInvoiceReference(invoiceRef);
      
      await this.selectDropdownByVisibleText('location', location);
      Logger.debug('Pausing 2 seconds after location selection');
      await (global as any).browser.pause(2000);
      
      await this.selectDropdownByVisibleText('provider', provider);
      Logger.debug('Pausing 2 seconds after provider selection');
      await (global as any).browser.pause(2000);
      
      await this.selectDropdownByVisibleText('injuredWorker', injuredWorker);
      Logger.debug('Pausing 2 seconds after injured worker selection');
      await (global as any).browser.pause(2000);
      
      await this.selectDropdownByVisibleText('item', item);
      Logger.debug('Pausing 2 seconds after item selection');
      await (global as any).browser.pause(2000);
      
      await this.submitClaim();
      
      Logger.logTestEnd('Complete Invoice Entry Flow', 'PASSED');
    } catch (error) {
      Logger.logTestEnd('Complete Invoice Entry Flow', 'FAILED');
      Logger.logFailure('Invoice entry flow failed', error);
      throw error;
    }
  }
}

export default new TyroInvoiceEntry();
