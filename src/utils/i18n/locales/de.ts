import langPl from "./pl";

const langDe: typeof langPl = {
  navigation: {
    tasksPage: "Aufgaben",
    lists: "Listen",
    author: "Über den Autor",
  },
  currentDate: { desc: "Heute ist " },
  tasksPage: {
    title: "Aufgabenliste",
    form: {
      title: {
        addTask: "Neue Aufgabe hinzufügen",
        editTask: "Aufgabe bearbeiten",
      },
      buttons: {
        fetchExampleTasks: "Beispielaufgaben abrufen",
        loading: "Laden...",
        error: "Fehler beim Laden der Daten",
      },
      inputPlaceholder: "Was ist zu tun?",
      inputButton: {
        addTask: "Aufgabe hinzufügen",
        saveChanges: "Änderungen speichern",
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
      inputPlaceholder: "Listenname eingeben",
      buttons: {
        titleButtons: {
          change: "Listenname ändern",
          save: "Speichern",
        },
        save: "Liste speichern",
        change: "Namen ändern",
        hide: "Abgeschlossene ausblenden",
        show: "Abgeschlossene anzeigen",
        allDone: "Alle abschließen",
        allUndone: "Alle rückgängig machen",
        undo: "Rückgängig",
        redo: "Wiederholen",
      },
    },
  },
  listsPage: {
    title: "Gespeicherte Listen",
    lists: {
      select: "Liste auswählen",
      empty: "Du hast keine gespeicherten Listen 😯",
    },
    buttons: {
      load: "Ausgewählte Liste laden",
    },
    subTitle: "Ausgewählte Liste",
  },
  authorPage: {
    title: "Über den Autor",
    name: "Mariusz Matusiewicz",
    description: {
      part1:
        "Frontend-Entwicklung ist meine Leidenschaft, insbesondere mit <b>React</b>. Ich liebe es, neue Technologien zu erforschen und meine Fähigkeiten ständig weiterzuentwickeln. Die größte Zufriedenheit bereitet mir das Entwerfen intuitiver und ästhetischer Benutzeroberflächen, die das Leben der Nutzer erleichtern.",
      part2:
        "Abseits des Programmierens liebe ich die Berge. Wanderungen sind für mich eine Möglichkeit, mich zu entspannen und neue Energie zu tanken. Besonders am Herzen liegen mir die <b>React</b> – ihre Ruhe und natürliche Schönheit inspirieren mich jedes Mal, wenn ich dorthin zurückkehre. Ich verbinde meine Leidenschaft für Technologie mit meiner Neugier auf die Welt. Dadurch nehme ich mit Begeisterung neue Herausforderungen an, die es mir ermöglichen, mich weiterzuentwickeln und Projekte zu schaffen, auf die ich stolz sein kann. 😊🚀",
    },
  },
  accountPage: {
    title: "Dein Konto",
    notLoggedIn: "Du bist nicht eingeloggt",
    buttons: {
      register: "Registrieren",
      login: "Anmelden",
      deleteAccount: "Konto löschen",
      changePassword: "Passwort ändern",
      resetPassword: "Passwort zurücksetzen",
      cancel: "Abbrechen",
    },
    form: {
      buttons: {
        login: "Anmelden",
        logout: "Abmelden",
        register: "Registrieren",
        save: "Speichern",
        reset: "Passwort zurücksetzen",
      },
      placeholderInput: {
        email: "E-Mail-Adresse eingeben",
        password: "Passwort eingeben",
        newPassword: "Neues Passwort",
      },
      message: {
        email: "E-Mail-Adresse eingeben",
        emailMessage: "Ungültige E-Mail-Adresse",
        password: "Passwort eingeben",
        passwordMessage: "Das Passwort muss mindestens 4 Zeichen lang sein.",
      },
    },
  },
  confirmationPage: {
    message: {
      success: "Registrierung erfolgreich, <br/> schließe die Seite.",
      error: "Registrierung fehlgeschlagen, <br/> schließe die Seite.",
    },
  },
  accountRecoveryPage: {
    title: "Passwort ändern",
    subTitle: "Neues Passwort eingeben",
    message: {
      success: "Das Konto wurde wiederhergestellt, <br/> schließe die Seite.",
      error:
        "Der Link ist abgelaufen oder wurde bereits verwendet, <br/> schließe die Seite.",
    },
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
    },
    login: {
      title: "Anmeldung",
      message: {
        loading: "Anmeldung läuft...",
        success: "Angemeldet als <b>{{user}}</b>",
        error: {
          noConnection: "Keine Internetverbindung.",
          notFound:
            "Kein Benutzer mit dieser E-Mail-Adresse gefunden oder das Passwort ist falsch.",
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
    changePassword: {
      title: "Passwort ändern",
      message: {
        loading: "Passwortänderung läuft...",
        success: "Das Passwort wurde geändert.",
        error: {
          default: "Fehler beim Ändern des Passworts.",
        },
      },
    },
    registerAccount: {
      title: "Konto registrieren",
      message: {
        loading: "Registrierung läuft...",
        info: "Ein Link zur Konto-Registrierung wurde an die angegebene E-Mail-Adresse gesendet.",
        error: {
          noConnection: "Keine Internetverbindung.",
          emailFormat: "Ungültiges E-Mail-Format.",
          invalidEmail:
            "Die E-Mail-Adresse konnte nicht überprüft werden: ungültiges Format.",
          userExists:
            "Ein Benutzer mit dieser E-Mail-Adresse ist bereits registriert.",
          default: "Registrierungsfehler",
        },
      },
    },
    recoveryAccount: {
      title: "Konto wiederherstellen",
      message: {
        loading: "Konto-Wiederherstellung läuft...",
        info: "Ein Link zum Zurücksetzen des Passworts wurde an die angegebene E-Mail-Adresse gesendet. Wenn du keine Nachricht erhalten hast, versuche es in 15 Minuten erneut.",
        success:
          "Das Konto wurde wiederhergestellt, lege ein neues Passwort fest.",
        error: {
          noConnection: "Keine Internetverbindung.",
          notFound: "Kein Benutzer mit dieser E-Mail-Adresse gefunden.",
          default: "Fehler bei der Wiederherstellung des Kontos.",
          linkExpired: "Der Link ist abgelaufen oder wurde bereits verwendet.",
        },
      },
    },
    changeEmail: {
      title: "Passwort ändern",
      message: {
        loading: "Passwortänderung läuft...",
        success: "Das Passwort wurde aktualisiert, schließe die Seite.",
        error: {
          default: "Fehler beim Aktualisieren des Passworts.",
        },
      },
    },
    deleteAccount: {
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
    downloadLists: {
      title: "Listen herunterladen",
      message: {
        loading: "Listen werden heruntergeladen...",
        success: "Listen wurden heruntergeladen.",
        error: {
          default: "Fehler beim Herunterladen der Listen.",
        },
      },
    },
    refreshLists: {
      message: {
        confirm:
          "Die Operation konnte nicht korrekt ausgeführt werden, da die heruntergeladenen Listen veraltet sind. Aktualisiere und versuche es erneut.",
      },
    },
    saveList: {
      title: "Liste speichern",
      message: {
        loading:
          "Liste <b>{{listName}}</b> wird in der Datenbank gespeichert...",
        success:
          "Liste <b>{{listName}}</b> wurde in der Datenbank gespeichert.",
        error: {
          default: "Fehler beim Hinzufügen der Liste zur Datenbank.",
        },
      },
    },
    removeList: {
      title: "Liste löschen",
      message: {
        confirm: "Möchtest du die Liste <b>{{listName}}</b> wirklich löschen?",
        loading: "Liste wird gelöscht...",
        success: "Die Liste wurde aus der Datenbank gelöscht.",
        error: {
          default: "Fehler beim Löschen der Liste.",
        },
      },
    },
    loadList: {
      title: "Liste laden",
      message: {
        info: "Die Liste <b>{{listName}}</b> wurde in die aktuelle Aufgabenliste geladen.",
        error: {
          default: "Fehler beim Laden der Liste.",
        },
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
  },
};

export default langDe;
