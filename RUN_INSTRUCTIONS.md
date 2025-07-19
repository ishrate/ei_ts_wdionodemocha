# How to Run Tyro Invoice Submit Test and Generate Allure Report

## 1. Set Your Secret Key and Run the Test

Open PowerShell and run:

```
$env:DECRYPT_SECRET="your_secret_key_here"; npx wdio run wdio.conf.ts --spec test/specs/tyroInvoiceSubmit.spec.ts
```

Replace `your_secret_key_here` with your actual secret key.

---

## 2. Generate the Allure Report

After the test completes, run:

```
node scripts/generate-report.js
```

---

## 3. Open the Latest Allure Report

To view the report in your browser:

```
start ./test-output/reports/allure-report/latest/index.html
```

---

## 4. All-in-One Command (Optional)

To run the test, generate the report, and open it in one go:

```
$env:DECRYPT_SECRET="your_secret_key_here"; npx wdio run wdio.conf.ts --spec test/specs/tyroInvoiceSubmit.spec.ts; node scripts/generate-report.js; start ./test-output/reports/allure-report/latest/index.html
```

---

## Notes
- Always set the `DECRYPT_SECRET` before running the test.
- If you have any issues, check the logs in the `logs/` folder.
- For CI/CD or Docker, set the environment variable as appropriate for your environment.

---

For any questions, contact Eamon Ishrat.

