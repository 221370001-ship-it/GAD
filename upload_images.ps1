$consultationImg = "C:\Users\Abdullah Younas\.gemini\antigravity\brain\e09a6cc0-65a1-4da0-9f94-dca10d76e048\.user_uploaded\media_1794943084336_b2e59c08.jpg"
$doctorImg = "C:\Users\Abdullah Younas\.gemini\antigravity\brain\e09a6cc0-65a1-4da0-9f94-dca10d76e048\.user_uploaded\media_1794943084353_9a9f9d03.jpg"
$cloudName = "frbrngr7"
$uploadPreset = "GADaesthetics"
$uploadUrl = "https://api.cloudinary.com/v1_1/$cloudName/image/upload"

function Upload-ToCloudinary($filePath, $folder, $label) {
    Write-Host "Uploading $label..."
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $b64 = [Convert]::ToBase64String($bytes)
    $ext = [System.IO.Path]::GetExtension($filePath).TrimStart('.')
    $dataUri = "data:image/$ext;base64,$b64"
    
    $body = @{
        file = $dataUri
        upload_preset = $uploadPreset
        folder = $folder
    }
    
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -ContentType "application/json" -Body ($body | ConvertTo-Json)
    
    if ($response.secure_url) {
        Write-Host "SUCCESS: $($response.secure_url)"
        return $response.secure_url
    } else {
        Write-Host "FAILED: $($response | ConvertTo-Json)"
        return $null
    }
}

$consultUrl = Upload-ToCloudinary $consultationImg "gadaesthetics/consultation" "Consultation BG"
$doctorUrl  = Upload-ToCloudinary $doctorImg       "gadaesthetics/doctor"       "Dr. Abdullah Asif"

Write-Host ""
Write-Host "=== FINAL URLs ==="
Write-Host "CONSULTATION_BG: $consultUrl"
Write-Host "DOCTOR_PHOTO:    $doctorUrl"
