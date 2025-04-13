const langPl = {
  navigation: {
    tasksPage: "Zadania",
    lists: "Listy",
    author: "O autorze",
  },
  currentDate: { desc: "Dziś jest " },
  tasksPage: {
    title: "Lista zadań",
    form: {
      title: {
        addTask: "Dodaj nowe zadanie",
        editTask: "Edytuj zadanie",
      },
      buttons: {
        fetchExampleTasks: "Pobierz przykładowe zadania",
        loading: "Ładowanie...",
        error: "Błąd ładowania danych",
      },
      inputPlaceholder: "Co jest do zrobienia ?",
      inputButton: {
        addTask: "Dodaj zadanie",
        saveChanges: "Zapisz zmiany",
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
        remove: "Usuń listę",
        hide: "Ukryj ukończone",
        show: "Pokaż ukończone",
        allDone: "Ukończ wszystkie",
        allUndone: "Odznacz wszystkie",
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
  listsPage: {
    title: "Zapisane listy",
    lists: {
      select: "Wybierz listę",
      empty: "Nie masz zapisanych list 😯",
    },
    buttons: {
      load: "Załaduj wybraną listę",
    },
    subTitle: "Wybrana lista",
  },
  authorPage: {
    title: "O autorze",
    name: "Mariusz Matusiewicz",
    description: {
      part1:
        "Tworzenie frontendu to moja pasja, zwłaszcza z wykorzystaniem <strong>React</strong>.<br/> Uwielbiam zgłębiać nowe technologie i stale rozwijać swoje umiejętności. Największą satysfakcję daje mi projektowanie intuicyjnych i estetycznych interfejsów, które ułatwiają życie użytkownikom.",
      part2:
        "Poza programowaniem kocham góry. Wędrówki to dla mnie sposób na odpoczynek i naładowanie baterii. Szczególnie bliskie mojemu sercu są <strong>Bieszczady</strong> – ich spokój i naturalne piękno inspirują mnie za każdym razem, gdy tam wracam. Łączę zamiłowanie do technologii z ciekawością świata. Dzięki temu z entuzjazmem podejmuję nowe wyzwania, które pozwalają mi rozwijać się i tworzyć projekty, z których mogę być dumny. 😊🚀",
    },
  },
  accountPage: {
    title: "Twoje konto",
    notLoggedIn: "Jesteś niezalogowany",
    buttons: {
      register: "Rejestracja",
      login: "Logowanie",
      deleteAccount: "Usuń konto",
      changePassword: "Zmień hasło",
      resetPassword: "Zresetuj hasło",
      cancel: "Anuluj",
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
  },
  confirmationPage: {
    message: {
      success: "Rejestracja udana.",
      error: "Rejestracja nieudana.",
    },
  },
  accountRecoveryPage: {
    title: "Zmiana hasła",
    subTitle: "Wpisz nowe hasło",
    message: {
      success: "Konto zostało odzyskane.",
      error: "Link wygasł lub został użyty.",
    },
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
    },
    login: {
      title: "Logowanie",
      message: {
        loading: "Trwa logowanie...",
        success: "Zalogowano jako: <strong>{{user}}</strong>",
        error: {
          noConnection: "Brak połączenia z internetem.",
          notFound:
            "Nie znaleziono użytkownika z tym adresem e-mail lub hasło jest nieprawidłowe.",
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
    changePassword: {
      title: "Zmiana hasła",
      message: {
        loading: "Trwa zmiana hasła...",
        success: "Hasło zostało zmienione.",
        error: {
          default: "Błąd podczas zmiany hasła.",
        },
      },
    },
    registerAccount: {
      title: "Rejestracja konta",
      message: {
        loading: "Trwa rejestracja...",
        info: "Na podany adres e-mail został wysłany link do rejestracji konta.",
        error: {
          noConnection: "Brak połączenia z internetem.",
          emailFormat: "Błędny format adresu e-mail.",
          invalidEmail:
            "Nie można zweryfikować adresu e-mail: nieprawidłowy format.",
          userExists:
            "Użytkownik z tym adresem e-mail jest już zarejestrowany.",
          default: "Błąd rejestracji",
        },
      },
    },
    recoveryAccount: {
      title: "Odzyskiwanie konta",
      message: {
        loading: "Trwa odzyskiwanie konta...",
        info: "Na podany adres e-mail został wysłany link do zresetowania hasła.<br/> Jeśli nie otrzymałeś wiadomości, spróbuj ponownie za 15 minut.",
        success: "Konto zostało odzyskane, ustaw nowe hasło.",
        error: {
          noConnection: "Brak połączenia z internetem.",
          notFound: "Nie znaleziono użytkownika z tym adresem e-mail.",
          default: "Błąd odzyskiwania hasła.",
          linkExpired: "Link wygasł lub został użyty.",
        },
      },
    },
    deleteAccount: {
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
    downloadLists: {
      title: "Pobieranie list",
      message: {
        loading: "Trwa pobieranie list...",
        success: "Listy zostały pobrane.",
        error: {
          default: "Wystąpił błąd podczas pobierania list.",
        },
      },
    },
    refreshLists: {
      message: {
        confirm:
          "Operacja nie mogła być wykonana poprawnie, ponieważ pobrane listy są nieaktualne.<br/> Odśwież i sprobuj ponownie.",
      },
    },
    saveList: {
      title: "Zapisywanie listy",
      message: {
        confirm:
          "Lista o nazwie <strong>{{listName}}</strong> już isnieje w bazie danych.<br/> Czy chcesz ją zastąpić?",
        cancel: "Zmień nazwę listy i zapisz ponownie.",
        loading:
          "Zapisywanie listy <strong>{{listName}}</strong> w bazie danych...",
        success:
          "Lista <strong>{{listName}}</strong> została zapisana w bazie danych.",
        error: {
          default: "Wystąpił błąd podczas dodawania listy do bazy danych.",
        },
      },
    },
    removeList: {
      title: "Usuwanie listy",
      message: {
        confirm:
          "Czy na pewno chcesz usunąć listę: <strong>{{listName}}</strong> ?",
        loading: "Trwa usuwanie listy...",
        success: "Lista została usunięta z bazy danych.",
        error: {
          default: "Wystąpił błąd podczas usuwania listy.",
        },
      },
    },
    loadList: {
      title: "Ładowanie listy",
      message: {
        info: "Lista <strong>{{listName}}</strong> została załadowana do bieżacej listy zadań.",
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
  },
};

export default langPl;
