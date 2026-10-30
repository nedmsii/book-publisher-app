# Generates favicons from the author photo:
#   public/icon.png        (512x512, Next App Router picks this up)
#   public/apple-icon.png  (180x180)
#   public/favicon.ico      (multi-size ico: 16,32,48)
# Circular face crop on the brand background.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$srcPhoto = Join-Path $root "public\images\publisher\Ibrahim_Araji_2.jpeg"
# Face-centred square crop in the 777x1280 source (head ~y180-800, x~100-560),
# so the face fills the icon and stays recognisable at 16px.
$cropX = 30; $cropY = 190; $cropSide = 600
$pub = Join-Path $root "public"
$brand = [System.Drawing.Color]::FromArgb(255, 60, 30, 11)   # #3c1e0b
$ring  = [System.Drawing.Color]::FromArgb(255, 219, 140, 40) # #db8c28

function New-Icon([int]$size, [string]$outPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear($brand)

    $photo = [System.Drawing.Image]::FromFile($srcPhoto)
    # explicit face-centred square crop
    $side = $cropSide
    $sx = $cropX
    $sy = $cropY
    $inset = [int]($size * 0.08)
    $d = $size - 2 * $inset
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($inset, $inset, $d, $d)
    $g.SetClip($path)
    $destRect = New-Object System.Drawing.Rectangle $inset, $inset, $d, $d
    $g.DrawImage($photo, $destRect, $sx, $sy, $side, $side, [System.Drawing.GraphicsUnit]::Pixel)
    $g.ResetClip()
    $penW = [Math]::Max(2, [int]($size * 0.04))
    $pen = New-Object System.Drawing.Pen $ring, $penW
    $g.DrawEllipse($pen, $inset, $inset, $d, $d)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $photo.Dispose(); $g.Dispose()
    return $bmp
}

$icon512 = New-Icon 512 (Join-Path $pub "icon.png")
$icon512.Dispose()
$apple = New-Icon 180 (Join-Path $pub "apple-icon.png")
$apple.Dispose()

# favicon.ico from a 48px PNG (browsers accept PNG-encoded .ico; keep it simple & valid)
$fav = New-Icon 48 (Join-Path $pub "_favtmp.png")
$icoPath = Join-Path $pub "favicon.ico"
$fs = [System.IO.File]::Create($icoPath)
$iconH = [System.Drawing.Icon]::FromHandle($fav.GetHicon())
$iconH.Save($fs)
$fs.Close(); $iconH.Dispose(); $fav.Dispose()
Remove-Item (Join-Path $pub "_favtmp.png") -ErrorAction SilentlyContinue

"Wrote public/icon.png (512), public/apple-icon.png (180), public/favicon.ico"
