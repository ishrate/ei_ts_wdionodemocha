import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    // Runner Configuration
    runner: 'local',
    
    // Test Files
    specs: [
          './test/specs/tyroInvoiceSubmit.spec.ts'
    ],
    
    // Capabilities
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: [
                '--disable-infobars', 
                '--disable-dev-shm-usage', 
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-extensions',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-popup-blocking',
                '--disable-notifications',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
            excludeSwitches: ['enable-automation'],
            useAutomationExtension: false,
            prefs: {
                // Disable save password popup
                'credentials_enable_service': false,
                'profile.password_manager_enabled': false,
                // Disable other popups
                'profile.default_content_setting_values.notifications': 2,
                'profile.default_content_setting_values.media_stream_mic': 2,
                'profile.default_content_setting_values.media_stream_camera': 2,
                'profile.default_content_setting_values.geolocation': 2,
                'profile.default_content_setting_values.cookies': 1
            }
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
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ] as Array<string | [string, Record<string, any>]>,
    
    // Services
    services: [],
    
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
    
    // MODIFIED: Keep browser open regardless of test result
    afterTest: async function (test: any, context: any, { error, result, duration, passed, retries }: { error: any; result: any; duration: any; passed: any; retries: any }) {
        if (passed) {
            console.log('Test PASSED. Browser will remain open for inspection (5 minutes)...');
        } else {
            console.log('Test FAILED. Browser will remain open for debugging (5 minutes)...');
        }
        
        // Keep browser open for 10 minutes regardless of test result
        console.log('Browser will stay open for 5 minutes. Press Ctrl+C to stop earlier.');
        await browser.pause(300000); // 5 minutes = 300,000 milliseconds
    }
};