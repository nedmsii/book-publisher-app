# Generates a 1200x630 Open Graph card (public/og/og-default.jpg) for social sharing.
# Uses .NET System.Drawing (Windows, no install). Composes: brand background,
# circular author portrait, author name (EN + AR), and tagline.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$srcPhoto = Join-Path $root "public\images\publisher\ibrahim-fawaz-araji-speaking.jpg"
$outDir   = Join-Path $root "public\og"
$out      = Join-Path $outDir "og-default.jpg"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background: deep ink with a warm brand band
$ink = [System.Drawing.Color]::FromArgb(255, 60, 30, 11)      # #3c1e0b
$brand = [System.Drawing.Color]::FromArgb(255, 219, 140, 40)  # #db8c28
$g.Clear($ink)
$brandBrush = New-Object System.Drawing.SolidBrush $brand
$g.FillRectangle($brandBrush, 0, ($H - 14), $W, 14)   # bottom accent bar

# Circular portrait on the right
$photo = [System.Drawing.Image]::FromFile($srcPhoto)
$d = 380                      # circle diameter
$cx = $W - $d - 90            # left of circle
$cy = [int](($H - $d) / 2)
# Crop source to a centered square, then draw clipped to a circle
$side = [Math]::Min($photo.Width, $photo.Height)
$sx = [int](($photo.Width - $side) / 2)
$sy = [int](($photo.Height - $side) / 6)   # bias upward to keep the face
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse($cx, $cy, $d, $d)
$g.SetClip($path)
$destRect = New-Object System.Drawing.Rectangle $cx, $cy, $d, $d
$g.DrawImage($photo, $destRect, $sx, $sy, $side, $side, [System.Drawing.GraphicsUnit]::Pixel)
$g.ResetClip()
# ring around the portrait
$pen = New-Object System.Drawing.Pen $brand, 6
$g.DrawEllipse($pen, $cx, $cy, $d, $d)

# Text block on the left
$fName  = New-Object System.Drawing.Font "Georgia", 46, ([System.Drawing.FontStyle]::Bold)
$fArab  = New-Object System.Drawing.Font "Arial", 40, ([System.Drawing.FontStyle]::Bold)
$fTag   = New-Object System.Drawing.Font "Georgia", 24, ([System.Drawing.FontStyle]::Italic)
$white  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$brandText = New-Object System.Drawing.SolidBrush $brand
$muted  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 230, 215, 195))

$fSub = New-Object System.Drawing.Font "Georgia", 30, ([System.Drawing.FontStyle]::Bold)
$x = 90
# NOTE: System.Drawing cannot shape Arabic script correctly, so the card is
# English-only. Arabic sharers still get correct Arabic in the OG title/description
# (WhatsApp renders those) and on the page itself.
$g.DrawString("Ibrahim Fawaz Araji", $fName, $white, $x, 165)
$g.DrawString("Author & Publisher", $fSub, $brandText, $x, 245)
$g.DrawString("Qur'an & modern science - Islamic thought", $fTag, $muted, $x, 320)
$g.DrawString("spirituality - memoir - family heritage", $fTag, $muted, $x, 360)
$g.DrawString("Ten books - a lifetime of scholarship & faith", $fTag, $muted, $x, 410)

# Save as JPEG quality 90
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]90)
$bmp.Save($out, $enc, $ep)

$photo.Dispose(); $g.Dispose(); $bmp.Dispose()
"Wrote $out ($W x $H)"
