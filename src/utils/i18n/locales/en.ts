import langPl from "./pl";

const langEn: typeof langPl = {
  navigation: {
    tasksPage: "Tasks",
    lists: "Lists",
    info: "Info",
  },
  listFrom: "List from",
  currentList: "current",
  currentDate: { description: "Today is " },
  currentTaskCount: {
    tasks: "{{count}}\u00A0task",
    tasks_few: "{{count}}\u00A0tasks",
    tasks_many: "{{count}}\u00A0tasks",
    tasks_other: "{{count}}\u00A0tasks",
  },
  tasksPage: {
    title: "Task List",
    form: {
      title: {
        addTask: "Add new task",
        editTask: "Edit task",
      },
      buttons: {
        fetchExampleTasks: "Fetch example tasks",
        loadFromArchive: "Restore from archive",
        loading: "Loading...",
        error: "Error loading data",
      },
      inputPlaceholder: "What to do?",
      inputButton: {
        addTask: "Add task",
        saveChanges: "Save",
        cancel: "Cancel",
      },
    },
    search: {
      title: "Search",
      buttons: {
        hide: "Hide filter",
        show: "Show filter",
        clear: "Clear filter",
      },
      inputPlaceholder: "Filter tasks",
    },
    tasks: {
      defaultListName: "New list",
      inputPlaceholder: "Enter list name",
      buttons: {
        titleButtons: {
          change: "Change list name",
          save: "Save",
        },
        save: "Save list",
        clear: "Clear list",
        hide: "Hide done",
        show: "Show done",
        allDone: "Mark all as done",
        allUndone: "Mark all as undone",
        sort: "Enable sorting",
        notSort: "Disable sorting",
        undo: "Undo",
        redo: "Redo",
      },
    },
  },
  taskPage: {
    title: "Task details",
    noContent: "Task not found 😥",
    done: {
      title: "Done",
      yes: "Yes",
      no: "No",
    },
    dateCreated: "Date created",
    dateEdited: "Date edited",
    dateDone: "Date completed",
    backButton: "Back",
  },
  archivedListsPage: {
    title: "Archived lists",
    lists: {
      select: "Select a list",
      empty: "You have no archived lists 😯",
    },
    buttons: {
      load: "Load selected list",
    },
    subTitle: "Selected list (preview)",
  },
  remoteListsPage: {
    title: "My lists",
    lists: {
      select: "Select a list",
      empty: "You have no remote lists 😯",
    },
    buttons: {
      load: "Edit selected list",
      sort: "Enable sorting",
      notSort: "Disable sorting",
    },
    subTitle: "Selected list (preview)",
  },
  infoPage: {
    aboutApp: {
      title: "About the App",
      topics: {
        features: {
          subTitle: "Key Features:",
          description: {
            part1:
              "<strong>Task Management</strong>: <br/>adding, editing, deleting, marking as completed, undoing and redoing changes.",
            part2:
              "<strong>Search and Filtering</strong>: <br/>ability to search tasks with options to show/hide filters and clear them.",
            part3:
              "<strong>List Management</strong>: <br/>creating, saving, and loading task lists from the MongoDB database.",
            part4:
              "<strong>Multilingual Support</strong>: <br/>interface available in Polish, English, and German thanks to react-i18next.",
            part5:
              "<strong>User Account Management</strong>: <br/>registration, login, password reset and change, account deletion via Netlify GoTrue.",
            part6:
              "<strong>Voice Task Input</strong>: <br/>ability to enter task content using speech recognition (Web Speech API).",
          },
        },
        technologies: {
          subTitle: "Technologies:",
        },
        links: {
          subTitle: "Available versions:",
          description: {
            newApp: "New version:",
            oldApp: "Older version:",
          },
        },
      },
    },
    aboutAuthor: {
      title: "About the author",
      name: "Mariusz Matusiewicz",
      description: {
        part1:
          "Creating front-end applications is my passion, especially with <strong>React</strong>. I love exploring new technologies and continuously improving my skills. My greatest satisfaction comes from designing intuitive and aesthetically pleasing interfaces that make users' lives easier.",
        part2:
          "Beyond programming, I love the mountains. Hiking is my way to relax and recharge. The <strong>Bieszczady</strong> Mountains are especially close to my heart—their tranquility and natural beauty inspire me every time I return. I combine my passion for technology with my curiosity about the world. Thanks to this, I eagerly take on new challenges that help me grow and create projects I can be proud of. 😊🚀",
      },
      links: {
        subTitle: "Links",
        description: {
          personalHomepage: "Personal website:",
          github: "GitHub:",
        },
      },
    },
    contactForm: {
      title: "Contact",
      subTitle: "Got a question or suggestion? ✉️ Drop me a message!",
    },
  },
  accountPage: {
    title: "User Panel",
    notLoggedIn: "You are not logged in",
    buttons: {
      register: "Register",
      login: "Login",
      accountDelete: "Delete account",
      passwordChange: "Change password",
      resetPassword: "Reset password",
      cancel: "Cancel",
    },
    toggleButtons: {
      show: "Expand section",
      hide: "Collapse section",
    },
    deviceCount: {
      device: "You are logged in on {{count}} device",
      device_few: "You are logged in on {{count}} devices",
      device_many: "You are logged in on {{count}} devices",
      device_other: "You are logged in on {{count}} devices",
    },
    userDeviceCount: {
      device: "logged in on {{count}} device",
      device_few: "logged in on {{count}} devices",
      device_many: "logged in on {{count}} devices",
      device_other: "logged in on {{count}} devices",
    },
    activeUsers: {
      label: "Logged in users",
      summaryTitle: "User activity overview",
      count: "Number of active users: {{count}}",
      count_few: "Number of active users: {{count}}",
      count_many: "Number of active users: {{count}}",
      count_other: "Number of active users: {{count}}",
    },
    allDevices: {
      device: "Total active devices: {{count}}",
      device_few: "Total active devices: {{count}}",
      device_many: "Total active devices: {{count}}",
      device_other: "Total active devices: {{count}}",
    },
    form: {
      buttons: {
        login: "Log in",
        logout: "Logout",
        register: "Register",
        save: "Save",
        reset: "Reset password",
      },
      inputPlaceholders: {
        email: "Enter email address",
        password: "Enter password",
        newPassword: "New password",
      },
      message: {
        email: "Enter email address",
        emailMessage: "Invalid email address",
        password: "Enter password",
        passwordMessage: "Password must be at least 4 characters long",
      },
    },
    sessionInfo: {
      title: "Session Information",
      createdAt: "Account created",
      confirmedAt: "Email confirmed",
      tokenTitle: "Authentication Token",
      tokenExpiresAt: "Token expires at",
      tokenExpiresIn: "Token expires in",
      tokenStatus: "Token status",
      tokenActive: "Token is active",
      tokenExpired: "Token expired",
    },
    autoRefresh: {
      label: "Stay logged in",
      enabledDescription: "The token will refresh automatically",
      disabledDescription: "You will be logged out when the token expires",
    },
    backup: {
      title: "Backup & Restore",
      downloadUserLists: {
        button: "Download my lists",
        tooltip: "Download only your lists to your computer",
        downloading: "Downloading your lists...",
        success: "Your lists have been downloaded!",
        error: "Error downloading your lists",
      },
      downloadAllUsers: {
        button: "Download all users",
        tooltip: "Download all users' lists to your computer",
        downloading: "Downloading all users' lists...",
        success: "All users' lists have been downloaded!",
        error: "Error downloading all users' lists",
      },
      restoreUserLists: {
        button: "Restore my lists",
        tooltip: "Restore only your lists from a file on your computer",
        processing: "Processing your lists...",
        success: "Backup has been restored!\nRestored {{count}} lists.",
        success_few: "Backup has been restored!\nRestored {{count}} lists.",
        success_many: "Backup has been restored!\nRestored {{count}} lists.",
        success_other: "Backup has been restored!\nRestored {{count}} lists.",
        error: "Error while restoring your lists",
      },
      restoreAllUsers: {
        button: "Restore all users",
        tooltip: "Restore all users from backup",
        processing: "Processing...",
        success:
          "Backup has been restored!\nRestored: {{restored}}/{{total}} users.\nFailed: {{failed}}.",
        error: "Error while restoring all users",
      },

      authorizeGoogle: {
        button: "Authorize Google",
        tooltip: "Authorize Google Drive access",
        processing: "Processing authorization...",
        success: "Google Drive authorization successful!",
        error: "Error during Google Drive authorization",
      },
      uploadAllUsersToGoogleDrive: {
        button: "Upload to Google Drive",
        tooltip: "Upload backup to Google Drive",
        uploading: "Uploading backup to Google Drive...",
        success: "Backup uploaded to Google Drive successfully!",
        error: "Error uploading backup",
        notAuthorized: "Not authorized to Google Drive",
      },
      restoreBackupFromGoogleDrive: {
        button: "Restore from Google Drive",
        tooltip: "Restore backup from Google Drive",
        restoring: "Restoring backup from Google Drive...",
        success: "Backup has been restored! Restored {{count}} lists.",
        error: "Error restoring backup",
        notAuthorized: "Not authorized to Google Drive",
      },
      listGoogleDriveBackups: {
        selectBackup: "Select a backup to restore",
        buttons: {
          prev: "Back",
          next: "Next",
          cancel: "Cancel",
        },
        tooltips: {
          restore: "Przywróć kopię zapasową",
          delete: "Usuń kopię zapasową z Google Drive",
        },
        error: "Error fetching backup list",
        errorDelete: "Error deleting backup",
        noBackups: "No backup files found on Google Drive",
        notAuthorized: "Not authorized to Google Drive",
      },
      restoreSelectedBackup: {
        restoring: "Restoring backup from Google Drive...",
        success:
          "Backup restored!\n{{restored}} users restored, {{failed}} failed ({{total}} total)",
        error: "Error while restoring backup",
        notAuthorized: "Not authorized to Google Drive",
      },
    },
  },
  confirmationPage: {
    message: {
      success:
        "Registration successful.<br/> You can return to the previously opened tab.",
      error: "Registration failed.",
    },
    closeTab: "You can now close this tab and return to your previous browser.",
    tryAgain: "Try again later.",
    home: "Home",
  },
  accountRecoveryPage: {
    title: "Change password",
    subTitle: "Enter new password",
    message: {
      success:
        "Account has been recovered.<br/> You can return to the previously opened tab.",
      error: "Link has expired or has been used.",
    },
    closeTab: "You can now close this tab and return to your previous browser.",
    tryAgain: "Try again later.",
    home: "Home",
  },
  modal: {
    buttons: {
      confirmButton: "Confirm",
      cancelButton: "Cancel",
      deleteButton: "Delete",
      closeButton: "Close",
      logoutButton: "Logout",
      nextButton: "Next",
      refreshButton: "Refresh",
      replaceButton: "Replace",
      addButton: "Add",
      yesButton: "Yes",
      noButton: "No",
    },
    login: {
      title: "Login",
      message: {
        loading: "Logging in...",
        success: "Logged in as: <strong>{{user}}</strong>",
        error: {
          default: "Login error",
        },
      },
    },
    logout: {
      title: "Logout",
      message: {
        confirm: "Are you sure you want to log out?",
        loading: "Logging out...",
        success: "You have been logged out.",
        error: {
          default: "Logout error.",
        },
      },
    },
    passwordChange: {
      title: "Change password",
      message: {
        loading: "Changing password...",
        success: "Password has been changed.",
        error: {
          default: "Error changing password.",
        },
      },
    },
    accountRegister: {
      title: "Account registration",
      message: {
        loading: "Registering...",
        info: "An email has been sent to the provided email address to register an account.",
        error: {
          userExists: "User with this email address is already registered.",
          default: "Registration error.",
        },
      },
    },
    accountRecovery: {
      title: "Account recovery",
      message: {
        loading: "Recovering account...",
        info: "A password reset link has been sent to your email address.<br/> If you don't receive it, please try again in 15 minutes.",
        success: "Account has been recovered, set a new password.",
        error: {
          default: "Password recovery error.",
          linkExpired: "The link has expired or has been used.",
        },
      },
    },
    accountDelete: {
      title: "Deleting account",
      message: {
        confirm: "Are you sure you want to delete your account?",
        loading: "Deleting account...",
        success: "Account has been deleted.",
        error: {
          default: "Error deleting account.",
        },
      },
    },
    dataRemoval: {
      title: "Data removal",
      message: {
        confirm: "Do you want to remove all data from the application?",
        info: "All data has been removed.",
      },
    },
    listsDownload: {
      title: "Downloading lists",
      message: {
        loading: "Downloading lists...",
        success: "Lists have been downloaded.",
        error: {
          default: "An error occurred while downloading lists.",
        },
      },
    },
    listSave: {
      title: "Saving list",
      message: {
        confirm:
          "The list <strong>{{name}}</strong> already exists.<br/> Do you want to replace it?",
        cancel: "Change the name of the list and save again.",
        loading: "Saving list <strong>{{name}}</strong> to the database...",
        success:
          "List <strong>{{name}}</strong> has been saved to the database.",
        error: {
          conflict:
            "The operation could not be completed correctly because the lists were outdated.<br/> Try again.",
          default: "An error occurred while adding the list to the database.",
        },
      },
    },
    archiveTasks: {
      title: "Archiving tasks",
      message: {
        confirm: "Do you want to move the current tasks to the archive?",
      },
    },
    listRemove: {
      title: "Deleting list",
      message: {
        confirm:
          "Are you sure you want to delete the list: <strong>{{name}}</strong> ?",
        loading: "Deleting list...",
        success: "The list has been removed from the database.",
        error: {
          conflict:
            "The operation could not be completed correctly because the lists were outdated.<br/> Try again.",
          default: "An error occurred while deleting the list.",
        },
      },
    },
    deleteBackup: {
      title: "Deleting backup",
      message: {
        confirm:
          "Are you sure you want to delete the backup: <strong>{{name}}</strong> ?",
        loading: "Deleting backup...",
        success: "The backup has been deleted.",
        error: "An error occurred while deleting the backup.",
      },
    },
    listsUpdate: {
      title: "Updating list",
      message: {
        loading: "Updating list...",
        success: "The list has been updated in the database.",
        error: {
          conflict:
            "The operation could not be completed correctly because the lists were outdated.<br/> Try again.",
          default: "An error occurred while updating the list.",
        },
      },
    },
    listLoad: {
      title: "Loading list",
      message: {
        info: "The list <strong>{{name}}</strong> has been loaded.",
      },
    },
    confirmation: {
      title: "Registration confirmation",
      message: {
        loading: "Checking registration status...",
        success: "Registration successful, close the page.",
        error: {
          default: "The link has expired or has been used.",
        },
      },
    },
    sendMessage: {
      title: "Send message",
      labels: {
        email: "Email:",
        message: "Message:",
      },
      placeholders: {
        email: "Enter your email address",
        message: "Enter your message",
      },
      message: {
        loading: "Sending message...",
        success: "Message has been sent.",
        error: {
          default: "Error sending message.",
        },
      },
      button: "Send",
    },
  },
  prepareText: {
    period: "period",
    comma: "comma",
  },
};

export default langEn;
