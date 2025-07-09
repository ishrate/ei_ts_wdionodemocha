# PowerShell pre-run script to set DECRYPT_SECRET for all test sessions
# Usage: .\set-decrypt-secret.ps1 "your_secret_here"

param(
    [Parameter(Mandatory = $true)]
    [string]$Secret
)

# Set the environment variable for the current session
$env:DECRYPT_SECRET = $Secret
Write-Host "DECRYPT_SECRET set for this terminal session."
Write-Host "You can now run your test commands in this window."

#-> run in ps terminal --> .\set-decrypt-secret.ps1 "your_secret_here"   and then run your test commands
