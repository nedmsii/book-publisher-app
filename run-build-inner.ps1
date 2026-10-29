$ErrorActionPreference = "Continue"
$env:PATH = [System.Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH','User') + ';C:\Windows\System32'
$env:NEXTAUTH_URL = 'http://localhost:3000'
$env:NEXTAUTH_SECRET = 'build-time-secret-32chars-exactly!'
$env:DATABASE_URL = 'postgresql://p:p@localhost:5432/p'
$env:NEXT_TELEMETRY_DISABLED = '1'
Set-Location "c:\Users\naraji\Documents\AWS\Spec-Driven Development with Kiro\Kiro_Projects\book-publisher-app"
"STARTED $(Get-Date -Format o)" | Out-File build3.log
& cmd /c "npx next build >> build3.log 2>&1"
"BUILD_EXIT=$LASTEXITCODE" | Out-File build3.log -Append
"FINISHED $(Get-Date -Format o)" | Out-File build3.log -Append
