export class TyroInvoiceValidationObjects {
    // Locators as readonly properties
    public readonly CLAIM_STATUS = ".//h2[normalize-space()='Invoice overview']//following-sibling::div//label[normalize-space()='wsv claim status']//following::span[1]";
    public readonly INVOICE_REFERENCE = ".//h2[normalize-space()='Invoice overview']//following-sibling::div//label[normalize-space()='Gateway reference']//following::div[1]";
    public readonly TYRO_REFERENCE = ".//h2[normalize-space()='Invoice overview']//following-sibling::div//label[normalize-space()='Tyro Health reference']//following::div[1]";

    // Getters for the elements
    get claimStatus(){
        return $(this.CLAIM_STATUS);
    }

    get invoiceReference(){
        return $(this.INVOICE_REFERENCE);
    }

    get tyroReference(){
        return $(this.TYRO_REFERENCE);
    }
}