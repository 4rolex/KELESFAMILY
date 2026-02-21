Add-Type -AssemblyName System.Drawing

# Klasoru wildcard ile bul (encoding sorunu yasiyor)
$imagesFolder = Get-ChildItem "$PSScriptRoot" -Directory | Where-Object { $_.Name -match "(?i)images" } | Select-Object -First 1
$imagesPath = $imagesFolder.FullName
Write-Host "Klasor bulundu: $imagesPath" -ForegroundColor Cyan

$quality = 55

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

$totalBefore = 0
$totalAfter = 0
$count = 0

Get-ChildItem $imagesPath -Include "*.png", "*.jpg", "*.jpeg" -Recurse | ForEach-Object {
    $file = $_
    $beforeSize = $file.Length
    $totalBefore += $beforeSize

    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Her zaman JPEG olarak kaydet (uzanti degistirme, sadece icerik)
        $tempPath = $file.FullName + ".tmp"
        $img.Save($tempPath, $encoder, $encoderParams)
        $img.Dispose()

        $afterSize = (Get-Item $tempPath).Length

        # Sadece kucukse yaz (buyuyorsa orijinali koru)
        if ($afterSize -lt $beforeSize) {
            Remove-Item $file.FullName -Force
            Rename-Item $tempPath $file.FullName
            $totalAfter += $afterSize
            $saved = [math]::Round(($beforeSize - $afterSize) / 1KB, 1)
            Write-Host "OK  $($file.Name): $([math]::Round($beforeSize/1KB))KB -> $([math]::Round($afterSize/1KB))KB (-${saved}KB)" -ForegroundColor Green
        }
        else {
            Remove-Item $tempPath -Force
            $totalAfter += $beforeSize
            Write-Host "=   $($file.Name): zaten kucuk, atildi" -ForegroundColor Gray
        }
        $count++
    }
    catch {
        $totalAfter += $beforeSize
        Write-Host "ERR $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

$savedMB = [math]::Round(($totalBefore - $totalAfter) / 1MB, 2)
$beforeMB = [math]::Round($totalBefore / 1MB, 2)
$afterMB = [math]::Round($totalAfter / 1MB, 2)

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Islem tamamlandi: $count gorsel" -ForegroundColor Cyan
Write-Host "Oncesi: ${beforeMB} MB" -ForegroundColor Yellow
Write-Host "Sonrasi: ${afterMB} MB" -ForegroundColor Green
Write-Host "Kazanim: ${savedMB} MB" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter'a bas..." -NoNewline
$null = Read-Host
