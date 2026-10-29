$ErrorActionPreference = "Continue"
$env:PATH = [System.Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH','User') + ';C:\Windows\System32'
Set-Location "c:\Users\naraji\Documents\AWS\Spec-Driven Development with Kiro\Kiro_Projects\book-publisher-app"
npx tsc --noEmit *> tsc-result.log
"TSC_EXIT=$LASTEXITCODE" | Out-File -FilePath tsc-result.log -Append
