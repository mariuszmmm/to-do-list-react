# Wytyczne UI/UX

- **Estetyka**: Każdy nowy element interfejsu musi wyglądać "premium". Używaj harmonijnych palet kolorów, cieni, zaokrąglonych krawędzi i nowoczesnej typografii.
- **Dynamiczność**: Dodawaj subtelne interakcje (hover effects, micro-animations), aby interfejs wydawał się responsywny i żywy.
- **Responsywność**: Każdy komponent musi być testowany pod kątem responsywności (od 300px wzwyż).
- **Spójność**: Nowe komponenty muszą pasować do istniejącego stylu wizualnego (sprawdź `src/theme/theme.ts` oraz istniejące ekrany w `src/features/`).
- **Zarządzanie kolorami i motywem**:
  - ZAWSZE używaj kolorów zdefiniowanych w `theme`.
  - Jeśli potrzebujesz koloru, którego nie ma w `theme`, zaproponuj nową nazwę oraz warianty dla jasnego i ciemnego motywu.
  - **ZAKAZ** dodawania czegokolwiek do `src/theme/theme.ts` bez wyraźnego pozwolenia użytkownika.
- **Realistyczne dane**: Unikaj placeholderów. Używaj narzędzi do generowania obrazów/ikon, jeśli są potrzebne do zaprezentowania funkcjonalności.
