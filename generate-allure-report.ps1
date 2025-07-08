# PowerShell script to generate and archive Allure reports with timestamped folders

$ErrorActionPreference = "Stop"

# Paths
$resultsDir = "test-output\allure-results"
$archiveRoot = "test-output\allure-reports"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportDir = "test-output\allure-report"
$archiveDir = Join-Path $archiveRoot $timestamp

# Ensure archive root exists
if (!(Test-Path $archiveRoot)) {
    New-Item -ItemType Directory -Path $archiveRoot | Out-Null
}

# Clean previous report
if (Test-Path $reportDir) {
    Remove-Item -Recurse -Force $reportDir
}

# Generate the report
npx allure generate $resultsDir --clean -o $reportDir

# Archive with timestamp
Copy-Item -Recurse -Force $reportDir $archiveDir

Write-Host "Allure report generated at $reportDir"
Write-Host "Archived to $archiveDir"

# Optional: Open the report in default browser

# Start Allure's built-in local server (no Python required)
Write-Host "Starting Allure server to view the report ..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', "npx allure open $reportDir"
Write-Host "You can now view the report in your browser."


#powershell -ExecutionPolicy Bypass -File .\generate-allure-report.ps1