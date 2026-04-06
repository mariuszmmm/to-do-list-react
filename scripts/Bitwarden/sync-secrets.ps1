# Bitwarden Secrets Manager Sync Tool v1.0
# Ustawienia kodowania dla polskich znakow
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Sprawdzanie zmiennych środowiskowych
$token = $env:BWS_ACCESS_TOKEN

if (-not $token) {
    Write-Host "`n[!] BLAD: Nie wykryto zmiennej environment: BWS_ACCESS_TOKEN" -ForegroundColor Red
    Write-Host "--------------------------------------------------------"
    Write-Host "KROK 1: Uzyskaj token z Bitwardena (EU):" -ForegroundColor Yellow
    Write-Host "1. Zaloguj sie na: https://vault.bitwarden.eu"
    Write-Host "2. Wejdz w: Secrets Manager -> Machine Accounts."
    Write-Host "3. Wybierz swoje konto (np. 'to-do-list') i przejdz do zakladki 'Access Tokens'."
    Write-Host "4. Wygeneruj lub skopiuj Access Token (zaczynajacy sie od 0.)."
    
    Write-Host "`nKROK 2: Ustaw go w Windowsie za pomoca tej komendy:" -ForegroundColor Yellow
    Write-Host "[System.Environment]::SetEnvironmentVariable(`"BWS_ACCESS_TOKEN`", `"TUTAJ_WKLEJ_SWOJ_TOKEN_0.XXX`", `"User`")" -ForegroundColor Green
    
    Write-Host "`nWAZNE NOTATKI:" -ForegroundColor Yellow
    Write-Host "- Slowo 'User' na koncu komendy zostaw DOKLADNIE TAK JAK JEST."
    Write-Host "- Po wpisaniu komendy MUSISZ zrestartowac terminal (zamknij go i otworz ponownie)."
    Write-Host '- Aby sprawdzic czy zmienna dziala: echo $env:BWS_ACCESS_TOKEN'
    Write-Host '- Aby usunac token z systemu (reset): [System.Environment]::SetEnvironmentVariable("BWS_ACCESS_TOKEN", $null, "User")'
    Write-Host '- Pelna instrukcja znajduje sie w pliku: scripts/Bitwarden/README-SETUP.md' -ForegroundColor Gray
    Write-Host "--------------------------------------------------------`n"
    exit 1
}

# Ustawienia serwerow EU (ustalone podczas sesji)
$env:BWS_IDENTITY_URL = "https://vault.bitwarden.eu/identity"
$env:BWS_API_URL = "https://vault.bitwarden.eu/api"

$scriptPath = $PSScriptRoot
$exePath = Join-Path $scriptPath "bws.exe"
$outputPath = Join-Path (Get-Item $scriptPath).Parent.Parent.FullName ".env"

Write-Host "`n[1/3] Pobieranie sekretow z Bitwarden Secrets Manager..." -ForegroundColor Cyan
try {
    # Pobranie danych przez bws.exe
    $jsonOutput = & $exePath --server-url https://vault.bitwarden.eu secret list
    if ($LASTEXITCODE -ne 0) { throw "Blad podczas wywolania bws.exe" }
    
    Write-Host "[2/3] Rozdzielanie i formatowanie danych..." -ForegroundColor Cyan
    $secrets = ($jsonOutput | ConvertFrom-Json)
    
    # ID Twoich projektów (pobrane ze screenshotu)
    $prodProjectId = "e9332b7e-8012-44cc-bc70-b404006f40b7"
    $localProjectId = "9e896350-b017-44bc-8467-b41700b5f449"
    
    # Ścieżki do plików (root projektu)
    $rootPath = (Get-Item $scriptPath).Parent.Parent.FullName
    $prodEnvPath = Join-Path $rootPath ".env"
    $localEnvPath = Join-Path $rootPath ".env.local"
    $exampleEnvPath = Join-Path $rootPath ".env.example"
    
    # Ocalenie istniejących komentarzy pełnolinijkowych
    $prodComments = @()
    if (Test-Path $prodEnvPath) {
        $prodComments = @(Get-Content $prodEnvPath -Encoding UTF8 | Where-Object { $_.Trim().StartsWith("#") })
    }
    
    $localComments = @()
    if (Test-Path $localEnvPath) {
        $localComments = @(Get-Content $localEnvPath -Encoding UTF8 | Where-Object { $_.Trim().StartsWith("#") })
    }
    
    # 2a. Tworzenie .env (tylko z projektu produkcyjnego)
    $prodLines = $secrets | Where-Object { $_.projectId -eq $prodProjectId } | Sort-Object -Property key | ForEach-Object {
        $val = $_.value
        if ($val -match '#' -or $val -match '\s') { $val = "`"$val`"" }
        if ([string]::IsNullOrWhiteSpace($_.note)) { "$($_.key)=$val" } else { "$($_.key)=$val # $($_.note)" }
    }
    $prodComments + $prodLines | Set-Content -Path $prodEnvPath -Encoding UTF8
    
    # 2b. Tworzenie .env.local (tylko z projektu lokalnego)
    $localLines = $secrets | Where-Object { $_.projectId -eq $localProjectId } | Sort-Object -Property key | ForEach-Object {
        $val = $_.value
        if ($val -match '#' -or $val -match '\s') { $val = "`"$val`"" }
        if ([string]::IsNullOrWhiteSpace($_.note)) { "$($_.key)=$val" } else { "$($_.key)=$val # $($_.note)" }
    }
    $localComments + $localLines | Set-Content -Path $localEnvPath -Encoding UTF8
    
    # 2c. Tworzenie wzorcowego .env.example (tylko z projektu produkcyjnego, bez haseł i bez komentarzy)
    $allKeys = $secrets | Where-Object { $_.projectId -eq $prodProjectId } | Sort-Object -Property key
    $exampleLines = $allKeys | ForEach-Object {
        "$($_.key)=your_value_here"
    }
    $exampleLines | Set-Content -Path $exampleEnvPath -Encoding UTF8
    
    Write-Host "Sukces! Zaktualizowano produkcyjny: .env" -ForegroundColor Green
    Write-Host "Sukces! Zaktualizowano lokalny: .env.local" -ForegroundColor Green
    Write-Host "Sukces! Zaktualizowano wzorzec: .env.example" -ForegroundColor Green
    
    Write-Host "[3/3] Synchronizacja z Netlify..." -ForegroundColor Cyan
    $choice = Read-Host "Czy chcesz zaimportowac te dane teraz do Netlify? [T/N]"
    
    if ($choice -eq 'T' -or $choice -eq 't') {
        Write-Host "Wgrywanie do Netlify..." -ForegroundColor Yellow
        netlify env:import $outputPath
        Write-Host "Synchronizacja zakonczona!" -ForegroundColor Green
    } else {
        Write-Host "Pominieto import do Netlify. Twoje dane sa gotowe w pliku .env." -ForegroundColor Gray
    }

} catch {
    Write-Host "`n[!] BLAD: Cos poszlo nie tak podczas pobierania danych." -ForegroundColor Red
    Write-Host "Upewnij sie, ze token jest poprawny i masz polaczenie z internetem."
    Write-Host "Szczegoly bledu: $_"
}

Write-Host "`nGotowe." -ForegroundColor Gray
