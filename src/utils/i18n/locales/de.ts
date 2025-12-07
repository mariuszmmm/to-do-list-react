import langPl from "./pl";

const langDe: typeof langPl = {
  navigation: {
    tasksPage: "Aufgaben",
    lists: "Listen",
    info: "Info",
  },
  listFrom: "Liste vom",
  currentList: "aktuell",
  currentDate: { description: "Heute ist " },
  currentTaskCount: {
    tasks: "{{count}}\u00A0Aufgabe",
    tasks_few: "{{count}}\u00A0Aufgaben",
    tasks_many: "{{count}}\u00A0Aufgaben",
    tasks_other: "{{count}}\u00A0Aufgaben",
  },
  tasksPage: {
    title: "Aufgabenliste",
    form: {
      title: {
        addTask: "Neue Aufgabe hinzufügen",
        editTask: "Aufgabe bearbeiten",
      },
      buttons: {
        fetchExampleTasks: "Beispielaufgaben abrufen",
        loadFromArchive: "Aus dem Archiv laden",
        loading: "Laden...",
        error: "Fehler beim Laden der Daten",
      },
      inputPlaceholder: "Was ist zu tun?",
      inputButton: {
        addTask: "Aufgabe hinzufügen",
        saveChanges: "Speichern",
        cancel: "Abbrechen",
      },
    },
    search: {
      title: "Suchfunktion",
      buttons: {
        hide: "Filter ausblenden",
        show: "Filter anzeigen",
        clear: "Filter löschen",
      },
      inputPlaceholder: "Aufgaben filtern",
    },
    tasks: {
      defaultListName: "Neue Liste",
      inputPlaceholder: "Listenname eingeben",
      buttons: {
        titleButtons: {
          change: "Listenname ändern",
          save: "Speichern",
        },
        save: "Liste speichern",
        clear: "Liste löschen",
        hide: "Abgeschlossene ausblenden",
        show: "Abgeschlossene anzeigen",
        allDone: "Alle abschließen",
        allUndone: "Alle rückgängig machen",
        sort: "Sortierung aktivieren",
        notSort: "Sortierung deaktivieren",
        undo: "Rückgängig",
        redo: "Wiederholen",
      },
    },
  },
  taskPage: {
    title: "Aufgabendetails",
    noContent: "Aufgabe nicht gefunden 😥",
    done: {
      title: "Abgeschlossen",
      yes: "Ja",
      no: "Nein",
    },
    dateCreated: "Erstellungsdatum",
    dateEdited: "Änderungsdatum",
    dateDone: "Abschlussdatum",
  },
  archivedListsPage: {
    title: "Archivierte Listen",
    lists: {
      select: "Liste auswählen",
      empty: "Du hast keine archivierten Listen 😯",
    },
    buttons: {
      load: "Ausgewählte Liste laden",
    },
    subTitle: "Aufgabenliste (Vorschau)",
  },
  remoteListsPage: {
    title: "Meine Listen",
    lists: {
      select: "Liste auswählen",
      empty: "Du hast keine Remote Listen 😯",
    },
    buttons: {
      load: "Ausgewählte Liste bearbeiten",
      sort: "Sortierung aktivieren",
      notSort: "Sortierung deaktivieren",
    },
    subTitle: "Aufgabenliste (Vorschau)",
  },
  infoPage: {
    aboutApp: {
      title: "Über die App",
      topics: {
        features: {
          subTitle: "Hauptfunktionen:",
          description: {
            part1:
              "<strong>Aufgabenverwaltung</strong>: <br/>hinzufügen, bearbeiten, löschen, als erledigt markieren, Änderungen rückgängig machen und wiederherstellen.",
            part2:
              "<strong>Suchen und Filtern</strong>: <br/>Möglichkeit, Aufgaben zu durchsuchen, Filter ein- oder auszublenden und zurückzusetzen.",
            part3:
              "<strong>Listenverwaltung</strong>: <br/>Erstellen, Speichern und Laden von Aufgabenlisten aus einer MongoDB-Datenbank.",
            part4:
              "<strong>Mehrsprachige Unterstützung</strong>: <br/>Oberfläche verfügbar auf Polnisch, Englisch und Deutsch dank react-i18next.",
            part5:
              "<strong>Benutzerkontoverwaltung</strong>: <br/>Registrierung, Anmeldung, Passwort zurücksetzen und ändern, Kontolöschung mit Netlify GoTrue.",
            part6:
              "<strong>Sprachgesteuertes Hinzufügen von Aufgaben</strong>: <br/>Möglichkeit, Aufgabeninhalte per Spracherkennung (Web Speech API) einzugeben.",
          },
        },
        technologies: {
          subTitle: "Technologien:",
        },
        links: {
          subTitle: " Verfügbare Versionen:",
          description: {
            newApp: "Neue Version:",
            oldApp: "Alte Version:",
          },
        },
      },
    },
    aboutAuthor: {
      title: "Über den Autor",
      name: "Mariusz Matusiewicz",
      description: {
        part1:
          "Frontend-Entwicklung ist meine Leidenschaft, insbesondere mit <strong>React</strong>. Ich liebe es, neue Technologien zu erforschen und meine Fähigkeiten ständig weiterzuentwickeln. Die größte Zufriedenheit bereitet mir das Entwerfen intuitiver und ästhetischer Benutzeroberflächen, die das Leben der Nutzer erleichtern.",
        part2:
          "Abseits des Programmierens liebe ich die Berge. Wanderungen sind für mich eine Möglichkeit, mich zu entspannen und neue Energie zu tanken. Besonders am Herzen liegen mir die <strong>Bieszczady</strong> – ihre Ruhe und natürliche Schönheit inspirieren mich jedes Mal, wenn ich dorthin zurückkehre. Ich verbinde meine Leidenschaft für Technologie mit meiner Neugier auf die Welt. Dadurch nehme ich mit Begeisterung neue Herausforderungen an, die es mir ermöglichen, mich weiterzuentwickeln und Projekte zu schaffen, auf die ich stolz sein kann. 😊🚀",
      },
      links: {
        subTitle: "Links",
        description: {
          personalHomepage: "Persönliche Homepage:",
          github: "GitHub:",
        },
      },
    },
    contactForm: {
      title: "Kontakt",
      subTitle: "Frage oder Vorschlag? ✉️ Schreib mir einfach!",
    },
  },
  accountPage: {
    title: "Benutzerbereich",
    notLoggedIn: "Du bist nicht eingeloggt",
    buttons: {
      register: "Registrieren",
      login: "Anmelden",
      accountDelete: "Konto löschen",
      passwordChange: "Passwort ändern",
      resetPassword: "Passwort zurücksetzen",
      cancel: "Abbrechen",
    },
    deviceCount: {
      device: "Du bist auf {{count}} Gerät angemeldet",
      device_few: "Du bist auf {{count}} Geräten angemeldet",
      device_many: "Du bist auf {{count}} Geräten angemeldet",
      device_other: "Du bist auf {{count}} Geräten angemeldet",
    },
    userDeviceCount: {
      device: "angemeldet auf {{count}} Gerät",
      device_few: "angemeldet auf {{count}} Geräten",
      device_many: "angemeldet auf {{count}} Geräten",
      device_other: "angemeldet auf {{count}} Geräten",
    },
    activeUsers: {
      label: "Angemeldete Benutzer:",
      count: "Anzahl der aktiven Benutzer: {{count}}",
      count_few: "Anzahl der aktiven Benutzer: {{count}}",
      count_many: "Anzahl der aktiven Benutzer: {{count}}",
      count_other: "Anzahl der aktiven Benutzer: {{count}}",
    },
    allDevices: {
      device: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_few: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_many: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_other: "Gesamtzahl der aktiven Geräte: {{count}}",
    },
    form: {
      buttons: {
        login: "Anmelden",
        logout: "Abmelden",
        register: "Registrieren",
        save: "Speichern",
        reset: "Passwort zurücksetzen",
      },
      inputPlaceholders: {
        email: "E-Mail-Adresse eingeben",
        password: "Passwort eingeben",
        newPassword: "neues Passwort eingeben",
      },
      message: {
        email: "E-Mail-Adresse eingeben",
        emailMessage: "ungültige E-Mail-Adresse",
        password: "Passwort eingeben",
        passwordMessage: "Das Passwort muss mindestens 4 Zeichen lang sein.",
      },
    },
  },
  confirmationPage: {
    message: {
      success:
        "Die Registrierung war erfolgreich, du kannst die Seite schließen.",
      error: "Registrierung fehlgeschlagen.",
    },
    home: "Startseite",
  },
  accountRecoveryPage: {
    title: "Passwort ändern",
    subTitle: "Neues Passwort eingeben",
    message: {
      success:
        "Konto wurde wiederhergestellt.<br/> Du kannst zum vorher geöffneten Tab zurückkehren.",
      error: "Der Link ist abgelaufen oder wurde bereits verwendet.",
    },
    home: "Startseite",
  },
  modal: {
    buttons: {
      confirmButton: "Bestätigen",
      cancelButton: "Abbrechen",
      deleteButton: "Löschen",
      closeButton: "Schließen",
      logoutButton: "Abmelden",
      nextButton: "Weiter",
      refreshButton: "Aktualisieren",
      replaceButton: "Ersetzen",
      addButton: "Hinzufügen",
      yesButton: "Ja",
      noButton: "Nein",
    },
    login: {
      title: "Anmeldung",
      message: {
        loading: "Anmeldung läuft...",
        success: "Angemeldet als: <strong>{{user}}</strong>",
        error: {
          default: "Anmeldefehler",
        },
      },
    },
    logout: {
      title: "Abmeldung",
      message: {
        confirm: "Möchtest du dich wirklich abmelden?",
        loading: "Abmeldung läuft...",
        success: "Du wurdest abgemeldet.",
        error: {
          default: "Abmeldefehler.",
        },
      },
    },
    passwordChange: {
      title: "Passwort ändern",
      message: {
        loading: "Passwortänderung läuft...",
        success: "Das Passwort wurde geändert.",
        error: {
          default: "Fehler beim Ändern des Passworts.",
        },
      },
    },
    accountRegister: {
      title: "Konto registrieren",
      message: {
        loading: "Registrierung läuft...",
        info: "Ein Link zur Konto-Registrierung wurde an die angegebene E-Mail-Adresse gesendet.",
        error: {
          userExists:
            "Ein Benutzer mit dieser E-Mail-Adresse ist bereits registriert.",
          default: "Registrierungsfehler",
        },
      },
    },
    accountRecovery: {
      title: "Konto wiederherstellen",
      message: {
        loading: "Konto-Wiederherstellung läuft...",
        info: "Ein Link zum Zurücksetzen des Passworts wurde an die angegebene E-Mail-Adresse gesendet.<br/> Wenn du keine Nachricht erhalten hast, versuche es in 15 Minuten erneut.",
        success:
          "Das Konto wurde wiederhergestellt, lege ein neues Passwort fest.",
        error: {
          default: "Fehler bei der Wiederherstellung des Kontos.",
          linkExpired: "Der Link ist abgelaufen oder wurde bereits verwendet.",
        },
      },
    },
    accountDelete: {
      title: "Konto löschen",
      message: {
        confirm: "Möchtest du dein Konto wirklich löschen?",
        loading: "Konto wird gelöscht...",
        success: "Das Konto wurde gelöscht.",
        error: {
          default: "Fehler beim Löschen des Kontos.",
        },
      },
    },
    dataRemoval: {
      title: "Daten löschen",
      message: {
        confirm: "Möchtest du alle Daten aus der App löschen?",
        info: "Alle Daten wurden gelöscht.",
      },
    },
    listsDownload: {
      title: "Listen herunterladen",
      message: {
        loading: "Listen werden heruntergeladen...",
        success: "Listen wurden heruntergeladen.",
        error: {
          default: "Fehler beim Herunterladen der Listen.",
        },
      },
    },
    listSave: {
      title: "Liste speichern",
      message: {
        confirm:
          "Die Liste <strong>{{name}}</strong> existiert bereits.<br/> Möchtest du sie ersetzen?",
        cancel: "Ändere den Namen der Liste und speichere sie erneut.",
        loading:
          "Liste <strong>{{name}}</strong> wird in der Datenbank gespeichert...",
        success:
          "Liste <strong>{{name}}</strong> wurde in der Datenbank gespeichert.",
        error: {
          conflict:
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/> Versuche es erneut.",
          default: "Fehler beim Hinzufügen der Liste zur Datenbank.",
        },
      },
    },
    archiveTasks: {
      title: "Aufgaben archivieren",
      message: {
        confirm: "Möchtest du die aktuellen Aufgaben ins Archiv verschieben?",
      },
    },
    listRemove: {
      title: "Liste löschen",
      message: {
        confirm:
          "Möchtest du die Liste <strong>{{name}}</strong> wirklich löschen?",
        loading: "Liste wird gelöscht...",
        success: "Die Liste wurde aus der Datenbank gelöscht.",
        error: {
          conflict:
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/> Versuche es erneut.",
          default: "Fehler beim Löschen der Liste.",
        },
      },
    },
    listsUpdate: {
      title: "Liste aktualisieren",
      message: {
        loading: "Liste wird aktualisiert...",
        success: "Die Liste wurde aktualisiert.",
        error: {
          conflict:
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/> Versuche es erneut.",
          default: "Fehler beim Aktualisieren der Liste.",
        },
      },
    },
    listLoad: {
      title: "Liste laden",
      message: {
        confirm: "Möchtest du die Aufgaben zur aktuellen Liste hinzufügen?",
        info: "Die Liste <strong>{{name}}</strong> wurde geladen.",
      },
    },
    confirmation: {
      title: "Registrierungsbestätigung",
      message: {
        loading: "Überprüfe den Registrierungsstatus...",
        success: "Registrierung erfolgreich, schließe die Seite.",
        error: {
          default: "Der Link ist abgelaufen oder wurde bereits verwendet.",
        },
      },
    },
    sendMessage: {
      title: "Nachricht senden",
      labels: {
        email: "E-Mail:",
        message: "Nachricht:",
      },
      placeholders: {
        email: "Geben Sie Ihre E-Mail-Adresse ein",
        message: "Geben Sie Ihre Nachricht ein",
      },
      message: {
        loading: "Nachricht wird gesendet...",
        success: "Nachricht gesendet.",
        error: {
          default: "Fehler beim Senden der Nachricht.",
        },
      },
      button: "Absenden",
    },
  },
  prepareText: {
    period: "Punkt",
    comma: "Komma",
  },
};

export default langDe;
