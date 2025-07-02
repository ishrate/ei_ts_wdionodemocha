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
| Maven target/ | `test-output/` |

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
