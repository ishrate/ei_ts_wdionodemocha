
  
class HicapInvoiceEntryObjects {
  // ==================== LOCATORS ====================
  readonly INVOICE_LINK = "//a[text()='Invoices']";
  readonly CREATE_INVOICE = "//button//div[text()='Create Invoice']";
  
 // readonly ITEM_INPUT = "//input[starts-with(@id,'react-select') and contains(@id,'-input') and ancestor::div[@aria-label='item']]";
  //readonly ITEM_INPUT = "//input[starts-with(@id,'react-select') and contains(@id,'-input')]";
  readonly ITEM_INPUT ="//div[normalize-space()='Items']/following::input";
  readonly ITEM_OPTION_BY_NAME = (name: string) =>
    `//div[contains(@id,'react-select') and contains(@class,'option') and contains(text(),'${name}')]`;
  readonly DESCRIPTION_INPUT = "//*[@id='itemName']";
  readonly ADD_ITEM_BUTTON="//button[@type='submit' and contains(.,'Add item')]";
  
  readonly SUBMIT_CLAIM_BUTTON = "//button[@id='submitButton']";
 

  // Program combo box 
  readonly PROGRAM_INPUT = "//input[starts-with(@id,'react-select') and contains(@id,'-input')]";
  readonly PROGRAM_OPTION_BY_NAME = (name: string) =>
    `//div[contains(@id,'react-select') and contains(@class,'option') and text()='${name}']`;

  // Client combo box 
  readonly CLIENT_INPUT = "//input[starts-with(@id,'react-select') and contains(@id,'-input') and ancestor::div[@aria-label='client']]";
  readonly CLIENT_OPTION_BY_NAME = (name: string) =>
    `//div[contains(@id,'react-select') and contains(@class,'option') and text()='${name}']`;

  // Provider combo box 
  readonly PROVIDER_INPUT = "//input[starts-with(@id,'react-select') and contains(@id,'-input') and ancestor::div[@aria-label='provider']]";
  readonly PROVIDER_OPTION_BY_NAME = (name: string) =>
    `//div[contains(@id,'react-select') and contains(@class,'option') and contains(text(),'${name}')]`;
  readonly PROVIDER_NAME ="//*[@id='providerName']/div/div[1]/div[1]";
  // ==================== GETTERS ====================
  
  get invoiceLink() {
    return $(this.INVOICE_LINK);
  }

  get createInvoice() {
    return $(this.CREATE_INVOICE);
  }

  
  get descriptionInput() {
    return $(this.DESCRIPTION_INPUT);
  }

  get submitClaimButton() {
    return $(this.SUBMIT_CLAIM_BUTTON);
  }

  

  // Dynamic option selectors
  getSelectOption(value: string) {
    return $(`//div[contains(@class,"Select-option") and normalize-space(text())='${value}']`);
  }

  getItemOption(value: string) {
    return $(`//div[contains(@class,"Select-option") and contains(text(),'${value}')]`);
  }

  getInjuredWorkerOption(value: string) {
    return $(`//div[contains(text(),'${value}')]`);
  }

  // Program combo box helpers
  get programInput() {
    return $(this.PROGRAM_INPUT);
  }

  getProgramOption(name: string) {
    return $(this.PROGRAM_OPTION_BY_NAME(name));
  }

  // Client combo box helpers
  get clientInput() {
    return $(this.CLIENT_INPUT);
  }

  getClientOption(name: string) {
    return $(this.CLIENT_OPTION_BY_NAME(name));
  }

  // Provider combo box helpers
  get providerInput() {
    return $(this.PROVIDER_INPUT);
  }

  getProviderOption(name: string) {
    return $(this.PROVIDER_OPTION_BY_NAME(name));
  }

  // Item combo box helpers
  get itemInput() {
    return $(this.ITEM_INPUT);
  }

  getItemOptionByName(name: string) {
    return $(this.ITEM_OPTION_BY_NAME(name));
  }
}

export default new HicapInvoiceEntryObjects();