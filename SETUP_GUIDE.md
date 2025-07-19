# WebdriverIO Setup Guide - Complete Solution

## Overview
This guide provides step-by-step instructions to set up a WebdriverIO TypeScript automation framework with proper proxy configuration for corporate environments.

## Prerequisites
- Windows OS
- Git installed
- Internet connection through corporate proxy
- Proxy credentials (username/password)

---

## Step 1: Clone the Repository

```bash
git clone git@github.com:ishrate/eiwdiotsmocha.git
cd eiwdiotsmocha
```

---

## Step 2: Node.js Installation and Version Management

### Check Current Node.js Version
```bash
node --version
npm --version
```

### If Node.js is Outdated (< v18):

1. **Download Node.js LTS** from https://nodejs.org/
2. **Install** the latest LTS version (recommended: v24.x or higher)
3. **Update system PATH** to use the new Node.js installation:
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;" + $env:PATH
   ```
4. **Verify the update:**
   ```bash
   node --version  # Should show v24.x or higher
   npm --version   # Should show v11.x or higher
   ```

---

## Step 3: Corporate Proxy Configuration

### Configure npm Proxy Settings

Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_PROXY_URL:PORT` with your actual credentials:

```bash
npm config set proxy "http://YOUR_USERNAME:YOUR_PASSWORD@YOUR_PROXY_URL:PORT/"
npm config set https-proxy "http://YOUR_USERNAME:YOUR_PASSWORD@YOUR_PROXY_URL:PORT/"
npm config set registry "https://registry.npmjs.org/"
npm config set strict-ssl false
```

### Example (using the values from our session):
```bash
npm config set proxy "http://ishre3:ArcArcHarc01@wproxy.vwa.gov.au:8080/"
npm config set https-proxy "http://ishre3:ArcArcHarc01@wproxy.vwa.gov.au:8080/"
npm config set registry "https://registry.npmjs.org/"
npm config set strict-ssl false
```

### Verify Proxy Configuration
```bash
npm config list
npm ping  # This should return a successful response
```

---

## Step 4: Install Dependencies

### Clean Installation
```bash
npm install --verbose
```

### Expected Output:
- No proxy authorization errors
- All packages should install successfully
- Final message: "found 0 vulnerabilities"

### If Installation Fails:
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```
2. **Delete node_modules and package-lock.json:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   ```
3. **Retry installation:**
   ```bash
   npm install
   ```

---

## Step 5: Verify WebdriverIO Installation

```bash
npx wdio --version
```
Expected output: `9.16.2` (or similar version)

---

## Step 6: Available Commands

### Test Execution Commands:
```bash
# Run all tests
npm test

# Run tests in debug mode
npm run test:debug

# Run specific test (Tyro Invoice)
npm run test:debug:tyro

# Run tests in headless mode
npm run test:headless

# Run tests and generate reports
npm run test:report
```

### Report Generation:
```bash
# Generate Allure report
npm run report:allure

# Open Allure report in browser
npm run report:open

# Open report index directly
npm run report:open:index
```

### Cleanup Commands:
```bash
# Clean all test outputs
npm run clean

# Clean specific folders
npm run clean:screenshots
npm run clean:logs
npm run clean:allure
```

---

## Step 7: Troubleshooting Common Issues

### Issue 1: Proxy Authentication Errors (407)
**Solution:**
1. Verify proxy credentials are correct
2. Ensure special characters in password are URL-encoded if needed
3. Test proxy connectivity: `npm ping`

### Issue 2: Node.js Version Compatibility
**Error:** `Unsupported engine` warnings
**Solution:**
1. Update to Node.js v18+ (recommended v24+)
2. Update PATH environment variable
3. Restart terminal/VS Code

### Issue 3: SSL/TLS Certificate Issues
**Solution:**
```bash
npm config set strict-ssl false
npm config set ca null
```

### Issue 4: Network Timeout Issues
**Solution:**
```bash
npm config set timeout 300000
npm config set registry https://registry.npmjs.org/
```

---

## Step 8: Project Structure Overview

```
eiwdiotsmocha/
├── test/
│   ├── specs/           # Test specification files
│   ├── pageobjects/     # Page Object Model files
│   └── data/           # Test data files
├── scripts/            # Utility scripts
├── test-output/        # Test results and reports
├── wdio.conf.ts       # WebdriverIO configuration
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

---

## Step 9: Important Configuration Files

### wdio.conf.ts
- Main WebdriverIO configuration
- Browser settings, timeouts, reporters
- Selenium standalone service configuration

### package.json
- All npm scripts for testing and reporting
- Dependencies for WebdriverIO, TypeScript, Allure

### tsconfig.json
- TypeScript compiler settings
- Module resolution and path mappings

---

## Step 10: Best Practices

### Before Running Tests:
1. Ensure proxy settings are configured
2. Verify Node.js version compatibility
3. Run `npm ping` to test connectivity
4. Clean previous test outputs if needed

### During Development:
1. Use debug mode for troubleshooting: `npm run test:debug`
2. Run specific tests during development
3. Keep dependencies updated regularly

### After Tests:
1. Generate and review Allure reports
2. Archive test results if needed
3. Clean up test outputs for next run

---

## Step 11: Environment Variables (Optional)

For different environments, you can set:

```bash
# For headless browser execution
set HEADLESS=true

# For specific browser
set BROWSER=chrome

# For custom base URL
set BASE_URL=https://your-test-environment.com
```

---

## Secure Credential Management (Cross-Platform)

This project supports encrypted secrets for all sensitive credentials (DB/app passwords) in `.env`.

### How to Encrypt and Use Passwords

1. **Choose a Secret Key**
   - Example: `Qw7!pL9z$2rT8vB6@xF783eS1mN0yU5h765` (generate your own and keep it safe!)

2. **Encrypt Your Password**
   - In your project root, run:
     ```powershell
     node encrypt-secret.js "YourPasswordHere" "YourSecretKeyHere"
     ```
   - Copy the output string (format: `iv:encrypted`).

3. **Update `.env`**
   - Replace the plain password with the encrypted string (no quotes):
     ```properties
     DEV_PASSWORD=ENCRYPTED_STRING_HERE
     TEST_PASSWORD=ENCRYPTED_STRING_HERE
     DB_PASSWORD=ENCRYPTED_STRING_HERE
     ```

4. **Set the Secret Key for Decryption (Choose one method):**
   - **PowerShell (Windows):**
     ```powershell
     .\set-decrypt-secret.ps1 "YourSecretKeyHere"
     # or manually:
     $env:DECRYPT_SECRET = "YourSecretKeyHere"
     ```
   - **Bash/sh (Linux/macOS/Git Bash):**
     ```sh
     source ./set-decrypt-secret.sh "YourSecretKeyHere"
     # or manually:
     export DECRYPT_SECRET="YourSecretKeyHere"
     ```
   - **NPM Script (cross-platform, for CI or local):**
     - Set `DECRYPT_SECRET_NPM` in your environment, or pass as an argument:
       ```powershell
       $env:DECRYPT_SECRET_NPM = "YourSecretKeyHere"
       npm run test:with-secret
       # or
       npm run test:with-secret -- "YourSecretKeyHere"
       ```

5. **Run your tests/app as usual.**
   - The framework will automatically decrypt passwords at runtime if needed.
   - Plain text values are still supported for gradual migration.

#### NPM Scripts for Encrypted Secrets
- `npm run test:with-secret` — Run all tests with secret from env or argument
- `npm run test:with-secret:spec -- "YourSecretKeyHere"` — Run specific spec with secret

#### Troubleshooting
- If you see an error about missing or incorrect `DECRYPT_SECRET`, ensure you set the secret in the same terminal/session before running tests.
- For CI/CD, set `DECRYPT_SECRET_NPM` as a secret variable in your pipeline.
- See error messages for detailed instructions.

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run all tests | `npm test` |
| Debug tests | `npm run test:debug` |
| Check WebdriverIO version | `npx wdio --version` |
| Test proxy connectivity | `npm ping` |
| Generate reports | `npm run report:allure` |
| Clean test outputs | `npm run clean` |
| View npm configuration | `npm config list` |

---

## Contact Information

For issues or questions, refer to:
- WebdriverIO Documentation: https://webdriver.io/
- npm Documentation: https://docs.npmjs.com/
- Corporate IT Support for proxy configuration

---

**Last Updated:** July 7, 2025  
**Version:** 1.0  
**Author:** Eamon Ishrat
