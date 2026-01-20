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
        loadFromArchive: "Pobierz z archiwum",
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
    dateEdited: "Data edycji",
    dateDone: "Data ukończenia",
    backButton: "Powrót",
  },
  taskImagePage: {
    title: "Zdjęcie zadania",
    noTask: "Nie znaleziono zadania 😥",
    messages: {
      uploading: "Przesyłanie…",
      loading: "Ładowanie…",
      removing: "Usuwanie…",
      uploadError: "Wystąpił błąd podczas przesyłania obrazu.",
      loadError: "Błąd ładowania zdjęcia.",
      choosePhotoSource: "Wybierz zrodło obrazu:",
    },
    buttons: {
      add: "Dodaj",
      change: "Zmień",
      remove: "Usuń",
      back: "Powrót",
      addFromGallery: "Z galerii",
      takePhoto: "Z aparatu",
      cancel: "Anuluj",
    },
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
    toggleButtons: {
      show: "Rozwiń sekcję",
      hide: "Zwiń sekcję",
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
        email: "Wpisz adres e-mail",
        password: "Wpisz hasło",
        newPassword: "Nowe hasło",
      },
      message: {
        email: "Wpisz adres e-mail",
        emailMessage: "Nieprawidłowy adres e-mail",
        password: "Wpisz hasło",
        passwordMessage: "Hasło musi mieć co najmniej 4 znaki.",
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
      label: "Pozostań zalogowany",
      enabledDescription: "Token będzie automatycznie odświeżany",
      disabledDescription: "Zostaniesz wylogowany po wygaśnięciu tokena",
    },
    backup: {
      title: "Kopia zapasowa i przywracanie",
      downloadUserLists: {
        button: "Pobierz moje listy",
        tooltip: "Pobierz tylko swoje listy na komputer",
        downloading: "Pobieranie Twoich list...",
        success: "Twoje listy zostały pobrane!",
        error: "Błąd podczas pobierania Twoich list",
      },
      downloadAllUsers: {
        button: "Pobierz wszystkich użytkowników",
        tooltip: "Pobierz listy wszystkich użytkowników na komputer",
        downloading: "Pobieranie wszystkich list użytkowników...",
        success: "Listy wszystkich użytkowników zostały pobrane!",
        error: "Błąd podczas pobierania list wszystkich użytkowników",
      },
      restoreUserLists: {
        button: "Przywróć moje listy",
        tooltip: "Przywróć tylko swoje listy z pliku na komputerze",
        processing: "Przetwarzanie Twoich list...",
        success:
          "Kopia zapasowa została przywrócona!\nPrzywrócono {{count}} list.",
        success_few:
          "Kopia zapasowa została przywrócona!\nPrzywrócono {{count}} listy.",
        success_many:
          "Kopia zapasowa została przywrócona!\nPrzywrócono {{count}} list.",
        success_other:
          "Kopia zapasowa została przywrócona!\nPrzywrócono {{count}} list.",
        error: "Błąd podczas przywracania Twoich list",
      },
      restoreAllUsers: {
        button: "Przywróć wszystkich użytkowników",
        tooltip: "Przywróć wszystkich użytkowników z kopii zapasowej",
        processing: "Przetwarzanie...",
        success:
          "Kopia zapasowa została przywrócona!\nPrzywrócono: {{restored}}/{{total}} użytkowników.\nNieudanych: {{failed}}.",
        error: "Błąd podczas przywracania wszystkich użytkowników",
      },
      authorizeGoogle: {
        button: "Autoryzuj Google",
        tooltip: "Autoryzuj dostęp do Google Drive",
        processing: "Przetwarzanie autoryzacji...",
        success: "Autoryzacja Google Drive zakończona sukcesem!",
        error: "Błąd podczas autoryzacji Google Drive",
      },
      uploadAllUsersToGoogleDrive: {
        button: "Prześlij na Google Drive",
        tooltip: "Prześlij kopię zapasową na Google Drive",
        uploading: "Przesyłanie kopii zapasowej na Google Drive...",
        success: "Kopia zapasowa przesłana na Google Drive pomyślnie!",
        error: "Błąd podczas przesyłania kopii zapasowej",
        notAuthorized: "Brak autoryzacji do Google Drive",
      },
      restoreBackupFromGoogleDrive: {
        button: "Przywróć z Google Drive",
        tooltip: "Przywróć kopię zapasową z Google Drive",
        restoring: "Przywracanie kopii zapasowej z Google Drive...",
        success:
          "Kopia zapasowa została przywrócona! Przywrócono {{count}} list.",
        error: "Błąd podczas przywracania kopii zapasowej",
        notAuthorized: "Brak autoryzacji do Google Drive",
      },
      listGoogleDriveBackups: {
        selectBackup: "Wybierz kopię do przywrócenia",
        buttons: {
          prev: "Wstecz",
          next: "Dalej",
          cancel: "Anuluj",
        },
        tooltips: {
          restore: "Przywróć kopię zapasową",
          delete: "Usuń kopię zapasową z Google Drive",
        },
        error: "Błąd podczas pobierania listy kopii zapasowych",
        errorDelete: "Błąd podczas usuwania kopii zapasowej",
        noBackups: "Brak kopii zapasowych na Google Drive",
        notAuthorized: "Brak autoryzacji do Google Drive",
      },
      restoreSelectedBackup: {
        restoring: "Przywracanie kopii zapasowej z Google Drive...",
        success:
          "Przywrócono kopię zapasową!\n{{restored}} użytkowników przywrócono, {{failed}} nie udało się ({{total}} łącznie)",
        error: "Błąd podczas przywracania kopii zapasowej",
        notAuthorized: "Brak autoryzacji do Google Drive",
      },
    },
  },
  confirmationPage: {
    message: {
      success: "Rejestracja udana.",
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
      success: "Konto zostało odzyskane.",
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
    imageRemove: {
      title: "Usuwanie zdjęcia",
      message: {
        confirm: "Czy na pewno chcesz usunąć zdjęcie?",
        loading: "Trwa usuwanie...",
        success: "Zdjecie zostało usunięte.",
        error: {
          default: "Błąd podczas usuwania zdjecia.",
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
        error: "Błąd podczas usuwania kopii zapasowej.",
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
  errorMessage: {
    imageLoadingError: "Błąd ładowania obrazu",
    imageUploadError: "Błąd podczas przesyłania obrazu",
    imageDeleteError: "Błąd podczas usuwania obrazu",
  },
  prepareText: {
    period: "kropka",
    comma: "przecinek",
    enter: "enter"
  },
};

export default langPl;
