# Podsumowanie zmian - System Rules & Knowledge

Zgodnie z Twoją prośbą, stworzyłem od podstaw nową strukturę zasad i wiedzy o projekcie. Zamiast pojedynczych plików, system jest teraz podzielony na logiczne kategorie, co ułatwia zarządzanie i rozbudowę.

## 1. Zasady (Rules)

Znajdują się w folderze `.agent/rules/`. Zostały podzielone na:

- `general.md`: Zasady dotyczące języka, komunikacji i sposobu pracy.
- `coding.md`: Standardy techniczne (React, TS, Styled Components).
- `ui_ux.md`: Wytyczne wizualne i estetyczne (styl premium, animacje).

## 2. Wiedza (Knowledge)

Znajduje się w folderze `.agent/knowledge/`. Zawiera kompendium wiedzy o projekcie:

- `tech_stack.md`: Dokładny spis technologii (Frontend, Backend, Integracje).
- `architecture.md`: Opis struktury folderów, wzorców projektowych i zarządzania stanem.

## 3. Konfiguracja Cursora

Plik `.cursorrules` został uproszczony i zaktualizowany. Pełni teraz rolę "skrótu" do najważniejszych zasad, odsyłając agenta do folderu `.agent/rules/`.

## 4. Notes.md

Zasady w `notes.md` pozostają aktualne - system będzie się nimi kierował przy decydowaniu, gdzie zapisać nową wiedzę lub zasady.

### Jak z tego korzystać?

- **Dodawanie nowych zasad**: Jeśli chcesz coś zmienić w sposobie mojej pracy, edytuj odpowiedni plik w `.agent/rules/`.
- **Rozszerzanie wiedzy**: Gdy nauczymy się czegoś nowego o specyfice projektu (np. "ten endpoint zwraca dane w tym formacie"), zapiszemy to w `.agent/knowledge/`.
- **Zadania**: Każde zadanie będę zaczynał od odświeżenia tych zasad.

---

System jest gotowy i w pełni funkcjonalny. Czy chcesz dodać jakąś konkretną zasadę lub informację techniczną na start?
