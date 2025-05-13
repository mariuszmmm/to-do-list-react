import langPl from "./pl";

const langEn: typeof langPl = {
  navigation: {
    tasksPage: "Tasks",
    lists: "Lists",
    info: "Info",
  },
  currentDate: { desc: "Today is " },
  tasksPage: {
    title: "Task List",
    form: {
      title: {
        addTask: "Add new task",
        editTask: "Edit task",
      },
      buttons: {
        fetchExampleTasks: "Fetch example tasks",
        loading: "Loading...",
        error: "Error loading data",
      },
      inputPlaceholder: "What to do ?",
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
        allDone: "Done all",
        allUndone: "Undone all",
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
    dateCreated: "Date of creation",
    dateEdited: "Date of modification",
    dateDone: "Date of completion",
  },
  listsPage: {
    title: "Saved lists",
    lists: {
      select: "Select a list",
      empty: "You have no saved lists 😯",
    },
    buttons: {
      load: "Load selected list",
      sort: "Enable sorting",
      notSort: "Disable sorting",
    },
    subTitle: "Selected list",
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
      title: "About author",
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
    title: "Your account",
    notLoggedIn: "You are not logged in",
    buttons: {
      register: "Registration",
      login: "Login",
      accountDelete: "Delete account",
      passwordChange: "Change password",
      resetPassword: "Reset password",
      cancel: "Cancel",
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
        email: "enter email address",
        password: "enter password",
        newPassword: "new password",
      },
      message: {
        email: "enter email address",
        emailMessage: "invalid email address",
        password: "enter password",
        passwordMessage: "password must be at least 4 characters long",
      },
    },
  },
  confirmationPage: {
    message: {
      success:
        "Registration successful.<br/> You can return to the previously opened tab.",
      error: "Registration failed.",
    },
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
          "The list <strong>{{listName}}</strong> already exists.<br/> Do you want to replace it?",
        cancel: "Change the name of the list and save again.",
        loading: "Saving list <strong>{{listName}}</strong> to the database...",
        success:
          "List <strong>{{listName}}</strong> has been saved to the database.",
        error: {
          conflict:
            "The operation could not be completed correctly because the lists were outdated.<br/> Try again.",
          default: "An error occurred while adding the list to the database.",
        },
      },
    },
    listRemove: {
      title: "Deleting list",
      message: {
        confirm:
          "Are you sure you want to delete the list: <strong>{{listName}}</strong> ?",
        loading: "Deleting list...",
        success: "The list has been removed from the database.",
        error: {
          conflict:
            "The operation could not be completed correctly because the lists were outdated.<br/> Try again.",
          default: "An error occurred while deleting the list.",
        },
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
        info: "The list <strong>{{listName}}</strong> has been loaded from the database.",
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
