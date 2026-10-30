# Validates JSON-LD structured data on live pages (what Google's Rich Results Test checks):
# every <script type="application/ld+json"> must parse as JSON and carry a Schema.org @type.
param([string]$Base = "https://www.ibrahimaraji.com")
$pages = @("/", "/en", "/en/books", "/en/books/scientific-miracles-quran-sunnah", "/books/the-true-promise", "/en/about", "/en/contact")
$out = @()
foreach ($p in $pages) {
    try {
        $html = (Invoke-WebRequest -UseBasicParsing "$Base$p" -TimeoutSec 30).Content
    } catch { $out += "FAIL fetch $p"; continue }
    $ms = [regex]::Matches($html, '<script type="application/ld\+json">(.*?)</script>', 'Singleline')
    if ($ms.Count -eq 0) { $out += "NONE  $p (no JSON-LD found)"; continue }
    foreach ($m in $ms) {
        $raw = $m.Groups[1].Value
        try {
            $obj = $raw | ConvertFrom-Json -ErrorAction Stop
            $items = if ($obj.'@graph') { $obj.'@graph' } else { @($obj) }
            $types = ($items | ForEach-Object { $_.'@type' }) -join ","
            $ctx = $obj.'@context'
            $flag = if ($ctx -match "schema.org") { "OK  " } else { "WARN" }
            $out += "$flag $p  types=[$types]  context=$ctx"
        } catch { $out += "BAD  $p  invalid JSON: $($_.Exception.Message)" }
    }
}
$out
