// Author: Eamon Ishrat- Automation Architect
class TyroInvoiceEntryObjects {
  // ==================== LOCATORS ====================
  readonly GETPAID_LINK = "//p[normalize-space()='Get paid']";
  readonly WORKSAFE_LINK = "//*[@id='main-content']//div[normalize-space(text())='WorkSafe Victoria']";
  readonly CLAIM_BUTTON = "//button[normalize-space()='Claim']";
  readonly INVOICEREF_INPUT = "//*[@id='main-content']//h2[normalize-space()='Invoice details']/following::input[@type='text'][1]";
  
  // Dropdown locators
  readonly LOCATION_DROPDOWN = "//label[normalize-space()='Location']/following::div[contains(@class,'Select-control')][1]";
  readonly PROVIDER_DROPDOWN = "//label[normalize-space()='Provider']/following::div[contains(@class,'Select-control')][1]";
  readonly INJURED_WORKER_INPUT = "//h2[normalize-space()='Injured worker details']/following::div[@name='patient']";
  readonly INJURED_WORKER_OPTION_BY_NAME = (name: string) =>
    `//ul[contains(@class, 'bb-DropdownMenu')]//span[contains(text(), "${name}")]`;

  readonly INJURED_WORKER_OPTION_BY_NAME2 = (name: string) =>
      `//h2[normalize-space()='Injured worker details']/following::div[@name='patient']//div[@role='listbox']//ul/li//span[contains(text(), "${name}")]`;
  readonly ITEM_DROPDOWN: string = "//label[normalize-space()='Item']/following::div[contains(@class,'Select-control')][1]";
  readonly ITEM_INPUT= "input[aria-label='Select an item']";
  readonly DESCRIPTION_INPUT = "//input[@name='serviceItems[0].customDescription']";
  readonly SUBMIT_CLAIM_BUTTON = "//span[normalize-space()='Submit claim']/ancestor::button";
  readonly CLOSE_AND_VIEW_INVOICE_BUTTON = ".//button[normalize-space()='Close & view invoice']";
  // ==================== GETTERS ====================
  get getPaidLink() {
    return $(this.GETPAID_LINK);
  }

  get workSafeLink() {
    return $(this.WORKSAFE_LINK);
  }

  get claimButton() {
    return $(this.CLAIM_BUTTON);
  }

  get invoiceRefInput() {
    return $(this.INVOICEREF_INPUT);
  }

  get locationDropdown() {
    return $(this.LOCATION_DROPDOWN);
  }

  get providerDropdown() {
    return $(this.PROVIDER_DROPDOWN);
  }

  get injuredWorkerInput() {
    return $(this.INJURED_WORKER_INPUT);
  }

  get itemDropdown() {
    return $(this.ITEM_DROPDOWN);
  }

  get descriptionInput() {
    return $(this.DESCRIPTION_INPUT);
  }

  get submitClaimButton() {
    return $(this.SUBMIT_CLAIM_BUTTON);
  }

  get closeAndViewInvoiceButton() {
    return $(this.CLOSE_AND_VIEW_INVOICE_BUTTON);
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
}

export default new TyroInvoiceEntryObjects();