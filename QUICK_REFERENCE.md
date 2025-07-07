# Quick Setup Reference Card

## 🚀 Fast Setup Commands

### 1. Proxy Configuration (Replace with your credentials)
```bash
npm config set proxy "http://USERNAME:PASSWORD@PROXY_URL:PORT/"
npm config set https-proxy "http://USERNAME:PASSWORD@PROXY_URL:PORT/"
npm config set strict-ssl false
```

### 2. Test Proxy
```bash
npm ping
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify Installation
```bash
npx wdio --version
```

### 5. Run Tests
```bash
npm test
```

---

## ⚡ Quick Commands

| Purpose | Command |
|---------|---------|
| Run all tests | `npm test` |
| Debug mode | `npm run test:debug` |
| Headless mode | `npm run test:headless` |
| Generate reports | `npm run report:allure` |
| Open reports | `npm run report:open` |
| Clean outputs | `npm run clean` |

---

## 🔧 Troubleshooting

### Proxy Error 407?
```bash
npm config set proxy "http://YOUR_USERNAME:YOUR_PASSWORD@YOUR_PROXY:PORT/"
npm ping
```

### Node.js Version Error?
1. Install Node.js v24+ from nodejs.org
2. Update PATH: `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`
3. Verify: `node --version`

### Installation Failed?
```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

---

**File Location:** `C:\Users\ishre3\eiwdiotsmocha\SETUP_GUIDE.md`
