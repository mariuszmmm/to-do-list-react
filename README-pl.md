<p align="right">
  🌍 <a href="README-pl.md">polski</a> ∙ <a href="README.md">English</a>
</p>

# Lista rzeczy do zrobienia
[**Wypróbuj teraz**](https://to-do-list-typescript-react.netlify.app/) i odkryj wszystkie możliwości aplikacji!  
<span style="color: grey;">(Uwaga: Stara wersja aplikacji znajduje się na branchu gh-pages, natomiast nowa wersja z dodatkowymi funkcjonalnościami została wdrożona na Netlify.)</span>

</br>

* [Prezentacja](#-prezentacja)
* [Opis](#-opis)
* [Technologie](#-technologie)
* [Konfiguracja](#-konfiguracja)
* [Widok aplikacji](#-widok-aplikacji)
* [Deployment](#-deployment)
* [Instrukcje użytkowania](#-instrukcje-użytkowania)

</br>

## 🎬 Prezentacja
![to-do list](images/presentation.gif)

<br>

## 📝 Opis
<b>Lista rzeczy do zrobienia</b> to aplikacja stworzona w oparciu o bibliotekę React z wykorzystaniem TypeScript. Wersja aplikacji została znacząco rozbudowana – oprócz klasycznych funkcji to-do list, wprowadzono szereg nowych usprawnień i możliwości:
* <b>Podstawowe funkcjonalności:</b>
   * Pobieranie przykładowych zadań <i>(gdy lista jest pusta)</i>,
   * Dodawanie nowych zadań,
   * Oznaczanie zadań jako ukończone,
   * Wyszukiwanie zadań z możliwością pokazania/ukrycia filtra oraz jego wyczyszczenia,
   * Wyświetlanie szczegółów zadania,
   * Usuwanie zadań,
   * Ukrywanie ukończonych zadań,
   * Oznaczanie wszystkich zadań jako ukończone oraz funkcja "Odznacz wszystkie".
* <b>Nowe funkcjonalności:</b>
   * <b>Obsługa TypeScript:</b> Aplikacja została przepisana na TypeScript dla lepszej kontroli typów i łatwiejszej konserwacji kodu.
   * <b>Zarządzanie kontem użytkownika:</b>
      * Rejestracja,
      * Logowanie,
      * Resetowanie i zmiana hasła,
      * Usuwanie konta.<br>
      
      <i>(Implementacja oparta o bibliotekę [netlify gotrue.js](https://github.com/netlify/gotrue-js) – mimo dostępności widżetu logowania Netlify Identity, zastosowano własne komponenty.)</i>
* <b>Strona List:</b></br>
Po zalogowaniu użytkownik ma dostęp do strony "Listy", gdzie wyświetlane są wszystkie zapisane listy pobierane z bazy danych MongoDB. Na tej stronie możliwe jest:
   * Podgląd zawartości wybranej listy,
   * Załadowanie zawartości listy do bieżącej listy zadań,
   * Usunięcie listy.
* <b>Zapisywanie listy do bazy danych:</b></br>
Po zalogowaniu użytkownik ma możliwość zapisania aktualnej listy zadań do bazy.
* <b>Edycja zadania:</b></br>
Umożliwiono edycję treści zadania (poprzez ikonę ołówka) oraz wprowadzono funkcje cofania/ponawiania zmian.

Aplikacja zapewnia przyjazny i intuicyjny interfejs, który wspiera zarządzanie zadaniami.

</br>

## 🛠 Technologie

<ul>
<li>TypeScript</li>
<li>JavaScript ES6+ Features</li>
<li>React & JSX</li>
<li>CSS Grid & CSS Flex</li>
<li>Normalize.css</li>
<li>Styled Components</li>
<li>Media Queries</li>
<li>Controlled Components</li>
<li>Redux, Redux Toolkit, Redux Saga, Redux Router</li>
</ul>

<br>

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
   MONGODB_URI=twoja_mongodb_uri
   MONGODB_DATABASE=twoja_baza_danych
   WEBHOOK_SECRET=twoj_webhook_secret
   REACT_APP_CONFIRMATION_URL="http://localhost:8888/#/user-confirmation"
   REACT_APP_RECOVERY_URL="http://localhost:8888/#/account-recovery"
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

## 🚀 Deployment
* <b>Stara wersja:</b></br>
Aktualnie starsza wersja aplikacji znajduje się na branchu <b>gh-pages</b> i jest dostępna pod adresem:</br>
https://mariuszmmm.github.io/to-do-list-react

* <b>Nowa wersja:</b></br>
Funkcjonalności wymagające komunikacji z bazą danych i zaawansowaną obsługą użytkownika zostały wdrożone przy użyciu <b>Netlify</b> – platforma oferująca obsługę funkcji serverless i uwierzytelnianie.

</br>

## 📄 Instrukcje użytkowania
<b>Pobieranie przykładowych zadań</b>
* Wybierz opcję <b>"Pobierz przykładowe zadania"</b> – zadania zostaną pobrane tylko wtedy, gdy bieżąca lista zadań jest pusta.

</br>

<b>Dodawanie zadania</b>
* Wprowadź nazwę zadania w polu tekstowym i kliknij <b>"Dodaj zadanie"</b> lub naciśnij klawisz <b>Enter</b>.

</br>

<b>Oznaczanie zadania jako ukończone</b>
* Kliknij pole wyboru obok zadania, aby je oznaczyć jako ukończone.

</br>

<b>Edycja zadania</b>
* Kliknij ikonę ołówka, aby edytować treść zadania.
* Skorzystaj z funkcji cofania/ponawiania zmian, jeśli potrzebujesz cofnąć lub przywrócić edycję.

</br>

<b>Wyszukiwanie zadań</b>
* Wpisz słowo lub frazę w pole wyszukiwania.
* Użyj funkcji <b>pokaż/ukryj</b> filtr lub <b>wyczyść filtr</b> dla lepszej kontroli wyników.

</br>

<b>Zarządzanie zadaniami</b>
* <b>Wyświetlanie szczegółów:</b> Kliknij zadanie, aby zobaczyć więcej informacji.
* <b>Usuwanie zadania:</b> Kliknij ikonę kosza przy zadaniu.
* <b>Ukończ wszystkie / Odznacz wszystkie:</b> Użyj opcji umożliwiających oznaczenie wszystkich zadań jako ukończone lub ich odznaczenie.

</br>

<b>Zarządzanie kontem użytkownika</b>
* Po zalogowaniu użytkownika uzyskasz dostęp do:
   * <b>Rejestracji, logowania, resetowania/zmiany hasła oraz usuwania konta.</b>
   * <b>Strony "Listy":</b> Przegląd zapisanych list, podgląd zawartości, ładowanie listy do bieżącej listy zadań lub jej usunięcie.
   * Możliwości zapisywania bieżącej listy do bazy danych.