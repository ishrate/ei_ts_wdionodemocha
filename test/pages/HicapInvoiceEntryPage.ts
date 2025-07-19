import HicapInvoiceEntryObjects from '../pageobjects/HicapInvoiceEntryObjects';
import Logger from '../utils/Logger';

class HicapInvoiceEntry {
  private pageObject = HicapInvoiceEntryObjects;

  /**
   * Click on the "Get Paid" link
   */
  async clickInvoiceLink() {
    Logger.logPageAction('Click', 'Get Paid Link');
    try {
      const invoiceLink = await (global as any).$(this.pageObject.INVOICE_LINK);
      await invoiceLink.waitForDisplayed({ timeout: 10000 });
      await invoiceLink.click();
      Logger.logSuccess('Successfully clicked on "Invocie" link');
    } catch (error) {
      Logger.logFailure('Failed to click "Invoice" link', error);
      throw error;
    }
  }

  /**
   * Click on the "WorkSafe Victoria" link
   */
  async clickCreateInvoice() {
    Logger.logPageAction('Click', 'WorkSafe Victoria Link');
    try {
      const createInvoice = await (global as any).$(this.pageObject.CREATE_INVOICE);
      await createInvoice.waitForDisplayed({ timeout: 10000 });
      await createInvoice.click();
      Logger.logSuccess('Successfully clicked on "Create Invoice" link');
    } catch (error) {
      Logger.logFailure('Failed to click "Create Invoice" link', error);
      throw error;
    }
  }

  /**
   * Enter the Invoice Reference Number
   */
  // async enterInvoiceReference(invoiceRef: string) {
  //   Logger.logPageAction('Enter text', 'Invoice Reference Input', invoiceRef);
  //   try {
  //     const invoiceRefInput = await (global as any).$(this.pageObject.INVOICEREF_INPUT);
  //     await invoiceRefInput.waitForDisplayed({ timeout: 10000 });
  //     await invoiceRefInput.setValue(invoiceRef);
  //     Logger.logSuccess(`Successfully entered Invoice Reference: ${invoiceRef}`);
  //   } catch (error) {
  //     Logger.logFailure(`Failed to enter Invoice Reference: ${invoiceRef}`, error);
  //     throw error;
  //   }
  // }

  async selectDropdownByVisibleText(type: 'program' | 'client' | 'provider' | 'item', value: string) {
    Logger.logTestStep(`Selecting ${type} dropdown`, { value });
    
    switch (type) {
      case 'program': {
        try {
          Logger.debug('Attempting to select Program dropdown');
          const locationDropdown = await (global as any).$(this.pageObject.PROGRAM_INPUT);

          await $(this.pageObject.PROGRAM_INPUT).setValue("WorkSafe Victoria");
          const option = await $(this.pageObject.PROGRAM_OPTION_BY_NAME(value));
          await option.waitForDisplayed({ timeout: 5000 });
          await option.click();
           
        } catch (error) {
          Logger.logFailure(`Failed to select location dropdown: ${value}`, error);
          throw error;
        }
        break;
      }

      case 'client': {
        try {
          Logger.debug('Attempting to select injured worker dropdown');
          await (global as any).browser.pause(2000);
          const injuredWorkerDropdown = await (global as any).$(this.pageObject.CLIENT_INPUT);
          // Type into the Client combo box
          await HicapInvoiceEntryObjects.clientInput.setValue(value);
          // Wait for the dropdown option to appear and click it
          const option = await HicapInvoiceEntryObjects.getClientOption(value);
          await option.waitForDisplayed({ timeout: 5000 });
          await option.click();


       
      } catch (error) {
        Logger.logFailure(`Failed to select injured worker dropdown: ${value}`, error);
        throw error;
      }
      break;
      }
      
      case 'provider': {
        try {
          Logger.debug('Attempting to select provider dropdown');
          Logger.info(`Provider search value: "${value}"`);
          const providerDropdown = await (global as any).$(this.pageObject.PROVIDER_INPUT);

          // Click to focus and open dropdown before typing 
          await HicapInvoiceEntryObjects.providerInput.click();
          await (global as any).browser.pause(500); // Wait for dropdown to open

          // Type only the first few letters to trigger correct filtering
          const partialValue = value.slice(0, 3);
          await HicapInvoiceEntryObjects.providerInput.setValue(partialValue);
          await (global as any).browser.pause(5000);

          
          const options = await (global as any).$$("div[class*='option']");
          let found = false;
          for (let i = 0; i < options.length; i++) {
            const text = await options[i].getText();
            Logger.info(`Provider option [${i}]: "${text}"`);
            if (text.trim() === value.trim()) {
              await options[i].click();
              Logger.info(`Clicked provider option: "${text}"`);
              found = true;
              break;
            }
          }
          if (!found) {
            Logger.logFailure(`Provider "${value}" not found in dropdown after typing "${partialValue}"`);
            throw new Error(`Provider "${value}" not found in dropdown after typing "${partialValue}"`);
          }
          await (global as any).browser.pause(1000);

        } catch (error) {
          Logger.logFailure(`Failed to select provider dropdown: ${value}`, error);
          throw error;
        }
        break;
      }
      
      
      
      case 'item': {
        try {
          Logger.debug('Attempting to select item dropdown');
          // 1. Scroll the item combo box into view
          const itemInput = await (global as any).$(this.pageObject.ITEM_INPUT);
          await itemInput.waitForDisplayed({ timeout: 10000 });
          await itemInput.scrollIntoView();
          Logger.debug('Scrolled item combo box into view');

          // 2. Click on the combo box to focus
          await itemInput.click();
          Logger.debug('Clicked item combo box');
          
          // 3. Type the item value
          await itemInput.setValue(value);
          Logger.debug(`Typed "${value}" in item combo box`);

          // 4. Wait for the dropdown option to appear and click it
          const option = await HicapInvoiceEntryObjects.getItemOptionByName(value);
          await option.waitForDisplayed({ timeout: 5000 });
          await option.click();
          Logger.debug(`Selected item option: ${value}`);

          // 5. Optionally, fill the description
          const descriptionInput = await (global as any).$(this.pageObject.DESCRIPTION_INPUT);
          await descriptionInput.waitForDisplayed({ timeout: 10000 });
          await descriptionInput.setValue('This is automated test');
          await (global as any).browser.pause(4000);

          const addItem = await (global as any).$(this.pageObject.ADD_ITEM_BUTTON);

          await addItem.waitForDisplayed({ timeout: 5000 });
          await addItem.click();
          await (global as any).browser.pause(4000);


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
        // await (global as any).browser.waitUntil(async () => {
        //     try {
        //         const closeBtn = await (global as any).$(this.pageObject.CLOSE_AND_VIEW_INVOICE_BUTTON);
        //         return await closeBtn.isDisplayed();
        //     } catch (e) {
        //         Logger.debug('Still waiting for Close & View Invoice button...');
        //         return false;
        //     }
        // }, {
        //     timeout: 60000,
        //     timeoutMsg: 'Close & View Invoice button did not appear within 60 seconds'
        // });
        
        // Logger.debug('Close & View Invoice button found, clicking...');
        // const closeAndViewInvoiceBtn = await (global as any).$(this.pageObject.CLOSE_AND_VIEW_INVOICE_BUTTON);
        // await closeAndViewInvoiceBtn.click();
        
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
  async completeInvoiceEntry(invoiceRef: string, program: string, client: string, provider: string, item: string) {
    const testData = { invoiceRef, program, client, provider, item };
    Logger.logTestStart('Complete Invoice Entry Flow');
    Logger.logTestData('Invoice Entry Parameters', testData);

    try {
      await this.clickInvoiceLink();
      Logger.debug('Pausing 2 seconds after Invoice link click');
      await (global as any).browser.pause(2000);
      
      await this.clickCreateInvoice();
      Logger.debug('Pausing 2 seconds after WorkSafe link click');
      await (global as any).browser.pause(2000);
      
      //await this.enterInvoiceReference(invoiceRef);
      
      await this.selectDropdownByVisibleText('program', program);
      Logger.debug('Pausing 2 seconds after location selection');
      await (global as any).browser.pause(2000);
      
      await this.selectDropdownByVisibleText('client', client);
      Logger.debug('Pausing 2 seconds after provider selection');
      await (global as any).browser.pause(2000);
      
      await this.selectDropdownByVisibleText('provider', provider);
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

export default new HicapInvoiceEntry();


