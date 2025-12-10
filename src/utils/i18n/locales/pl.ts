const langPl = {
  navigation: {
    tasksPage: "Zadania",
    lists: "Listy",
    info: "Informacje",
  },
  listFrom: "Lista z dnia",
  currentList: "bieżąca",
  currentDate: { description: "Dziś jest " },
  currentTaskCount: {
    tasks: "{{count}}\u00A0zadanie",
    tasks_few: "{{count}}\u00A0zadania",
    tasks_many: "{{count}}\u00A0zadań",
    tasks_other: "{{count}}\u00A0zadań",
  },
  tasksPage: {
    title: "Lista zadań",
    form: {
      title: {
        addTask: "Dodaj nowe zadanie",
        editTask: "Edytuj zadanie",
      },
      buttons: {
        fetchExampleTasks: "Pobierz przykładowe zadania",
        loadFromArchive: "Wczytaj z archiwum",
        loading: "Ładowanie...",
        error: "Błąd ładowania danych",
      },
      inputPlaceholder: "Co jest do zrobienia ?",
      inputButton: {
        addTask: "Dodaj zadanie",
        saveChanges: "Zapisz",
        cancel: "Anuluj",
      },
    },
    search: {
      title: "Wyszukiwarka",
      buttons: {
        hide: "Ukryj filtr",
        show: "Pokaż filtr",
        clear: "Wyczyść filtr",
      },
      inputPlaceholder: "Filtruj zadania",
    },
    tasks: {
      defaultListName: "Nowa lista",
      inputPlaceholder: "Wpisz nazwę listy",
      buttons: {
        titleButtons: {
          change: "Zmień nazwę listy",
          save: "Zapisz",
        },
        save: "Zapisz listę",
        clear: "Wyczyść listę",
        hide: "Ukryj ukończone",
        show: "Pokaż ukończone",
        allDone: "Ukończ wszystkie",
        allUndone: "Odznacz wszystkie",
        sort: "Włącz sortowanie",
        notSort: "Wyłącz sortowanie",
        undo: "Cofnij",
        redo: "Ponów",
      },
    },
  },
  taskPage: {
    title: "Szczegóły zadania",
    noContent: "Nie znaleziono zadania 😥",
    done: {
      title: "Ukończone",
      yes: "Tak",
      no: "Nie",
    },
    dateCreated: "Data utworzenia",
    dateEdited: "Data modyfikacji",
    dateDone: "Data ukończenia",
  },
  archivedListsPage: {
    title: "Listy zarchiwizowane",
    lists: {
      select: "Wybierz listę",
      empty: "Nie masz zarchiwizowanych list 😯",
    },
    buttons: {
      load: "Załaduj wybraną listę",
    },
    subTitle: "Wybrana lista (podgląd)",
  },
  remoteListsPage: {
    title: "Moje listy",
    lists: {
      select: "Wybierz listę",
      empty: "Nie masz zdalnych list 😯",
    },
    buttons: {
      load: "Edytuj wybraną listę",
      sort: "Włącz sortowanie",
      notSort: "Wyłącz sortowanie",
    },
    subTitle: "Wybrana lista (podgląd)",
  },
  infoPage: {
    aboutApp: {
      title: "O aplikacji",
      topics: {
        features: {
          subTitle: "Kluczowe funkcje:",
          description: {
            part1:
              "<strong>Zarządzanie zadaniami</strong>: <br/>dodawanie, edycja, usuwanie, oznaczanie jako ukończone, cofanie i ponawianie zmian.",
            part2:
              "<strong>Wyszukiwanie i filtrowanie</strong>: <br/>możliwość przeszukiwania zadań z opcją ukrywania/pokazywania filtrów oraz ich czyszczenia.",
            part3:
              "<strong>Zarządzanie listami</strong>: <br/>tworzenie, zapisywanie i ładowanie list zadań z bazy danych MongoDB.",
            part4:
              "<strong>Obsługa wielu języków</strong>: <br/>interfejs dostępny w językach polskim, angielskim i niemieckim dzięki react-i18next.",
            part5:
              "<strong>Zarządzanie kontem użytkownika</strong>: <br/>rejestracja, logowanie, resetowanie i zmiana hasła, usuwanie konta za pomocą Netlify GoTrue.",
            part6:
              "<strong>Dodawanie zadań głosowo</strong>: <br/>możliwość wprowadzania treści zadań za pomocą rozpoznawania mowy (Web Speech API).",
          },
        },
        technologies: {
          subTitle: "Technologie:",
        },
        links: {
          subTitle: "Dostępne wersje:",
          description: {
            newApp: "Nowa wersja:",
            oldApp: "Starsza wersja:",
          },
        },
      },
    },
    aboutAuthor: {
      title: "O autorze",
      name: "Mariusz Matusiewicz",
      description: {
        part1:
          "Tworzenie frontendu to moja pasja, zwłaszcza z wykorzystaniem <strong>React</strong>. Uwielbiam zgłębiać nowe technologie i stale rozwijać swoje umiejętności. Największą satysfakcję daje mi projektowanie intuicyjnych i estetycznych interfejsów, które ułatwiają życie użytkownikom.",
        part2:
          "Poza programowaniem kocham góry. Wędrówki to dla mnie sposób na odpoczynek i naładowanie baterii. Szczególnie bliskie mojemu sercu są <strong>Bieszczady</strong> – ich spokój i naturalne piękno inspirują mnie za każdym razem, gdy tam wracam. Łączę zamiłowanie do technologii z ciekawością świata. Dzięki temu z entuzjazmem podejmuję nowe wyzwania, które pozwalają mi rozwijać się i tworzyć projekty, z których mogę być dumny. 😊🚀",
      },
      links: {
        subTitle: "Linki",
        description: {
          personalHomepage: "Strona osobista:",
          github: "GitHub:",
        },
      },
    },
    contactForm: {
      title: "Kontakt",
      subTitle: "Masz pytanie lub sugestię? ✉️ Napisz do mnie!",
    },
  },
  accountPage: {
    title: "Panel użytkownika",
    notLoggedIn: "Jesteś niezalogowany",
    buttons: {
      register: "Rejestracja",
      login: "Logowanie",
      accountDelete: "Usuń konto",
      passwordChange: "Zmień hasło",
      resetPassword: "Zresetuj hasło",
      cancel: "Anuluj",
    },
    deviceCount: {
      device: "Jesteś zalogowany na {{count}} urządzeniu",
      device_few: "Jesteś zalogowany na {{count}} urządzeniach",
      device_many: "Jesteś zalogowany na {{count}} urządzeniach",
      device_other: "Jesteś zalogowany na {{count}} urządzeniach",
    },
    userDeviceCount: {
      device: "zalogowany na {{count}} urządzeniu",
      device_few: "zalogowany na {{count}} urządzeniach",
      device_many: "zalogowany na {{count}} urządzeniach",
      device_other: "zalogowany na {{count}} urządzeniach",
    },
    activeUsers: {
      label: "Zalogowani użytkownicy",
      summaryTitle: "Aktywność użytkowników",
      count: "Ilość aktywnych użytkowników: {{count}}",
      count_few: "Ilość aktywnych użytkowników: {{count}}",
      count_many: "Ilość aktywnych użytkowników: {{count}}",
      count_other: "Ilość aktywnych użytkowników: {{count}}",
    },
    allDevices: {
      device: "Ilość wszystkich aktywnych urządzeń: {{count}}",
      device_few: "Ilość wszystkich aktywnych urządzeń: {{count}}",
      device_many: "Ilość wszystkich aktywnych urządzeń: {{count}}",
      device_other: "Ilość wszystkich aktywnych urządzeń: {{count}}",
    },
    form: {
      buttons: {
        login: "Zaloguj",
        logout: "Wyloguj",
        register: "Zarejestruj",
        save: "Zapisz",
        reset: "Zresetuj hasło",
      },
      inputPlaceholders: {
        email: "wpisz adres e-mail",
        password: "wpisz hasło",
        newPassword: "nowe hasło",
      },
      message: {
        email: "wpisz adres e-mail",
        emailMessage: "nieprawidłowy adres e-mail",
        password: "wpisz hasło",
        passwordMessage: "hasło musi mieć co najmniej 4 znaki.",
      },
    },
    sessionInfo: {
      title: "Informacje o sesji",
      createdAt: "Konto utworzone",
      confirmedAt: "Email potwierdzony",
      tokenTitle: "Token autentykacji",
      tokenExpiresAt: "Token wygasa",
      tokenExpiresIn: "Token wygasa za",
      tokenStatus: "Status tokena",
      tokenActive: "Token jest aktywny",
      tokenExpired: "Token wygasł",
    },
    autoRefresh: {
      label: "Automatyczne odświeżanie tokena",
      enabledDescription:
        "Token będzie automatycznie odświeżany po wygaśnięciu",
      disabledDescription: "Zostaniesz wylogowany po wygaśnięciu tokena",
    },
    backup: {
      title: "Kopia zapasowa i przywracanie",
      processingAuthorization: "Przetwarzanie autoryzacji...",
      googleDriveAuthSuccess: "Autoryzacja Google Drive zakończona sukcesem!",
      restoreFromComputer: "Przywróć z pliku na komputerze",
      restoreFromComputerTooltip:
        "Wczytaj kopię zapasową z pliku JSON na komputerze",
      download: "Pobierz kopię zapasową",
      downloading: "Pobieranie kopii zapasowej...",
      downloadTooltip: "Pobierz kopię zapasową na komputer",
      downloadSuccess: "Kopia zapasowa pobrana pomyślnie!",
      downloadError: "Błąd podczas pobierania kopii zapasowej",
      upload: "Prześlij na Google Drive",
      uploadTooltip: "Prześlij kopię zapasową na Google Drive",
      uploadSuccess: "Kopia zapasowa przesłana na Google Drive pomyślnie!",
      uploadError: "Błąd podczas przesyłania kopii zapasowej",
      restore: "Przywróć z Google Drive",
      restoreTooltip: "Przywróć dane z kopii zapasowej Google Drive",
      restoreSuccess:
        "Kopia zapasowa przywrócona pomyślnie! Przywrócono {{count}} list.",
      restoreError: "Błąd podczas przywracania kopii zapasowej",
      authorizeGoogle: "Autoryzuj Google",
      authorizeGoogleTooltip: "Autoryzuj dostęp do Google Drive",
      processing: "Przetwarzanie...",
      authSuccess: "Autoryzacja pomyślna!",
      authError: "Błąd autoryzacji",
      uploading: "Przesyłanie kopii zapasowej na Google Drive...",
      restoring: "Przywracanie kopii zapasowej z Google Drive...",
      notAuthorized: "Brak autoryzacji do Google Drive",
      configError: "Brakuje konfiguracji Google Drive",
      savingError: "Błąd podczas zapisywania kopii zapasowej",
      enterFileId: "Wpisz ID pliku Google Drive:",
      cancelled: "Przywracanie anulowane",
      selectBackup: "Wybierz kopię do przywrócenia",
      noBackups: "Brak kopii zapasowych na Google Drive",
      prev: "Wstecz",
      next: "Dalej",
      cancel: "Anuluj",
      deleteBackup: {
        deleting: "Usuwanie kopii zapasowej",
        success: "Kopia zapasowa usunięta pomyślnie!",
        error: "Błąd podczas usuwania kopii zapasowej",
        tooltip: "Usuń tę kopię zapasową",
        confirm: "Czy na pewno chcesz usunąć kopię zapasową '{{name}}'?",
      },
    },
    toggle: {
      show: "Rozwiń sekcję",
      hide: "Zwiń sekcję",
    },
  },
  confirmationPage: {
    message: {
      success:
        "Rejestracja udana.<br/> Możesz wrócić do wcześniej otwartej karty.",
      error: "Rejestracja nieudana.",
    },
    closeTab:
      "Możesz teraz zamknąć tę kartę i wrócić do wcześniej otwartej przegladarki.",
    tryAgain: "Spróbuj ponownie później.",
    home: "Strona główna",
  },
  accountRecoveryPage: {
    title: "Zmiana hasła",
    subTitle: "Wpisz nowe hasło",
    message: {
      success:
        "Konto zostało odzyskane.<br/> Możesz wrócić do wcześniej otwartej karty.",
      error: "Link wygasł lub został użyty.",
    },
    closeTab:
      "Możesz teraz zamknąć tę kartę i wrócić do wcześniej otwartej przegladarki.",
    tryAgain: "Spróbuj ponownie później.",
    home: "Strona główna",
  },
  modal: {
    buttons: {
      confirmButton: "Potwierdź",
      cancelButton: "Anuluj",
      deleteButton: "Usuń",
      closeButton: "Zamknij",
      logoutButton: "Wyloguj",
      nextButton: "Dalej",
      refreshButton: "Odśwież",
      replaceButton: "Zastąp",
      addButton: "Dodaj",
      yesButton: "Tak",
      noButton: "Nie",
    },
    login: {
      title: "Logowanie",
      message: {
        loading: "Trwa logowanie...",
        success: "Zalogowano jako: <strong>{{user}}</strong>",
        error: {
          default: "Błąd logowania",
        },
      },
    },
    logout: {
      title: "Wylogowanie",
      message: {
        confirm: "Czy na pewno chcesz się wylogować?",
        loading: "Trwa wylogowywanie...",
        success: "Zostałeś wylogowany.",
        error: {
          default: "Błąd wylogowania.",
        },
      },
    },
    passwordChange: {
      title: "Zmiana hasła",
      message: {
        loading: "Trwa zmiana hasła...",
        success: "Hasło zostało zmienione.",
        error: {
          default: "Błąd podczas zmiany hasła.",
        },
      },
    },
    accountRegister: {
      title: "Rejestracja konta",
      message: {
        loading: "Trwa rejestracja...",
        info: "Na podany adres e-mail został wysłany link do rejestracji konta.",
        error: {
          userExists:
            "Użytkownik z tym adresem e-mail jest już zarejestrowany.",
          default: "Błąd rejestracji",
        },
      },
    },
    accountRecovery: {
      title: "Odzyskiwanie konta",
      message: {
        loading: "Trwa odzyskiwanie konta...",
        info: "Na podany adres e-mail został wysłany link do zresetowania hasła.<br/> Jeśli nie otrzymałeś wiadomości, spróbuj ponownie za 15 minut.",
        success: "Konto zostało odzyskane, ustaw nowe hasło.",
        error: {
          default: "Błąd odzyskiwania hasła.",
          linkExpired: "Link wygasł lub został użyty.",
        },
      },
    },
    accountDelete: {
      title: "Usuwanie konta",
      message: {
        confirm: "Czy na pewno chcesz usunąć swoje konto?",
        loading: "Trwa usuwanie konta...",
        success: "Konto zostało usunięte.",
        error: {
          default: "Błąd podczas usuwania konta.",
        },
      },
    },
    dataRemoval: {
      title: "Czyszczenie danych",
      message: {
        confirm: "Czy chcesz usunąć wszystkie dane z aplikacji?",
        info: "Wszystkie dane zostały usunięte.",
      },
    },
    listsDownload: {
      title: "Pobieranie list",
      message: {
        loading: "Trwa pobieranie list...",
        success: "Listy zostały pobrane.",
        error: {
          default: "Wystąpił błąd podczas pobierania list.",
        },
      },
    },
    listSave: {
      title: "Zapisywanie listy",
      message: {
        confirm:
          "Lista o nazwie <strong>{{name}}</strong> już isnieje w bazie danych.<br/> Czy chcesz ją zastąpić?",
        cancel: "Zmień nazwę listy i zapisz ponownie.",
        loading:
          "Zapisywanie listy <strong>{{name}}</strong> w bazie danych...",
        success:
          "Lista <strong>{{name}}</strong> została zapisana w bazie danych.",
        error: {
          conflict:
            "Operacja nie mogła być wykonana poprawnie, ponieważ listy były nieaktualne.<br/> Spróbuj ponownie.",
          default: "Wystąpił błąd podczas dodawania listy do bazy danych.",
        },
      },
    },
    archiveTasks: {
      title: "Archiwizowanie zadań",
      message: {
        confirm: "Czy przenieść bieżące zadania do archiwum?",
      },
    },
    listRemove: {
      title: "Usuwanie listy",
      message: {
        confirm:
          "Czy na pewno chcesz usunąć listę: <strong>{{name}}</strong> ?",
        loading: "Trwa usuwanie listy...",
        success: "Lista została usunięta z bazy danych.",
        error: {
          conflict:
            "Operacja nie mogła być wykonana poprawnie, ponieważ listy były nieaktualne.<br/> Spróbuj ponownie.",
          default: "Wystąpił błąd podczas usuwania listy.",
        },
      },
    },
    deleteBackup: {
      title: "Usuwanie kopii zapasowej",
      message: {
        confirm:
          "Czy na pewno chcesz usunąć kopię zapasową: <strong>{{name}}</strong> ?",
        loading: "Trwa usuwanie kopii zapasowej...",
        success: "Kopia zapasowa została usunięta.",
        error: {
          default: "Błąd podczas usuwania kopii zapasowej.",
        },
      },
    },
    listsUpdate: {
      title: "Aktualizacja list",
      message: {
        loading: "Trwa aktualizacja list...",
        success: "Listy zostały zaktualizowane.",
        error: {
          conflict:
            "Operacja nie mogła być wykonana poprawnie, ponieważ listy były nieaktualne.<br/> Spróbuj ponownie.",
          default: "Wystąpił błąd podczas aktualizacji list.",
        },
      },
    },
    listLoad: {
      title: "Ładowanie listy",
      message: {
        confirm: "Czy checesz dodać zadania do bieżącej listy?",
        info: "Lista <strong>{{name}}</strong> została załadowana.",
      },
    },
    confirmation: {
      title: "Potwierdzenie rejestracji",
      message: {
        loading: "Sprawdzam stan rejestracji...",
        success: "Rejestracja udana, zamknij stronę.",
        error: {
          default: "Link wygasł lub został użyty.",
        },
      },
    },
    sendMessage: {
      title: "Wysłanie wiadomości",
      labels: {
        email: "Adres e-mail:",
        message: "Wiadomość:",
      },
      placeholders: {
        email: "Wpisz adres e-mail",
        message: "Wpisz wiadomość",
      },
      message: {
        loading: "Trwa wysyłanie wiadomości...",
        success: "Wiadomość została wysłana.",
        error: {
          default: "Błąd podczas wysyłania wiadomości.",
        },
      },
      button: "Wyślij",
    },
  },
  prepareText: {
    period: "kropka",
    comma: "przecinek",
  },
};

export default langPl;
