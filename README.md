# WebdriverIO TypeScript Automation Framework

A comprehensive WebdriverIO automation framework using TypeScript, following Java Selenium POM patterns.

## 📁 Project Structure

```
WdiotsmochaAuto/
├── resources/                    # 📚 Static resources (included in Git)
│   ├── config/                   # Configuration files
│   └── data/                     # Test data files (XML, JSON, etc.)
│       └── searchData.xml        # XML test data
├── test/                         # 🧪 Test source code
│   ├── pageobjects/              # Page Object Model classes
│   │   ├── BasePage.ts           # Base page class (like Java)
│   │   └── SearchPage.ts         # Search page object
│   ├── specs/                    # Test specification files
│   │   └── duckduckgoSearch.spec.ts  # Test cases
│   └── utils/                    # Utility classes
│       ├── BaseTest.ts           # Base test class (like Java)
│       ├── configReader.ts       # Configuration reader
│       └── xmlDataReader.ts      # XML data reader utility
├── test-output/                  # 📊 Generated files (excluded from Git)
│   ├── screenshots/              # Test screenshots
│   ├── logs/                     # Test execution logs
│   ├── allure-results/           # Allure test results
│   └── reports/                  # Generated reports
├── wdio.conf.ts                  # WebdriverIO configuration
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
└── .dockerignore                 # Docker ignore rules
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in headless mode
npm run test:headless

# Run tests with debug
npm run test:debug
```

### Clean Output
```bash
# Clean all output files
npm run clean

# Clean specific folders
npm run clean:screenshots
npm run clean:logs
npm run clean:allure
```

### Generate Reports
```bash
# Generate Allure report
npm run report:allure

# Open Allure report in browser
npm run report:open
```

## 📂 Folder Organization

### 📚 **Resources Folder** (Included in Git/Docker)
- **`resources/config/`**: Configuration files for different environments
- **`resources/data/`**: Test data files (XML, JSON, CSV)

### 📊 **Test Output Folder** (Excluded from Git/Docker)
- **`test-output/screenshots/`**: Automatic screenshots on test failures
- **`test-output/logs/`**: Test execution logs
- **`test-output/allure-results/`**: Raw Allure test results
- **`test-output/reports/`**: Generated HTML reports

## 🔧 Configuration

### Environment Variables (.env)
```properties
# Environment
NODE_ENV=dev
BASE_URL=https://duckduckgo.com

# Browser Settings
BROWSER=chrome
MAXIMIZE_BROWSER=true
HEADLESS=false

# Timeouts
PAGE_LOAD_TIMEOUT=10000
ELEMENT_WAIT_TIMEOUT=5000
```

## 🔒 Using Encrypted Passwords in .env

To keep your credentials secure, this project supports encrypted passwords for application and database logins. You can use either plain text or encrypted values in your `.env` file.

### How to Encrypt and Use Passwords

1. **Choose a Secret Key**
   - Example: `Qw7!pL9z$2rT8vB6@xF3eS1mN0yU5hJ4` (generate your own and keep it safe!)

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

4. **Set the Secret Key as an Environment Variable**
   - **PowerShell (temporary for session):**
     ```powershell
     $env:DECRYPT_SECRET="YourSecretKeyHere"
     ```
   - **Permanent (Windows):**
     - Open "Edit environment variables for your account"
     - Add a new user variable: `DECRYPT_SECRET=YourSecretKeyHere`
     - Restart your terminal/VS Code

5. **Run your tests/app as usual.**
   - The framework will automatically decrypt passwords at runtime if needed.
   - Plain text values are still supported for gradual migration.

---

## 📊 Allure Report Generation & Viewing

This project provides a PowerShell script to automate Allure report generation, archiving, and viewing.

### How to Use

1. **Run your tests to generate Allure results.**
2. **Generate and view the report:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\generate-allure-report.ps1
   ```
   - This will:
     - Generate a fresh Allure HTML report from `test-output/allure-results`
     - Archive the report in a timestamped folder under `test-output/allure-reports/`
     - Open the report in your browser using Allure's built-in server

3. **View archived reports:**
   - Open any folder under `test-output/allure-reports/` and run:
     ```powershell
     npx allure open .
     ```
   - Or use the script again to view the latest report.

---

**For more details, see the troubleshooting guide and comments in the relevant scripts.**

## 🐳 Docker Integration

The `.dockerignore` file excludes:
- `test-output/` - Generated test artifacts
- `node_modules/` - Will be installed in container
- Development files and logs

## 📋 Git Integration

The `.gitignore` file excludes:
- `test-output/` - All generated test files
- `node_modules/` - Dependencies
- Environment-specific files
- IDE and OS files

## 🏗️ Java Selenium Equivalent

This framework follows Java Selenium patterns:

| Java Concept | WebdriverIO Equivalent |
|--------------|------------------------|
| BaseTest class | `test/utils/BaseTest.ts` |
| BasePage class | `test/pageobjects/BasePage.ts` |
| Page Objects | `test/pageobjects/*.ts` |
| Test Classes | `test/specs/*.spec.ts` |
| Properties files | `.env` + `resources/config/` |
| TestNG XML | XML files in `resources/data/` |
| Maven target/| `test-output/` |

## 📈 Reporting

- **Console Output**: Real-time test execution logs
- **Allure Reports**: Comprehensive HTML reports with screenshots
- **Screenshots**: Automatic capture on test failures
- **Test Logs**: Detailed execution logs in `test-output/logs/`

## 🔄 CI/CD Ready

The folder structure is optimized for:
- **Git**: Only source code and resources are tracked
- **Docker**: Excludes generated files and dependencies
- **CI/CD**: Clean separation of source and output
