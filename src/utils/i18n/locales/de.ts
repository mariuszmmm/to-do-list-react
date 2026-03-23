import langPl from "./pl";

const langDe: typeof langPl = {
  navigation: {
    tasksPage: "Aufgaben",
    lists: "Listen",
    info: "Über",
  },
  listFrom: "Liste vom",
  currentList: "aktiv",
  online: "online",
  offline: "offline",
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
        loadFromArchive: "Aus Archiv wiederherstellen",
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
    dateEdited: "Bearbeitungsdatum",
    dateDone: "Abschlussdatum",
    backButton: "Zurück",
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
  },
  taskImagePage: {
    title: "Aufgabenbild",
    noTask: "Aufgabe nicht gefunden 😥",
    buttons: {
      add: "Hinzufügen",
      change: "Ändern",
      remove: "Entfernen",
      back: "Zurück",
      uploadFromDevice: "Vom Gerät hochladen",
      takePicture: "Foto aufnehmen",
      cancel: "Abbrechen",
      capture: "Aufnehmen",
      close: "Schließen",
    },
    messages: {
      uploading: "Hochladen…",
      loading: "Laden…",
      removing: "Löschen…",
      cameraPermissionDenied:
        "Kamerazugriff wurde verweigert. Erlauben Sie den Kamerazugriff in den Einstellungen Ihres Browsers.",
      cameraNotFound:
        "Kameragerät nicht gefunden. Überprüfen Sie die Kameraverbindung.",
      cameraError: "Beim Zugriff auf die Kamera ist ein Fehler aufgetreten.",
      error: {
        imageUploadError: "Fehler beim Hochladen des Bildes",
        imageDeleteError: "Fehler beim Löschen des Bildes",
        notAuthenticated: "Sie müssen angemeldet sein, um ein Bild hochzuladen",
        uploadInvalidResponse: "Serverfehler beim Hochladen des Bildes",
        moveFailed: "Fehler beim Verschieben des Bildes in den Ordner",
        noFileSelected: "Keine Datei ausgewählt",
        invalidFileType: "Ungültiger Dateityp. Erlaubt: {{allowedTypes}}",
        fileTooLarge: "Datei ist zu groß. Maximale Größe: {{maxSize}} MB",
        uploadCanceled: "Bild-Upload abgebrochen",
        unknownError: "Unbekannter Fehler",
      },
    },
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
    howToStart: {
      title: "Wie fange ich an?",
      subTitle: "Erste Schritte:",
      steps: {
        step1: {
          title: "1. Erstellen beginnen",
          description:
            "Geben Sie im Feld „Was ist zu tun?“ den Aufgabeninhalt ein. Sie können die Aufgabe auch diktieren – klicken Sie auf das Mikrofonsymbol. Aufgaben können bearbeitet (Bleistift), gelöscht (Papierkorb) und als erledigt markiert werden.",
        },
        step2: {
          title: "2. Einloggen",
          description:
            "Erstellen Sie ein Konto, damit Ihre Daten nicht verloren gehen. Aktivieren Sie im Anmeldefenster die Option „Angemeldet bleiben“, damit sich die App länger an Sie erinnert und Sie nicht bei jedem Besuch Ihr Passwort eingeben müssen.",
        },
        step3: {
          title: "3. In der Cloud speichern",
          description:
            "Als angemeldeter Benutzer können Sie Ihre aktuelle Liste in der Datenbank speichern, indem Sie auf die Schaltfläche „Liste speichern“ klicken. Ihre Daten sind sicher und auf all Ihren Geräten verfügbar.",
        },
        step4: {
          title: "4. Listen verwalten",
          description:
            "Auf der Seite „Listen“ finden Sie alle Ihre gespeicherten Zusammenstellungen. Dort können Sie sie sortieren, löschen oder deren Inhalt am Ende der Seite in der Vorschau anzeigen. Klicken Sie auf „Ausgewählte Liste bearbeiten“, um sie in die Hauptansicht zu laden.",
        },
        step5: {
          title: "5. Fotos hinzufügen",
          description:
            "Sie können jeder Aufgabe ein Foto oder eine Grafik hinzufügen. Klicken Sie einfach auf das Kamerasymbol bei der ausgewählten Aufgabe, um das Bildverwaltungs-Panel zu öffnen.",
        },
        step6: {
          title: "6. App installieren",
          description:
            "Auf Ihrem Telefon können Sie die To-Do List wie eine normale App verwenden. Klicken Sie auf die „drei Punkte“ in der Ecke Ihres Browsers und wählen Sie „Zum Startbildschirm hinzufügen“. Das App-Symbol erscheint auf Ihrem Desktop.",
        },
        step7: {
          title: "7. Benachrichtigungen planen",
          description:
            "Möchtest du eine Aufgabe nicht vergessen? Klicke auf das Glockensymbol bei einer bestimmten Aufgabe und plane eine Erinnerung. Die App sendet dir zum festgelegten Zeitpunkt eine Push-Benachrichtigung und eine E-Mail.",
        },
      },
    },
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
            part7:
              "<strong>Aufgabenanhänge</strong>: <br/>Möglichkeit, Bilder an Aufgaben anzuhängen (mithilfe von Cloudinary).",
            part8:
              "<strong>Drag & Drop</strong>: <br/>intuitive Neuordnung von Aufgaben und Listen (mithilfe von @dnd-kit).",
            part9:
              "<strong>Echtzeit-Synchronisation</strong>: <br/>sofortige Updates auf allen Geräten durch Ably.",
            part10:
              "<strong>Archivierte Listen und Backups</strong>: <br/>Archivieren von Listen und Backups auf Google Drive oder lokalen Speicher.",
            part11:
              "<strong>Geplante Benachrichtigungen</strong>: <br/>Möglichkeit, Aufgabenerinnerungen über Push-Benachrichtigungen und E-Mails festzulegen (mithilfe von OneSignal).",
          },
        },
        technologies: {
          subTitle: "Technologien:",
        },
        links: {
          subTitle: "Anwendungsversionen:",
          description: {
            newApp: "Neueste Version (Netlify):",
            oldApp: "Archivierte Version (GitHub Pages):",
          },
        },
      },
    },
    aboutAuthor: {
      title: "Über den Autor",
      name: "Mariusz Matusiewicz",
      description: {
        part1:
          "Frontend-Entwicklung ist meine Leidenschaft, insbesondere mit <strong>React</strong>. Ich liebe es, neue Technologien zu erkunden und meine Fähigkeiten ständig zu verbessern. Mein Kopf ist immer voller Ideen für neue Funktionen für die Apps, an denen ich arbeite, was mich wirklich antreibt.",
        part2:
          "Abseits der Programmierung liebe ich die Berge. Wandern ist für mich der beste Weg, um mich auszuruhen und neue Energie zu tanken. Besonders am Herzen liegen mir die <strong>Bieszczady</strong> – ihre Ruhe und natürliche Schönheit inspirieren mich jedes Mal, wenn ich dorthin zurückkehre. Indem ich meine Liebe zur Technologie mit meiner Neugier auf die Welt verbinde, nehme ich enthusiastisch neue Herausforderungen an und erschaffe Projekte, auf die ich stolz sein kann. 😊🚀",
      },
      links: {
        subTitle: "Externe Links",
        description: {
          personalHomepage: "Offizielles Portfolio:",
          github: "GitHub-Profil:",
        },
      },
    },
    contactForm: {
      title: "Kontakt",
      subTitle: "Kontaktieren Sie mich gerne. ✉️",
    },
  },
  accountPage: {
    title: "Benutzerbereich",
    notLoggedIn: "Du bist nicht eingeloggt",
    environmentReset: {
      title: "Konfigurationsreset",
    },
    switcher: {
      title: "Gespeicherte Konten",
      active: "Aktiv",
      switch: "Wechseln",
      forget: "Vom Gerät entfernen",
      addAccount: "Anderes Konto anmelden",
      confirmForget:
        "Möchtest Sie dieses Konto wirklich von diesem Gerät entfernen (vergessen)?",
      unnamedAccount: "Konto ohne Namen",
      switchListTitle: "Konto wechseln",
    },
    buttons: {
      register: "Registrieren",
      login: "Anmelden",
      accountDelete: "Konto löschen",
      passwordChange: "Passwort ändern",
      resetPassword: "Passwort zurücksetzen",
      cancel: "Abbrechen",
    },
    toggleButtons: {
      show: "Sektion ausklappen",
      hide: "Sektion einklappen",
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
      label: "Angemeldete Benutzer",
      summaryTitle: "Übersicht der Benutzeraktivität",
      count: "Anzahl der aktiven Benutzer: {{count}}",
      summaryLabel: "Benutzerkonten",
      count_few: "Anzahl der aktiven Benutzer: {{count}}",
      count_many: "Anzahl der aktiven Benutzer: {{count}}",
      count_other: "Anzahl der aktiven Benutzer: {{count}}",
    },
    userManagement: {
      title: "Nutzerverwaltung",
      invite: {
        label: "Neuen Nutzer einladen",
        placeholder: "E-Mail-Adresse eingeben",
        button: "Einladung senden",
        success: "Einladung wurde erfolgreich versendet!",
        error: "Fehler beim Versenden der Einladung.",
      },
      users: {
        title: "Benutzerliste",
        loading: "Laden...",
        empty: "Keine Benutzer in der Datenbank.",
        deleteButton: "Löschen",
        deleteConfirm: "Sicher?",
        deleteSuccess: "Konto wurde gelöscht.",
        deleteError: "Fehler beim Löschen des Kontos.",
        status: {
          active: "Aktiv",
          pending: "Ausstehend",
          deleted: "Gelöscht",
        },
      },
    },
    allDevices: {
      summaryLabel: "Aktive Geräte",
      device: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_few: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_many: "Gesamtzahl der aktiven Geräte: {{count}}",
      device_other: "Gesamtzahl der aktiven Geräte: {{count}}",
    },
    systemAdmin: {
      title: "System & Wartung",
      ablyStatus: {
        connected: "Verbunden",
        connecting: "Verbindung wird hergestellt...",
        disconnected: "Getrennt",
        failed: "Verbindung fehlgeschlagen",
      },
      ably: {
        title: "Kommunikation & Sync (Ably)",
        state: "Verbindungsstatus: {{state}}",
        messagesUsage: "Nachrichtenlimit (Monatlich)",
        connectionsUsage: "Gleichzeitige Verbindungen",
        labels: {
          status: "Verbindungsstatus",
        },
      },
      database: {
        title: "Datenbank (MongoDB)",
        cleanButton: "Aufgabenbereinigung ausführen",
        cleanLogsButton: "Protokollbereinigung ausführen",
        cleaning: "Bereinigung läuft...",
        users: "Benutzer: {{count}}",
        lists: "Listen: {{count}}",
        tasks: "Aufgaben: {{count}}",
        dataSize: "Datengröße: {{size}} MB",
        storageSize: "Festplattennutzung: {{size}} MB",
        indexSize: "Indexgröße: {{size}} MB",
        usage: "MongoDB Speichernutzung (Limit 512MB)",
        labels: {
          dataSize: "Datengröße",
          storageSize: "Festplattennutzung",
          indexSize: "Indexgröße",
          users: "Benutzer",
          lists: "Listen",
          tasks: "Aufgaben",
        },
        results: {
          cleaned: "Bereinigte Datensätze",
          deletedCount: "Gelöschte Logs",
          modifiedCount: "Gelöschte Aufgaben",
        },
      },
      storage: {
        title: "Bildspeicher (Cloudinary)",
        lastCleanup: "Letzte Reinigung: {{date}}",
        never: "nie",
        cleanButton: "Reinigung ausführen",
        cleaning: "Reinigung läuft...",
        bandwidthLabel: "Cloudinary Bandbreitennutzung (25 GB Limit)",
        storageLabel: "Cloudinary Speichernutzung (25 GB Limit)",
        transformationsLabel: "Cloudinary Transformationen (Limit 25.000)",
        resources: "Dateien: {{used}} / {{limit}}",
        transformations: "Transformationen: {{used}} / {{limit}}",
        bandwidth: "Bandbreite: {{used}} GB / {{limit}} GB",
        credits: "Credits: {{used}} / {{limit}} ({{percent}}%)",
        creditsUsage: "Cloudinary Credits (Limit 25)",
        nextBillingPeriod: "Guthabenerneuerung: Jeden Monat",
        creditBreakdownLabel: "Aufschlüsselung der Credits",
        success: "Reinigung erfolgreich abgeschlossen!",
        error: "Fehler bei der Reinigung.",
        labels: {
          resources: "Dateien",
          transformations: "Transformationen",
          bandwidth: "Bandbreite",
          credits: "Credits",
          impressions: "Impressionen",
          storage: "Speicherplatz",
        },
        results: {
          totalCloudinaryImages: "Alle Cloudinary-Bilder",
          totalMongoImages: "Bilder in der Datenbank",
          orphansFound: "Gefundene Waisen",
          missingInCloudinary: "In Cloudinary fehlend",
          cleaned: "Entfernte Bilder",
        },
      },
      netlify: {
        title: "Hosting & Plattform (Netlify)",
        bandwidth: "Bandbreitennutzung: {{used}} / {{limit}}",
        buildMinutes: "Build-Minuten: {{used}} / {{limit}}",
        functions: "Funktionsaufrufe: {{used}} / {{limit}}",
        lastDeploy: "Letzter Deploy: {{date}}",
        siteName: "Seitenname: {{name}}",
        noData:
          "Netlify-Monitoring ist nicht konfiguriert oder Daten sind nie verfügbar.",
        siteMonitoringError:
          "Die Überwachungssysteme von Netlify melden derzeit Probleme mit der Datenverfügbarkeit.<br/>Einige Statistiken können nicht verfügbar oder auf Null gesetzt sein.",
        bandwidthLabel: "Netlify-Datennutzung (100 GB Limit)",
        productionDeploysLabel: "Deployments (Limit 20)",
        computeLabel: "Berechnungsressourcen (Limit 60 GB-Std.)",
        webRequestsLabel: "Web-Anfragen (Limit 900.000)",
        creditBandwidthLabel: "Datentransfer (Limit 30 GB)",
        creditsLabel: "Netlify Credits (Limit 300)",
        nextBillingPeriod: "Credits-Erneuerung am",
        creditBreakdownLabel: "Aufschlüsselung der Credits",
        breakdown: {
          productionDeploys: "Deployment",
          compute: "Compute",
          aiInference: "KI-Inferenz",
          bandwidth: "Datentransfer",
          webRequests: "Webanfragen",
          formSubmissions: "Formulare",
        },
        creditUnit: "",
        units: {
          deploys: "Deploys",
          gbHrs: "GB-Std.",
          gbs: "GBs",
          webRequests: "Webanfragen",
          submissions: "Formulare",
        },
        labels: {
          siteName: "Seitenname",
          lastDeploy: "Letzter Deploy",
        },
      },
      diagnosis: {
        title: "Diagnose & Systemwartung",
        runButton: "API-Tests ausführen",
        running: "Wird getestet...",
        success: "Diagnose erfolgreich abgeschlossen!",
        error: "Fehler",
      },
      logs: {
        title: "Aktuelle Systemereignisse",
        noLogs: "Keine Ereignisse aufgezeichnet",
        success: "Erfolgreich abgeschlossen",
        types: {
          autobackup: "Auto-Backup (GD)",
          manualbackup: "Manuelles-Backup (GD)",
          backup_disk_all: "Vollständiges Backup (Datei)",
          backup_disk_user: "Benutzer-Backup (Datei)",
          restore_gd: "Wiederherstellung (GD)",
          restore_disk: "Wiederherstellung (Datei)",
          cleanup: "Verwaiste Bilder bereinigen",
          cleanup_temp: "Temp-Bilder bereinigen",
          cleanup_tasks: "Gelöschte Aufgaben bereinigen",
          cleanup_logs: "Alte Logs bereinigen",
          oauth: "Google-Autorisierung",
          user_invite: "Benutzereinladung",
        },
      },
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
    sessionInfo: {
      title: "Sitzungsinformationen",
      createdAt: "Konto erstellt",
      confirmedAt: "E-Mail bestätigt",
      tokenTitle: "Authentifizierungstoken",
      tokenExpiresAt: "Token läuft ab um",
      tokenExpiresIn: "Token läuft ab in",
      tokenStatus: "Token-Status",
      tokenActive: "Token ist aktiv",
      tokenExpired: "Token ist abgelaufen",
    },
    autoRefresh: {
      label: "Angemeldet bleiben",
      enabledDescription: "Das Token wird automatisch erneuert",
      disabledDescription: "Du wirst abgemeldet, wenn das Token abläuft",
    },
    backup: {
      title: "Sicherung",
      downloadUserLists: {
        button: "Meine Listen (Disk) speichern",
        tooltip: "Nur Ihre eigenen Listen auf den Computer herunterladen",
        downloading: "Ihre Listen werden heruntergeladen...",
        success: "Ihre Listen wurden heruntergeladen!",
        error: "Fehler beim Herunterladen Ihrer Listen",
      },
      downloadAllUsers: {
        button: "Alle Daten (Disk) speichern",
        tooltip: "Listen aller Benutzer auf den Computer herunterladen",
        downloading: "Alle Benutzerlisten werden heruntergeladen...",
        success: "Alle Benutzerlisten wurden heruntergeladen!",
        error: "Fehler beim Herunterladen aller Benutzerlisten",
      },
      restoreUserLists: {
        button: "Meine Listen (Disk) laden",
        tooltip:
          "Nur deine eigenen Listen von einer Datei auf dem Computer wiederherstellen",
        processing: "Deine Listen werden verarbeitet...",
        success:
          "Backup wurde erfolgreich wiederhergestellt!\n{{count}} Listen wurden wiederhergestellt.",
        success_few:
          "Backup wurde erfolgreich wiederhergestellt!\n{{count}} Listen wurden wiederhergestellt.",
        success_many:
          "Backup wurde erfolgreich wiederhergestellt!\n{{count}} Listen wurden wiederhergestellt.",
        success_other:
          "Backup wurde erfolgreich wiederhergestellt!\n{{count}} Listen wurden wiederhergestellt.",
        error: "Fehler beim Wiederherstellen deiner Listen",
      },
      restoreAllUsers: {
        button: "Alle Daten (Disk) laden",
        tooltip: "Alle Benutzer aus dem Backup wiederherstellen",
        processing: "Wird verarbeitet...",
        success:
          "Backup wurde erfolgreich wiederhergestellt!\nWiederhergestellt: {{restored}}/{{total}} Benutzer.\nFehlgeschlagen: {{failed}}.",
        error: "Fehler beim Wiederherstellen aller Benutzer",
      },
      authorizeGoogle: {
        button: "Google autorisieren",
        tooltip: "Google Drive-Zugriff autorisieren",
        processing: "Autorisierung wird verarbeitet...",
        success: "Google Drive-Autorisierung erfolgreich!",
        error: "Fehler bei der Google Drive-Autorisierung",
      },
      uploadAllUsersToGoogleDrive: {
        button: "Auf Google Drive hochladen",
        tooltip: "Backup auf Google Drive hochladen",
        uploading: "Backup wird auf Google Drive hochgeladen...",
        success: "Backup erfolgreich auf Google Drive hochgeladen!",
        error: "Fehler beim Hochladen des Backups",
        notAuthorized: "Nicht mit Google Drive autorisiert",
      },
      restoreBackupFromGoogleDrive: {
        button: "Von Google Drive wiederherstellen",
        tooltip: "Backup von Google Drive wiederherstellen",
        restoring: "Backup wird von Google Drive wiederhergestellt...",
        success:
          "Backup wurde wiederhergestellt! {{count}} Listen wurden wiederhergestellt.",
        error: "Fehler beim Wiederherstellen des Backups",
        notAuthorized: "Nicht mit Google Drive autorisiert",
      },
      listGoogleDriveBackups: {
        loading: "Backup-Liste wird abgerufen...",
        selectBackup: "Backup zum Wiederherstellen auswählen",
        buttons: {
          prev: "Zurück",
          next: "Weiter",
          cancel: "Abbrechen",
        },
        tooltips: {
          restore: "Backup wiederherstellen",
          delete: "Backup von Google Drive löschen",
        },
        error: "Fehler beim Abrufen der Backup-Liste",
        errorDelete: "Fehler beim Löschen des Backups",
        noBackups: "Keine Backup-Dateien auf Google Drive gefunden",
        notAuthorized: "Nicht mit Google Drive autorisiert",
      },
      restoreSelectedBackup: {
        restoring: "Backup von Google Drive wird wiederhergestellt...",
        success:
          "Backup wiederhergestellt!\n{{restored}} Benutzer wiederhergestellt, {{failed}} fehlgeschlagen ({{total}} insgesamt)",
        error: "Fehler beim Wiederherstellen des Backups",
        notAuthorized: "Keine Berechtigung für Google Drive",
      },
    },
  },
  confirmationPage: {
    message: {
      success: "Registrierung erfolgreich.",
      error: "Registrierung fehlgeschlagen.",
    },
    closeTab:
      "Schließe diesen Tab und kehre zum zuvor geöffneten Browser zurück.",
    tryAgain: "Versuchen Sie es später erneut.",
    home: "Startseite",
  },
  accountRecoveryPage: {
    title: "Passwort ändern",
    subTitle: "Neues Passwort eingeben",
    message: {
      success: "Konto wurde wiederhergestellt.",
      error: "Der Link ist abgelaufen oder wurde bereits verwendet.",
    },
    closeTab:
      "Schließe diesen Tab und kehre zum zuvor geöffneten Browser zurück.",
    tryAgain: "Versuchen Sie es später erneut.",
    home: "Startseite",
  },
  userInvitationPage: {
    title: "Kontoaktivierung - To-do list",
    subTitle: "Legen Sie ein Passwort für Ihr Konto fest",
    message: {
      error: "Der Link ist abgelaufen oder wurde bereits verwendet.",
    },
    tryAgain: "Versuchen Sie es später erneut.",
    home: "Startseite",
  },
  modal: {
    buttons: {
      confirmButton: "Bestätigen",
      cancelButton: "Abbrechen",
      cancelEdit: "Bearbeiten abbrechen",
      deleteButton: "Löschen",
      closeButton: "Schließen",
      logoutButton: "Abmelden",
      nextButton: "Weiter",
      refreshButton: "Aktualisieren",
      replaceButton: "Ersetzen",
      addButton: "Hinzufügen",
      yesButton: "Ja",
      noButton: "Nein",
      loading: "Wird geladen...",
      environmentResetTrigger: "Gerätekonfiguration zurücksetzen",
      environmentResetConfirm: "Reset bestätigen",
    },
    notifications: {
      title: "Benachrichtigung planen",
      label: "Aufgabenerinnerung 🕒",
      button: "🔍 App öffnen",
      confirm: "Planen",
      taskContent: "Aufgabe",
      dateLabel: "Datum und Uhrzeit auswählen:",
      pastDateError:
        "Benachrichtigungen können nicht in der Vergangenheit geplant werden. Bitte wählen Sie ein zukünftiges Datum.",
      permissionBlocked:
        "Benachrichtigungen sind in Ihrem Browser blockiert. Bitte schalten Sie diese frei, indem Sie auf das Schlosssymbol neben der Adressleiste klicken, um Aufgaben planen zu können.",
      notLoggedIn:
        "Sie müssen angemeldet sein, um eine Benachrichtigung einzustellen.",
      error: "Fehler beim Planen der Benachrichtigung.",
      scheduledTitle: "Geplante Erinnerungen:",
      confirmDelete:
        "Sind Sie sicher, dass Sie diese Benachrichtigung löschen möchten?",
      deleteError: "Fehler beim Löschen der Benachrichtigung.",
      cancelTooltip: "Erinnerung abbrechen",
      editTooltip: "Erinnerung bearbeiten",
      confirmUpdate: "Aktualisieren",
      loading: "Wird geladen...",
      refresh: "Aktualisieren",
      listLabel: "Liste",
      fetchError: "Fehler beim Abrufen der Benachrichtigungen.",
      noScheduled: "Keine geplanten Benachrichtigungen.",
    },
    environmentReset: {
      title: "Reset lokaler Parameter",
      warningBody:
        "Wenn das System na DIESEM Gerät nicht ordnungsgemäß funktioniert, können Sie mit diesem Vorgang die technische Konfiguration aktualisieren. \n\n• In der Cloud geplante Benachrichtigungen bleiben weiterhin aktiv.\n• Benutzerdaten und Aufgaben bleiben unangetastet.\n\nVerwenden Sie diese Option nur zu Diagnosezwecken.",
      operationsTitle: "Diagnostischer Umfang:",
      operations: {
        sw: "Abmelden von Hilfsskripten (SW)",
        cache: "Cache-Speicher leeren",
        indexedDB: "OneSignal SDK-Datenbank aktualisieren",
        storage: "Lokale technische Einstellungen löschen",
        cookies: "Diagnose-Cookies entfernen",
        reload: "Vollständige Aktualisierung",
      },
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
        info: "Ein Link zum Zurücksetzen des Passworts wurde an die angegebene E-Mail-Adresse gesendet.<br/>Wenn du keine Nachricht erhalten hast, versuche es in 15 Minuten erneut.",
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
    accountSwitch: {
      title: "Konto wechseln",
      message: {
        loading: "Konto wird gewechselt...",
        success: "Erfolgreich zum Konto gewechselt: <strong>{{email}}</strong>",
        error: {
          default: "Fehler beim Wechseln des Kontos.",
          sessionExpired:
            "Die Sitzung dieses Kontos ist abgelaufen. Bitte melden Sie sich erneut bei diesem Konto an, um den Zugriff zu aktualisieren.",
        },
      },
    },
    userInvitation: {
      title: "Kontoaktivierung",
      message: {
        loading: "Konto wird aktiviert...",
        success:
          "Ihr Konto wurde aktiviert. Sie können sich ab sofort mit Ihrer E-Mail-Adresse: <strong>{{email}}</strong> und dem bei der Aktivierung festgelegten Passwort in der App anmelden.",
        error: {
          default: "Fehler bei der Kontoaktivierung.",
        },
      },
    },
    masterIdUnification: {
      title: "Kontozusammenführung",
      message: {
        info: "Ihre Geräte wurden erfolgreich zu einem Profil verknüpft. Ihre geplanten Benachrichtigungen sind nun auf allen Ihren Geräten verfügbar.",
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
          "Die Liste <strong>{{name}}</strong> existiert bereits.<br/>Möchtest du sie ersetzen?",
        cancel: "Ändere den Namen der Liste und speichere sie erneut.",
        loading:
          "Liste <strong>{{name}}</strong> wird in der Datenbank gespeichert...",
        success:
          "Liste <strong>{{name}}</strong> wurde in der Datenbank gespeichert.",
        error: {
          conflict:
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/>Versuche es erneut.",
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
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/>Versuche es erneut.",
          default: "Fehler beim Löschen der Liste.",
        },
      },
    },
    imageRemove: {
      title: "Foto löschen",
      message: {
        confirm: "Möchtest du das Foto wirklich löschen?",
        loading: "Foto wird gelöscht...",
        success: "Das Foto wurde gelöscht.",
        error: {
          default: "Fehler beim Löschen des Fotos.",
        },
      },
    },
    deleteBackup: {
      title: "Sicherung löschen",
      message: {
        confirm:
          "Möchtest du die Sicherung <strong>{{name}}</strong> wirklich löschen?",
        loading: "Sicherung wird gelöscht...",
        success: "Die Sicherung wurde gelöscht.",
        error: "Fehler beim Löschen der Sicherung.",
      },
    },
    restoreBackup: {
      title: "Sicherung wiederherstellen",
      message: {
        confirm:
          "Möchtest du die Sicherung <strong>{{name}}</strong> wirklich wiederherstellen?<br/><br/><small>Hinweis: Die aktuellen Daten werden durch die Daten aus der Sicherung ersetzt.</small>",
        loading: "Sicherung wird wiederhergestellt...",
        success: "Die Sicherung wurde wiederhergestellt.",
        error: "Fehler beim Wiederherstellen der Sicherung.",
      },
    },
    listsUpdate: {
      title: "Liste aktualisieren",
      message: {
        loading: "Liste wird aktualisiert...",
        success: "Die Liste wurde aktualisiert.",
        error: {
          conflict:
            "Die Operation konnte nicht korrekt ausgeführt werden, da die Listen veraltet sind.<br/>Versuche es erneut.",
          default: "Fehler beim Aktualisieren der Liste.",
        },
      },
    },
    listLoad: {
      title: "Liste laden",
      message: {
        info: "Die Liste <strong>{{name}}</strong> wurde zum Bearbeiten geladen.",
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
        name: "Name:",
        email: "E-Mail:",
        message: "Nachricht:",
      },
      placeholders: {
        name: "Geben Sie Ihren Namen ein",
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
      autoReply: {
        lang: "de",
        greeting: "Vielen Dank für Ihre Nachricht!",
        intro:
          "Ihre Nachricht ist bei mir eingegangen. Ich werde so schnell wie möglich antworten – in der Regel innerhalb von 1–2 Werktagen.",
        messageLabel: "Ihre Nachricht",
        regards: "Mit freundlichen Grüßen,\nMariusz Matusiewicz",
        footer:
          "Diese Nachricht wurde automatisch über das Kontaktformular der To-Do List App erstellt. Bitte antworten Sie nicht direkt auf diese Nachricht.",
      },
    },
    backupAuthError: {
      title: "Automatischer Backup-Fehler",
      message:
        "Die automatischen Sicherungen wurden aufgrund von Problemen mit der Google Drive-Autorisierung eingestellt. <br/><br/>Bitte gehen Sie zum Sicherungsabschnitt unten und klicken Sie auf die Schaltfläche <strong>Google autorisieren</strong>, um den Zugriff zu erneuern.",
    },
    offline: {
      title: "Keine Verbindung",
      message:
        "Kein Internetzugang. Sie haben Zugriff auf lokale Aufgaben und können diese bearbeiten – die Änderungen werden synchronisiert, sobald die Verbindung wiederhergestellt ist.",
    },
  },
  updateNotification: {
    message: "Eine neue Version der App ist verfügbar",
    button: "Aktualisieren",
  },
  prepareText: {
    period: "Punkt",
    comma: "Komma",
    enter: "Eingabetaste",
  },
};

export default langDe;
