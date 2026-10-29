# Upload book PDFs to S3 for production serving (CloudFront fronts the bucket).
#
# The app references PDFs at /books/<slug>.pdf. In production these are NOT in the
# repo (gitignored); they live in S3 and are served via the same /books/ path through
# CloudFront (either an Amplify rewrite or a dedicated CloudFront distribution).
#
# Prereqs: AWS CLI v2 configured (us-east-1), the 5 PDFs present in public/books/.
# Usage:   pwsh ./scripts/upload-book-pdfs.ps1 -Bucket <your-bucket-name>
#
param(
  [Parameter(Mandatory = $true)] [string] $Bucket,
  [string] $Prefix = "books",
  [string] $Region = "us-east-1"
)

$ErrorActionPreference = "Stop"
$aws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$src = Join-Path $PSScriptRoot "..\public\books"

if (-not (Test-Path $src)) { throw "Source folder not found: $src" }

$pdfs = Get-ChildItem -Path $src -Filter *.pdf
if ($pdfs.Count -eq 0) { throw "No PDFs found in $src" }

Write-Host "Uploading $($pdfs.Count) PDF(s) to s3://$Bucket/$Prefix/ ($Region)"
foreach ($f in $pdfs) {
  $key = "$Prefix/$($f.Name)"
  & $aws s3 cp $f.FullName "s3://$Bucket/$key" `
    --region $Region `
    --content-type "application/pdf" `
    --cache-control "public, max-age=86400" `
    --no-cli-pager
  Write-Host "  uploaded $key ($([math]::Round($f.Length/1MB,2)) MB)"
}
Write-Host "Done. Ensure CloudFront/Amplify serves /$Prefix/* from this bucket."
