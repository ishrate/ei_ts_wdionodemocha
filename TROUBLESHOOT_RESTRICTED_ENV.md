# WebdriverIO (WDIO) & Node.js Troubleshooting in Corporate Restricted Environments

## Problem Summary

Modern versions of WebdriverIO (WDIO v9+) use built-in driver management that requires direct internet access to download browser drivers (e.g., ChromeDriver) at runtime. In corporate environments with strict proxies, SSL interception, or firewall restrictions, this process fails, resulting in errors like:

- Failed to create a session: WebDriverError: Failed to fetch [POST] http://localhost:xxxx/session
- Unable to download or start ChromeDriver
- Certificate or proxy errors during npm install or test execution

Node.js and npm may also fail to install packages or verify SSL certificates due to corporate proxy and security policies.

## Solution Overview

1. **Use WDIO v8 with Manual Driver Management**
   - WDIO v8 supports the `wdio-chromedriver-service`, allowing you to use a manually downloaded ChromeDriver binary.
   - This avoids the need for runtime driver downloads and works reliably behind proxies.

2. **Configure npm and Node.js for Proxy/SSL**
   - Set npm proxy and registry settings.
   - Disable strict SSL if your company uses SSL interception.
   - Set Node.js to ignore unauthorized TLS certificates if needed.

## Step-by-Step Resolution

### 1. Uninstall WDIO v9+ and Related Packages
```powershell
npm uninstall webdriverio @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter @wdio/allure-reporter wdio-chromedriver-service chromedriver @wdio/globals expect-webdriverio
```

### 2. Install WDIO v8 and Chromedriver Service
```powershell
npm install --save-dev webdriverio@8 @wdio/cli@8 @wdio/local-runner@8 @wdio/mocha-framework@8 @wdio/spec-reporter@8 @wdio/allure-reporter@8 wdio-chromedriver-service@8 chromedriver
```

### 3. Manually Download ChromeDriver
- Download the version matching your Chrome browser from:
  https://googlechromelabs.github.io/chrome-for-testing/
- Extract `chromedriver.exe` and add its folder to your Windows PATH.

### 4. Update WDIO Config
- Use the chromedriver service:
  ```typescript
  services: ['chromedriver'],
  ```
- Only add `--headless=new` to Chrome options if `HEADLESS=true` in your `.env`:
  ```typescript
  args: [
    ...(process.env.HEADLESS === 'true' ? ['--headless=new'] : []),
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--ignore-certificate-errors',
    '--ignore-ssl-errors'
  ]
  ```

### 5. Configure npm and Node.js for Proxy/SSL
```powershell
npm config set proxy http://<user>:<password>@<proxy>:<port>
npm config set https-proxy http://<user>:<password>@<proxy>:<port>
npm config set registry https://registry.npmjs.org/
npm config set strict-ssl false
```

#### Set Node.js to Ignore SSL Errors (if needed)
- Set environment variable `NODE_TLS_REJECT_UNAUTHORIZED=0` in Windows System Environment Variables.

### 6. Debugging Tips
- Always check for proxy/SSL errors in npm and WDIO logs.
- If Chrome does not open, check if `HEADLESS` is set to `true` in `.env` or if Chrome is installed.
- For ESM/CommonJS issues with Chai, use `chai@4`:
  ```powershell
  npm install --save-dev chai@4
  ```
- If you see driver/session errors, ensure the correct ChromeDriver is in your PATH and matches your Chrome version.

## Recommendations
- Use WDIO v8 for maximum control in restricted environments.
- Always use a manually managed driver and avoid auto-download features.
- Document your proxy and security setup for future team members.
- Keep a copy of this troubleshooting guide in your repo.

---

For more details, see `SETUP_GUIDE.md` and `QUICK_REFERENCE.md`.
