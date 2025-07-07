import * as dotenv from 'dotenv';

/// <reference types="webdriverio/sync" />

// Load environment variables
dotenv.config();

export const config = {
    // Runner Configuration
    runner: 'local',
    
    // Test Files
    specs: [
          './test/specs/simple.spec.ts'
    ],
    
    // Capabilities
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: [
                ...(process.env.HEADLESS === 'true' ? ['--headless=new'] : []),
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--ignore-certificate-errors',
                '--ignore-ssl-errors'
            ]
        }
    }],
    
    // Test Configuration
    logLevel: 'info',
    bail: 0,
    baseUrl: process.env.BASE_URL || 'https://duckduckgo.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 350000 // Increased timeout
    },
    
    // Reporters
    reporters: [
        'spec',
        ['allure', {
            outputDir: './test-output/allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ] as Array<string | [string, Record<string, any>]>,
    
    // Services - Using chromedriver service for WDIO v8
    services: ['chromedriver'],
    
    // Custom Application URLs and Settings
    appConfig: {
        baseUrl: process.env.BASE_URL || 'https://duckduckgo.com',
        searchUrl: process.env.SEARCH_URL || 'https://duckduckgo.com/',
        timeouts: {
            pageLoad: parseInt(process.env.PAGE_LOAD_TIMEOUT || '10000'),
            elementWait: parseInt(process.env.ELEMENT_WAIT_TIMEOUT || '5000'),
            searchResults: parseInt(process.env.SEARCH_RESULTS_TIMEOUT || '15000')
        },
        browser: {
            maximize: process.env.MAXIMIZE_BROWSER !== 'false',
            headless: process.env.HEADLESS === 'true'
        }
    },
    
    // Hooks
    before: function () {
        require('ts-node').register({
            files: true,
            transpileOnly: true,
            project: './tsconfig.json'
        });
        
        // Make config available globally
        (global as any).appConfig = config.appConfig;
    },

    // Simplified afterTest hook
    afterTest: async function (test: any, context: any, { error, result, duration, passed, retries }: { error: any; result: any; duration: any; passed: any; retries: any }) {
        if (passed) {
            console.log('✅ Test PASSED!');
        } else {
            console.log('❌ Test FAILED!');
            // Take screenshot on failure
            try {
                //await browser.saveScreenshot('./test-output/screenshots/failure.png');
            } catch (e) {
                console.log('Could not save screenshot:', e);
            }
        }
    }
};