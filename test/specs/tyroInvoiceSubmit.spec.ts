// Author: Eamon Ishrat- Automation Architect
import { expect } from 'chai';
import allure from '@wdio/allure-reporter';
import DatabaseHelper from '../utils/DatabaseHelper';
import LoginPage from '../pages/TyroLoginPage';
import TyroInvoiceEntry from '../pages/TyroInvoiceEntryPage';
import { TyroInvoiceValidationPage } from '../pages/TyroInvoiceValidationPage';
import ConfigReader from '../utils/configReader';
import BaseTest from '../utils/BaseTest';
import xmlDataReader from '../utils/xmlDataReader';
import Logger from '../utils/Logger';

declare global {
  // eslint-disable-next-line no-var
  var submittedInvoiceData: {
    invoiceRef: string;
    gatewayReference: string;
    tyroReference: string;
    claimStatus: string;
    submissionTime: string;
  };
}

describe('Tyro Invoice Submission Tests', function () {
  this.timeout(350000);

  beforeEach(async function () {
    await BaseTest.beforeEach();
  });

  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === 'failed') {
      try {
        const screenshot = await (browser as any).takeScreenshot();
        allure.addAttachment('Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
      } catch (error) {
        Logger.error('Failed to capture screenshot:', error instanceof Error ? error.message : String(error));
      }
    }
    await BaseTest.afterEach();
  });

  it('should login and submit standard invoice', async function () {
    BaseTest.logTestInfo('Testing standard invoice submission with XML data');
    allure.addFeature('Invoice Submission');
    allure.addSeverity('critical');

    let invoiceData;

    // Step 1: Fetch and validate invoice data from XML
    allure.startStep('Fetch and validate invoice data from XML');
    try {
      invoiceData = await xmlDataReader.getSectionData('invoiceData.xml', 'standardInvoice');
      allure.addAttachment('Fetched invoiceData', JSON.stringify(invoiceData, null, 2), 'application/json');
      expect(invoiceData).to.not.be.null;
      expect(invoiceData).to.be.an('object');
      expect(invoiceData.invoiceRef).to.not.be.undefined;
      expect(invoiceData.location).to.not.be.undefined;
      expect(invoiceData.provider).to.not.be.undefined;

      expect(invoiceData.injuredWorker).to.not.be.undefined;
      expect(invoiceData.item).to.not.be.undefined;
    } catch (error) {
      allure.addAttachment('Error fetching invoiceData', String(error), 'text/plain');
      throw error;
    }
    allure.endStep();

    const invoiceRef = invoiceData.invoiceRef;
    const location = invoiceData.location;
    const provider = invoiceData.provider;
    const injuredWorker = invoiceData.injuredWorker;
    const item = invoiceData.item;

    // Step 2: Navigate to login page and authenticate
    allure.startStep('Navigate to login page and authenticate');
    await LoginPage.openLoginPage();
    const currentUrl = await (browser as any).getUrl();
    expect(currentUrl).to.include('medipass');
    // Use new AUT/env credential login (defaults to TYRO and current env)
    await LoginPage.loginWithAutEnvironmentCredentials('tyro');
    await (global as any).browser.waitUntil(async () => {
      const url = await (global as any).browser.getUrl();
      return !url.includes('login');
    }, {
      timeout: 30000,
      timeoutMsg: 'Login should complete within 30 seconds'
    });
    allure.endStep();

    BaseTest.logTestSuccess('Login successful - proceeding with invoice entry');

    // Step 3: Complete invoice entry form
    allure.startStep('Complete invoice entry form');
    await TyroInvoiceEntry.completeInvoiceEntry(invoiceRef, location, provider, injuredWorker, item);
    await (global as any).browser.waitUntil(async () => {
      const readyState = await (global as any).browser.execute(() => document.readyState);
      return readyState === 'complete';
    }, {
      timeout: 30000,
      timeoutMsg: 'Page should load completely within 30 seconds'
    });
    allure.endStep();

    // Step 4: Validate invoice submission results from UI
    allure.startStep('Validate invoice submission results from UI');
    const validationPage = new TyroInvoiceValidationPage();
    
    const validationResults = await validationPage.getInvoiceValidationValues();
    allure.addAttachment('Validation Results', JSON.stringify(validationResults, null, 2), 'application/json');
    expect(validationResults).to.not.be.null;
    expect(validationResults).to.be.an('object');
    expect(validationResults.claimStatus).to.not.be.empty;
    expect(validationResults.gatewayReference).to.not.be.empty;
    expect(validationResults.tyroReference).to.not.be.empty;
    allure.endStep();

    // Step 5: Store validation results for database comparison
    allure.startStep('Store validation results for database comparison');
    const submissionTime = new Date().toISOString();
    global.submittedInvoiceData = {
      invoiceRef: invoiceRef,
      gatewayReference: validationResults.gatewayReference,
      tyroReference: validationResults.tyroReference,
      claimStatus: validationResults.claimStatus,
      submissionTime: submissionTime
    };
    allure.endStep();

    BaseTest.logTestSuccess('Standard invoice submission completed successfully');
  });
});

//Tempus DB validatoin test

describe('Tyro Invoice Database Validation Tests', function () {
  this.timeout(150000);

  let dbConnection: any;

  before(async function () {
    try {
      // Wait to allow the system to update the DB after invoice submission
      await new Promise(resolve => setTimeout(resolve, 50000));
      dbConnection = await DatabaseHelper.connect();
      expect(dbConnection).to.not.be.null;
      BaseTest.logTestInfo('Database connection established');
    } catch (error) {
      Logger.error('Database connection error:', error);
      throw error;
    }
  });

  after(async function () {
    if (dbConnection) {
      await DatabaseHelper.disconnect(dbConnection);
      BaseTest.logTestInfo('Database connection closed');
    }
  });

  it('should validate submitted invoice data in Oracle database', async function () {
    const submittedData = global.submittedInvoiceData;

    expect(submittedData).to.not.be.null;
    expect(submittedData).to.not.be.undefined;
    expect(submittedData.gatewayReference).to.not.be.empty;

    if (!submittedData) {
      throw new Error('No submitted invoice data found. Please run the invoice submission test first.');
    }

    BaseTest.logTestInfo('Validating submitted invoice data in Oracle database');

    const dbQuery = `
      SELECT INVOICE_PAYEE_TYPE, INVOICE_STATUS, CLAIM_NBR, INVOICE_SUBMITTED_DATE 
      FROM STD_INVOICE 
      WHERE INVOICE_ID = :gatewayRef
    `;

    const queryParams = {
      gatewayRef: submittedData.gatewayReference
    };

    let dbResults;
    try {
      dbResults = await DatabaseHelper.executeQuery(dbConnection, dbQuery, queryParams);

      expect(dbResults).to.not.be.null;
      expect(dbResults).to.be.an('array');
      expect(dbResults.length).to.equal(1);

    } catch (error) {
      Logger.error('Database query error:', error);
      throw error;
    }

    const dbInvoice = dbResults[0];

    expect(dbInvoice).to.not.be.null;
    expect(dbInvoice.INVOICE_PAYEE_TYPE).to.not.be.null;
    // Defensive debug: print full DB row if status is missing
    if (!('INVOICE_STATUS' in dbInvoice)) {
      Logger.error('INVOICE_STATUS missing from DB row: ' + JSON.stringify(dbInvoice, null, 2));
    }
    expect(dbInvoice.INVOICE_STATUS, 'INVOICE_STATUS is missing from DB result! Full row: ' + JSON.stringify(dbInvoice)).to.exist;
    expect(dbInvoice.CLAIM_NBR).to.not.be.null;
    expect(dbInvoice.INVOICE_SUBMITTED_DATE).to.not.be.null;

    Logger.info('==============================================================');
    Logger.info('Here are Invoice Data retrieved from Tempus BD TS2: ' + JSON.stringify(dbInvoice, null, 2));
    Logger.info('================================================================');

    // Safe, case-sensitive status check (matches DB value exactly)
    if (dbInvoice.INVOICE_STATUS === undefined) {
      throw new Error('INVOICE_STATUS is undefined in DB result! Full row: ' + JSON.stringify(dbInvoice));
    }
    expect(dbInvoice.INVOICE_STATUS).to.be.oneOf([
      'Submitted', 'Pending Review', 'Partially Accepted', 'Rejected', 'Accepted', 'Denied'
    ]);

    allure.addAttachment('Database validation results', JSON.stringify(dbInvoice, null, 2), 'application/json');
    BaseTest.logTestSuccess('Database validation completed successfully');
  });

 
});

