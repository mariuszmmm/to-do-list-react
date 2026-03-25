# Konfiguracja transformacji obrazów w Cloudinary

## Przegląd

Aplikacja automatycznie optymalizuje wszystkie przesyłane zdjęcia poprzez transformacje konfigurowane w **Cloudinary Upload Preset**.

## ✅ Rozwiązanie: Upload Preset w Cloudinary Dashboard

Transformacje konfigurujemy **centralnie w Cloudinary**, nie w kodzie aplikacji.

---

## 📋 Instrukcja konfiguracji (3 minuty)

### 1. Zaloguj się do Cloudinary Dashboard

- Wejdź na: https://cloudinary.com/console
- Zaloguj się na swoje konto

### 2. Przejdź do Upload Presets

- W menu górnym: **Settings** (⚙️)
- W lewym menu: **Upload** → **Upload presets**
- Znajdź preset używany w aplikacji (nazwa z `.env`: `CLOUDINARY_UPLOAD_PRESET`)

### 3. Edytuj Upload Preset

- Kliknij na nazwę presetu lub **Edit**
- Przewiń do sekcji **Eager transformations** lub **Incoming transformation**

### 4. Dodaj transformacje

**Opcja A: Eager transformations** (zalecane - tworzy wiele wersji)

```
w_1920,h_1920,c_limit,q_auto:good,f_webp
```

**Opcja B: Incoming transformation** (transformuje oryginał)

```
w_1920,h_1920,c_limit,q_auto:good,f_webp
```

### 5. Zapisz zmiany

- Kliknij **Save** na dole strony

---

## 🎯 Parametry transformacji

| Parametr      | Wartość            | Opis                                       |
| ------------- | ------------------ | ------------------------------------------ |
| `w_1920`      | Szerokość 1920px   | Maksymalna szerokość                       |
| `h_1920`      | Wysokość 1920px    | Maksymalna wysokość                        |
| `c_limit`     | Crop: limit        | Nie powiększa, zachowuje proporcje         |
| `q_auto:good` | Quality: auto good | Automatyczna optymalizacja 60-80%          |
| `f_webp`      | Format: WebP       | Najlepsza kompresja (~30% taniej niż JPEG) |

---

## 📊 Efekt

### Przed transformacją:

- ❌ JPEG 4000x3000px, 4MB
- ❌ PNG 1920x1080px, 2MB
- ❌ Różne formaty i jakości

### Po transformacji:

- ✅ WebP 1920x1440px, ~400KB (**90% mniej**)
- ✅ WebP 1920x1080px, ~150KB (**92% mniej**)
- ✅ Ustandaryzowany format dla całej aplikacji

---

## 🔧 Alternatywne konfiguracje

### Bardziej agresywna kompresja (mobilne)

```
w_1280,h_1280,c_limit,q_auto:eco,f_webp
```

### Responsive (wiele rozmiarów)

```
w_1920,h_1920,c_limit,q_auto:good,f_webp|w_1280,h_1280,c_limit,q_auto:good,f_webp|w_640,h_640,c_limit,q_auto:good,f_webp
```

### Z usunięciem metadanych EXIF

```
w_1920,h_1920,c_limit,q_auto:good,f_webp,fl_strip_profile
```

---

## 🚀 Test działania

Po skonfigurowaniu Upload Preset:

1. Spróbuj przesłać zdjęcie w aplikacji
2. Sprawdź w Cloudinary Media Library:
   - Format powinien być: **WebP**
   - Wymiary: **max 1920x1920px**
   - Rozmiar: **znacznie zmniejszony**

---

## 📝 Uwagi techniczne

- Transformacje są wykonywane **po stronie serwera Cloudinary**
- Nie wymagają zmian w sygnaturze
- Są stosowane automatycznie do wszystkich uploadów używających tego presetu
- Konfiguracja jest **centralna** - jedna zmiana dla całej aplikacji
- Kod aplikacji pozostaje **czysty** i nie zawiera logiki transformacji

---

## 💡 Dodatkowe opcje Cloudinary

W Upload Preset możesz też skonfigurować:

- **Auto tagging** - automatyczne tagowanie zawartości
- **Background removal** - usuwanie tła z obrazów
- **Categorization** - kategoryzacja zawartości
- **Auto quality** - automatyczna jakość per urządzenie
- **Responsive breakpoints** - automatyczne generowanie wersji dla różnych ekranów

---

## 🔗 Dokumentacja

- [Cloudinary Upload Presets](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Eager Transformations](https://cloudinary.com/documentation/eager_transformations)
