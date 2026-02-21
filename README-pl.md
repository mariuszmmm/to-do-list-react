<p align="right">
  🌍 <a href="README-pl.md">polski</a> ∙ <a href="README.md">English</a>
</p>

# Lista rzeczy do zrobienia

[**Wypróbuj teraz**](https://to-do-list-typescript-react.netlify.app/) i odkryj wszystkie możliwości aplikacji!

</br>

- [Prezentacja](#-prezentacja)
- [Deployment](#-deployment)
- [Technologie](#-technologie)
- [Opis](#-opis)
- [Konfiguracja](#-konfiguracja)
- [Widok aplikacji](#-widok-aplikacji)
- [Instrukcje użytkowania](#-instrukcje-użytkowania)
- [Dyktowanie zadań](#-dyktowanie-zadań)
- [Formularz kontaktowy](#-formularz-kontaktowy)

</br>

## 🎬 Prezentacja

![to-do list](images/presentation.gif)

<br>

## 🚀 Deployment

- [**Nowa wersja :**](https://to-do-list-typescript-react.netlify.app/)</br>
  Funkcjonalności wymagające komunikacji z bazą danych i obsługą użytkownika zostały wdrożone za pomocą <b>Netlify</b> – platformy oferującej obsługę funkcji <b>serverless</b> i <b>uwierzytelnianie</b>. Dzięki <b>Netlify GoTrue</b> aplikacja umożliwia zarządzanie kontem użytkownika, w tym rejestrację, logowanie, resetowanie i zmianę hasła oraz usuwanie konta. Dodatkowo, aplikacja umożliwia przechowywanie list zadań w bazie danych <b>MongoDB</b>, co pozwala na ich późniejsze pobieranie, edytowanie oraz zapisywanie.
  Aplikacja wspiera tłumaczenie całej strony na trzy języki: <b>polski (pl)</b>, <b>angielski (en)</b> i <b>niemiecki (de)</b> dzięki zastosowaniu <b>react-i18next</b>. Zostały również wdrożone nowe funkcje, takie jak dynamiczne tłumaczenie komunikatów błędów za pomocą <b>Cloud Translation API</b>, które zapewniają, że komunikaty serwera będą tłumaczone na bieżąco w zależności od wybranego języka użytkownika.
  Nowością jest także przejście na <b>TanStack Query</b> (dawniej <b>React Query</b>) do obsługi zapytań i mutacji w aplikacji, co znacząco upraszcza zarządzanie stanem i operacjami asynchronicznymi. Cała aplikacja została również dostosowana do pracy z <b>TypeScript</b>, co poprawia stabilność kodu i ułatwia jego utrzymanie.<br/>https://to-do-list-typescript-react.netlify.app

- [**Wersja podstawowa :**](https://mariuszmmm.github.io/to-do-list-react)</br>
  Aktualnie podstawowa wersja aplikacji znajduje się na branchu <b>gh-pages</b> i jest dostępna pod adresem:</br>https://mariuszmmm.github.io/to-do-list-react

</br>

## 🛠 Technologie

<ul>
<li>TypeScript, JavaScript (ES6+)</li>
<li>React & JSX, React Router</li>
<li>Redux, Redux Toolkit, Redux Saga</li>
<li>TanStack Query (react-query)</li>
<li>react-i18next, Cloud Translation API</li>
<li>Netlify GoTrue.js</li>
<li>MongoDB</li>
<li>EmailJS</li>
<li>Cloudinary (Zarządzanie obrazami)</li>
<li>Ably (Synchronizacja w czasie rzeczywistym)</li>
<li>@dnd-kit (Przeciągnij i upuść)</li>
<li>Normalize.css, Styled Components</li>
<li>CSS Grid & Flexbox, Media Queries</li>
<li>Controlled Components</li>
</ul>

<br>

## 📝 Opis

<b>Lista rzeczy do zrobienia</b> to aplikacja stworzona w oparciu o bibliotekę React z wykorzystaniem TypeScript. Wersja aplikacji została znacząco rozbudowana – oprócz klasycznych funkcji to-do list, wprowadzono szereg nowych usprawnień i możliwości:

- <b>Podstawowe funkcjonalności:</b>
  - Pobieranie przykładowych zadań <i>(gdy lista jest pusta)</i>,
  - Dodawanie nowych zadań,
  - Oznaczanie zadań jako ukończone,
  - Wyszukiwanie zadań z możliwością pokazania/ukrycia filtra oraz jego wyczyszczenia,
  - Wyświetlanie szczegółów zadania,
  - Usuwanie zadań,
  - Ukrywanie ukończonych zadań,
  - Oznaczanie wszystkich zadań jako ukończone oraz funkcja "Odznacz wszystkie".
  - Sortowanie zadań.
- <b>Nowe funkcjonalności:</b>
  - <b>Obsługa TypeScript:</b> Aplikacja została przepisana na TypeScript dla lepszej kontroli typów i utrzymania kodu.
  - <b>TanStack Query:</b> Zastąpienie ręcznego fetching’u (Redux Saga) hookami useQuery do pobierania przykładowych zadań i list oraz useMutation do obsługi mutacji list i operacji związanych z użytkownikiem.
  - <b>react-i18next:</b> Tłumaczenie całej aplikacji na języki pl, en, de.
  - <b>Dynamiczne tłumaczenie błędów:</b> Komunikaty błędów zwracane z serwera są tłumaczone w locie przy pomocy Cloud Translation API.
  - <b>Uproszczone zarządzanie stanem:</b> Redux i Saga pozostawione wyłącznie do stanów globalnych aplikacji; logika pobierania i mutacji przeniesiona do TanStack Query.
  - <b>Zarządzanie kontem użytkownika:</b>
    <i>(Implementacja oparta o bibliotekę [Netlify GoTrue](https://github.com/netlify/gotrue-js) z własnymi komponentami UI.)</i>
    - Rejestracja,
    - Logowanie,
    - Resetowanie i zmiana hasła,
    - Usuwanie konta.<br>
  - <b>Dyktowanie zadań:</b> Możliwość wprowadzania treści zadania za pomocą rozpoznawania mowy (Web Speech API).
  - <b>Załączniki do zadań:</b> Możliwość dodawania zdjęć do zadań (obsługiwane przez <b>Cloudinary</b>).
  - <b>Przeciągnij i Upuść (Drag & Drop):</b> Intuicyjne sortowanie zadań i list poprzez przeciąganie (obsługiwane przez <b>@dnd-kit</b>).
  - <b>Synchronizacja w czasie rzeczywistym:</b> Natychmiastowe aktualizacje na różnych urządzeniach dzięki <b>Ably</b>.
  - <b>Archiwizacja list:</b> Możliwość archiwizowania list w celu utrzymania porządku bez utraty danych.
- <b>Strona List:</b></br>
  Po zalogowaniu użytkownik ma dostęp do strony "Listy", gdzie wyświetlane są wszystkie zapisane listy pobierane z bazy danych MongoDB. Na tej stronie możliwe jest:
  - Podgląd zawartości wybranej listy,
  - Załadowanie zawartości listy do bieżącej listy zadań,
  - Sortowanie listy,
  - Usunięcie listy.
- <b>Zapisywanie listy do bazy danych:</b></br>
  Po zalogowaniu użytkownik ma możliwość zapisania aktualnej listy zadań do bazy.
- <b>Edycja zadania:</b></br>
  Umożliwiono edycję treści zadania (poprzez ikonę ołówka) oraz wprowadzono funkcje cofania/ponawiania zmian.

Aplikacja zapewnia przyjazny i intuicyjny interfejs, który wspiera zarządzanie zadaniami.

</br>

## ⚙ Konfiguracja

Aby uruchomić aplikację to-do-list-react lokalnie, wykonaj poniższe kroki:

1. <b>Pobranie kodu źródłowego:</b><br>
   Sklonuj repozytorium z GitHub:

```commandline
     git clone https://github.com/mariuszmmm/to-do-list-react.git
```

2. <b>Instalacja zależności:</b><br>
   Przejdź do katalogu projektu i zainstaluj wszystkie zależności:

```commandline
    cd to-do-list-react
    npm install
```

3. <b>Konfiguracja środowiska:</b><br>
   Utwórz plik .env w katalogu głównym projektu i zdefiniuj zmienne środowiskowe:

```commandline
    ABLY_API_KEY="your_ably_api_key_here"

    GOOGLE_DRIVE_CLIENT_ID="your_google_drive_client_id_here"
    GOOGLE_DRIVE_CLIENT_SECRET="your_google_drive_client_secret_here"
    GOOGLE_DRIVE_REDIRECT_URI="https://your-netlify-app.netlify.app/"

    MONGODB_DATABASE="your_mongodb_database_name"
    MONGODB_URI="your_mongodb_connection_string"

    REACT_APP_ABLY_API_KEY="your_ably_api_key_for_react_here"
    REACT_APP_CONFIRMATION_URL="https://your-netlify-app.netlify.app/#/user-confirmation"
    REACT_APP_EMAILJS_PUBLIC_KEY="your_emailjs_public_key_here"
    REACT_APP_EMAILJS_SERVICE_ID="your_emailjs_service_id_here"
    REACT_APP_EMAILJS_TEMPLATE_ID="your_emailjs_template_id_here"
    REACT_APP_GOOGLE_DRIVE_CLIENT_ID="your_google_drive_client_id_here"
    REACT_APP_GOOGLE_DRIVE_REDIRECT_URI="https://your-netlify-app.netlify.app/"
    REACT_APP_NETLIFY_IDENTITY_URL="https://your-netlify-app.netlify.app/.netlify/identity"
    REACT_APP_RECOVERY_URL="https://your-netlify-app.netlify.app/#/account-recovery"

    TRANSLATION_API_KEY="your_google_translation_api_key_here"
    TRANSLATION_API_URL="https://translation.googleapis.com/language/translate/v2"

    WEBHOOK_SECRET="your_webhook_secret_here"

    CLOUDINARY_API_SECRET="your_cloudinary_api_secret_here"
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name_here"
    CLOUDINARY_API_KEY="your_cloudinary_api_key_here"
    CLOUDINARY_UPLOAD_PRESET="your_unsigned_upload_preset_here"
```

4. <b>Uruchomienie aplikacji:</b><br>
   Po zainstalowaniu zależności uruchom aplikację w trybie deweloperskim:

```commandline
    npm start
```

Aplikacja uruchomi się pod adresem http://localhost:8888.

<br>

## 🖥 Widok aplikacji

Aplikacja jest w pełni responsywna, co oznacza, że dostosowuje się do różnych urządzeń (smartfony, tablety, komputery).
Przykładowe widoki:

- <b>320x568</b> <i>(Podstawowy widok na telefonie)</i>  
  ![to-do list](images/size_1.gif)

- <b>600x960</b> <i>(Widok na tablecie)</i>  
  ![to-do list](images/size_2.gif)

</br>

## 📄 Instrukcje użytkowania

<b>Pobieranie przykładowych zadań</b>

- Wybierz opcję <b>"Pobierz przykładowe zadania"</b> – zadania zostaną pobrane tylko wtedy, gdy bieżąca lista zadań jest pusta.

</br>

<b>Dodawanie zadania</b>

- Wprowadź nazwę zadania w polu tekstowym i kliknij <b>"Dodaj zadanie"</b> lub naciśnij klawisz <b>Enter</b>.
- Kliknij <b>ikonę obrazka</b>, aby dodać załącznik do zadania.

</br>

<b>Oznaczanie zadania jako ukończone</b>

- Kliknij pole wyboru obok zadania, aby je oznaczyć jako ukończone.

</br>

<b>Edycja zadania</b>

- Kliknij ikonę ołówka, aby edytować treść zadania.
- Skorzystaj z funkcji cofania/ponawiania zmian, jeśli potrzebujesz cofnąć lub przywrócić edycję.

</br>

<b>Dodawanie zdjęć do zadań</b> (dostępne dla zalogowanych użytkowników)

- Kliknij ikonę obrazka, aby dodać zdjęcie do zadania.
- Możesz dodać jedno zdjęcie z dysku komputera lub zrobić zdjęcie aparatem.

</br>

<b>Wyszukiwanie zadań</b>

- Wpisz słowo lub frazę w pole wyszukiwania.
- Użyj funkcji <b>Pokaż/Ukryj</b> filtr lub <b>Wyczyść filtr</b> dla lepszej kontroli wyników.

</br>

<b>Zarządzanie zadaniami</b>

- <b>Wyświetlanie szczegółów:</b> Kliknij zadanie, aby wyświetlić jego szczegółowe informacje.
- <b>Usuwanie zadania:</b> Kliknij ikonę kosza przy zadaniu, aby je usunąć.
- <b>Ukończ wszystkie / Odznacz wszystkie:</b> Pozwala na oznaczenie wszystkich zadań jako ukończone lub ich odznaczenie.
- <b>Włącz/Wyłącz sortowanie:</b> Przełącza tryb sortowania. W widoku listy pojawią się przyciski umożliwiające przesuwanie zadań w górę i w dół lub możesz je przeciągać (Drag & Drop).

</br>

<b>Cofanie i ponawianie zmian</b>

- Kliknij przycisk <b>"↺"</b> – ostatnia operacja na liście zadań zostanie wycofana.
- Kliknij przycisk <b>"↻"</b> – cofnięta operacja zostanie przywrócona.
  </br>
  Przyciski są aktywne tylko wtedy, gdy możliwe jest cofnięcie lub ponowienie ostatniej operacji.

</br>

<b>Zapisywanie listy zadań</b> (dostępne dla zalogowanych użytkowników)

- Wybierz opcję <b>"Zapisz listę"</b> – lista zadań zostanie zapisana w bazie danych.

</br>

<b>Zarządzanie kontem użytkownika</b>

- Po zalogowaniu użytkownik uzyskuje dostęp do:
  - <b>Zmiany hasła, usuwania konta oraz innych funkcji konta.</b>
  - <b>Strony "Listy":</b> Przegląd zapisanych list, podgląd zawartości, ładowanie listy do bieżącej listy zadań lub jej usunięcie.
  - <b>Możliwości zapisywania bieżącej listy do bazy danych.</b>
  - <b>Możliwość dodawania zdjęć do zadań</b>

</br>

## 🎤 Dyktowanie zadań

Aplikacja umożliwia dyktowanie przy dodawaniu oraz edytowaniu zadań za pomocą rozpoznawania mowy. Funkcjonalność ta wykorzystuje Web Speech API i jest dostępna w formularzu dodawania/edycji zadania.

</br>

**Jak to działa?**

- Obok pola tekstowego znajduje się przycisk z ikoną mikrofonu.
- Kliknij mikrofon, aby rozpocząć nasłuchiwanie – możesz podyktować treść zadania.
- Rozpoznany tekst pojawia się automatycznie w polu tekstowym.
- Ponowne kliknięcie mikrofonu kończy nasłuchiwanie.
- Jeśli Twoja przeglądarka nie obsługuje rozpoznawania mowy, przycisk mikrofonu będzie nieaktywny.

</br>

**Dodatkowe informacje:**

- Obsługiwane są różne języki – aplikacja automatycznie dostosowuje język rozpoznawania do wybranego języka interfejsu.
- W trybie edycji zadania, rozpoznawanie mowy kontynuuje istniejącą treść.
- Wspierane są wyniki pośrednie (interim results), dzięki czemu tekst pojawia się na bieżąco podczas mówienia (jeśli przeglądarka to umożliwia).

</br>

## 📬 Formularz kontaktowy

Aplikacja zawiera formularz kontaktowy, który umożliwia użytkownikom wysyłanie wiadomości bezpośrednio do autora. Formularz jest zintegrowany z [EmailJS](https://www.emailjs.com/docs/examples/reactjs/), co pozwala na wysyłanie e-maili bez potrzeby posiadania backendowego serwera.
