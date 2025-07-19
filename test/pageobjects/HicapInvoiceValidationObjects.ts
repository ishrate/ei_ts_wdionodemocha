// Author: Eamon Ishrat- Automation Architect
export class HicapInvoiceValidationObjects {

    
 // Locators as readonly properties
    readonly INVOICE_STATUS = "//div[contains(@class,'invoiceStatus')]";
    //public readonly CLAIM_STATUS = ".//h2[normalize-space()='Invoice overview']//following-sibling::div//label[normalize-space()='wsv claim status']//following::span[1]";
    readonly INVOICE_NUMBER= "//*[@id='invoiceNum']";
    
    
    get invoiceNumber() {
    return $(this.INVOICE_NUMBER);   }

    
    get invoiceStatus() {
    return $(this.INVOICE_STATUS);
    }
  
}