# Bitwarden Secrets Manager Push Tool v1.0
# Kierunek: .env / .env.local --> Bitwarden

# --- Sprawdzanie tokena ---
$token = $env:BWS_ACCESS_TOKEN
if (-not $token) {
    Write-Host "`n[!] BLAD: Nie wykryto zmiennej environment: BWS_ACCESS_TOKEN" -ForegroundColor Red
    Write-Host "Szczegolowa instrukcja konfiguracji: scripts/Bitwarden/README-SETUP.md" -ForegroundColor Gray
    exit 1
}

# --- Ustawienia serwerow EU ---
$env:BWS_IDENTITY_URL = "https://vault.bitwarden.eu/identity"
$env:BWS_API_URL = "https://vault.bitwarden.eu/api"

$scriptPath = $PSScriptRoot
$exePath = Join-Path $scriptPath "bws.exe"
$rootPath = (Get-Item $scriptPath).Parent.Parent.FullName

# ID Twoich projektow w Bitwardenie
$prodProjectId = "e9332b7e-8012-44cc-bc70-b404006f40b7"
$localProjectId = "9e896350-b017-44bc-8467-b41700b5f449"

# --- Wybor pliku zrodlowego ---
Write-Host "`nKtory plik chcesz wyslac do Bitwardena?" -ForegroundColor Cyan
Write-Host "1. .env        (projekt produkcyjny: to-do-list-react)"
Write-Host "2. .env.local  (projekt lokalny: to-do-list-react-local)"
$fileChoice = Read-Host "Wpisz 1 lub 2"

if ($fileChoice -eq "1") {
    $sourceFile = Join-Path $rootPath ".env"
    $targetProjectId = $prodProjectId
    $targetProjectName = "to-do-list-react"
} elseif ($fileChoice -eq "2") {
    $sourceFile = Join-Path $rootPath ".env.local"
    $targetProjectId = $localProjectId
    $targetProjectName = "to-do-list-react-local"
} else {
    Write-Host "[!] Nieprawidlowy wybor. Anulowano." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $sourceFile)) {
    Write-Host "[!] Nie znaleziono pliku: $sourceFile" -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Pobieranie aktualnych sekretow z Bitwardena..." -ForegroundColor Cyan
$jsonOutput = & $exePath --server-url https://vault.bitwarden.eu secret list
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Blad podczas pobierania sekretow z Bitwardena." -ForegroundColor Red
    exit 1
}
$existingSecrets = $jsonOutput | ConvertFrom-Json

Write-Host "[2/3] Porownywanie z plikiem: $sourceFile..." -ForegroundColor Cyan

# Czytanie lokalnego pliku .env (ignorujemy puste linie i komentarze)
$localVars = @{}
Get-Content $sourceFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim().Trim('"')
            $localVars[$key] = $value
        }
    }
}

$updated = 0
$created = 0
$skipped = 0

Write-Host "`n[3/3] Synchronizacja do projektu '$targetProjectName'..." -ForegroundColor Cyan

foreach ($key in $localVars.Keys) {
    $localValue = $localVars[$key]
    $existing = $existingSecrets | Where-Object { $_.key -eq $key -and $_.projectId -eq $targetProjectId }

    if ($existing) {
        # Sekret istnieje - sprawdz czy wartosc sie zmienila
        if ($existing.value -ne $localValue) {
            Write-Host "  [~] Aktualizacja: $key" -ForegroundColor Yellow
            & $exePath --server-url https://vault.bitwarden.eu secret edit $existing.id --value $localValue | Out-Null
            $updated++
        } else {
            Write-Host "  [=] Bez zmian: $key" -ForegroundColor Gray
            $skipped++
        }
    } else {
        # Sekret nie istnieje - zapytaj o dodanie
        Write-Host "`n  [+] Nowy klucz: '$key' nie istnieje w Bitwardenie." -ForegroundColor White
        $addChoice = Read-Host "      Czy dodac go do projektu '$targetProjectName'? [T/N]"
        if ($addChoice -eq 'T' -or $addChoice -eq 't') {
            $createResult = & $exePath --server-url https://vault.bitwarden.eu secret create $key $localValue $targetProjectId 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "      Dodano: $key" -ForegroundColor Green
            } else {
                Write-Host "      [!] Blad podczas dodawania '$key': $createResult" -ForegroundColor Red
            }
            $created++
        } else {
            Write-Host "      Pominieto: $key" -ForegroundColor Gray
            $skipped++
        }
    }
}

Write-Host "`n--- Podsumowanie ---" -ForegroundColor Cyan
Write-Host "Zaktualizowano: $updated kluczy" -ForegroundColor Yellow
Write-Host "Dodano nowych:  $created kluczy" -ForegroundColor Green
Write-Host "Bez zmian:      $skipped kluczy" -ForegroundColor Gray
Write-Host "`nGotowe." -ForegroundColor Gray
