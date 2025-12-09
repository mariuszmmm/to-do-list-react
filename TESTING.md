# Automatyczne uruchamianie testów

## 📋 Konfiguracja

### 1. Pre-commit Hook (Husky + lint-staged)

Testy uruchamiają się **automatycznie przed każdym commitem**.

Kiedy uruchamiasz:
```bash
git commit -m "moja zmiana"
```

System:
- ✅ Uruchamia testy dla zmienionych plików
- ✅ Jeśli testy failują → commit jest BLOKOWANY
- ✅ Możesz naprawić kod i spróbować ponownie

### 2. GitHub Actions (CI/CD Pipeline)

Testy uruchamiają się **automatycznie na każdy push i pull request**.

Workflow:
- ✅ Node 18.x i 20.x (testowanie kompatybilności)
- ✅ Instalacja zależności
- ✅ Uruchomienie testów z coverage
- ✅ Upload raportów do Codecov (jeśli skonfigurowany)

### Plik konfiguracyjny
`.github/workflows/tests.yml` - uruchamia się na:
- Push do `main`, `master`, `test-*` branches
- Pull requests do tych branches

## 🚀 Jak działa?

### Scenario 1: Lokalny commit
```bash
$ git add .
$ git commit -m "Add new feature"

# Husky + lint-staged uruchamia:
# → npm test (dla zmienionych plików)

# ✅ Wszystkie testy przeszły → commit OK
# ❌ Jakiś test failuje → commit ZABLOKOWANY
```

### Scenario 2: Push do GitHub
```bash
$ git push origin feature-branch

# GitHub Actions uruchamia workflow:
# → Setup Node 18.x i 20.x
# → npm ci (instalacja)
# → npm test --coverage
# → Upload do Codecov

# ✅ Wszystkie testy przeszły → można mergować
# ❌ Jakiś test failuje → PR zablokowany
```

## 📊 Co widać na GitHub?

- ✅ Green checkmark - wszystkie testy przeszły
- ❌ Red X - testy nie przeszły (nie możesz mergować)
- 📈 Coverage report - raport pokrycia kodu

## ⚙️ Konfiguracja

### Opcjonalnie: Codecov

Aby włączyć raporty na Codecov:
1. Przejdź na https://codecov.io
2. Zaloguj się GitHub
3. Sync repo
4. Workflow automatycznie będzie wysyłać raporty

### Aby pominąć pre-commit hook

(Nie zalecane, ale możliwe):
```bash
git commit --no-verify
```

## 💡 Best Practices

- ✅ Zawsze uruchamiaj `npm test` przed commitem
- ✅ Nie omijaj pre-commit hooks bez powodu
- ✅ Czytaj komunikaty o błędach testów
- ✅ Dodawaj nowe testy do nowych funkcji
