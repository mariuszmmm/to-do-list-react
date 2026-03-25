import langPl from "./pl";

const langEn: typeof langPl = {
  navigation: {
    tasksPage: "Tasks",
    lists: "Lists",
    info: "Info",
  },
  listFrom: "List from",
  currentList: "active",
  online: "online",
  offline: "offline",
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
    showMore: "Show more",
    showLess: "Show less",
  },
  taskImagePage: {
    title: "Task Image",
    noTask: "Task not found 😥",
    buttons: {
      add: "Add",
      change: "Change",
      remove: "Remove",
      back: "Back",
      uploadFromDevice: "Upload from device",
      takePicture: "Take a picture",
      cancel: "Cancel",
      capture: "Capture",
      close: "Close",
    },
    messages: {
      uploading: "Uploading…",
      loading: "Loading…",
      removing: "Removing…",
      cameraPermissionDenied:
        "Camera access denied. Please allow camera access in your browser settings.",
      cameraNotFound:
        "No camera device found. Please check your camera connection.",
      cameraError: "An error occurred while accessing the camera.",
      error: {
        imageUploadError: "Error uploading image",
        imageDeleteError: "Error deleting image",
        notAuthenticated: "You must be logged in to upload an image",
        uploadInvalidResponse: "Server error while uploading the image",
        moveFailed: "Failed to move image to folder",
        noFileSelected: "No file selected",
        invalidFileType: "Invalid file type. Allowed: {{allowedTypes}}",
        fileTooLarge: "File is too large. Maximum size: {{maxSize}} MB",
        uploadCanceled: "Image upload canceled",
        unknownError: "Unknown error",
      },
    },
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
    howToStart: {
      title: "How to Start?",
      subTitle: "First steps:",
      steps: {
        step1: {
          title: "1. Start Creating",
          description:
            "In the 'What to do?' field, enter the task content. You can also dictate the task – click the microphone icon. You can edit tasks (pencil), delete them (trash), and mark them as completed.",
        },
        step2: {
          title: "2. Log In",
          description:
            "Create an account so you don't lose your data. In the login window, check the 'Stay logged in' option, so the app remembers you for longer and you won't have to enter your password every visit.",
        },
        step3: {
          title: "3. Zapisuj w chmurze",
          description:
            "As a logged-in user, you can save your current list to the database by clicking the 'Save list' button. Your data will be secure and available on all your devices.",
        },
        step4: {
          title: "4. Manage Lists",
          description:
            "On the 'Lists' page, you will find all your saved collections. You can sort them, delete them, or preview their content at the bottom of the page. Click 'Edit selected list' to load it into the main view.",
        },
        step5: {
          title: "5. Add Photos",
          description:
            "You can attach a photo or graphic to each task. Simply click the camera icon on the selected task to open the image management panel.",
        },
        step6: {
          title: "6. Install the App",
          description:
            "On your phone, you can use To-Do List like a regular app. Click the 'three dots' in the corner of your browser and select 'Add to Home screen'. The app icon will appear on your desktop.",
        },
        step7: {
          title: "7. Schedule Notifications",
          description:
            "Don't want to forget about a task? Click the notification bell icon on the selected task and schedule a reminder. The app will send you a Push notification and an email at the designated time.",
        },
      },
    },
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
            part7:
              "<strong>Task Attachments</strong>: <br/>ability to attach images to tasks (powered by Cloudinary).",
            part8:
              "<strong>Drag & Drop</strong>: <br/>intuitively reorder users' tasks and lists (powered by @dnd-kit).",
            part9:
              "<strong>Real-time Sync</strong>: <br/>instant updates across devices using Ably.",
            part10:
              "<strong>Archived Lists & Backup</strong>: <br/>archive lists and backup to Google Drive or local storage.",
            part11:
              "<strong>Scheduled Notifications</strong>: <br/>ability to set task reminders via Push notifications and email (powered by OneSignal).",
          },
        },
        technologies: {
          subTitle: "Technologies:",
        },
        links: {
          subTitle: "Application Versions:",
          description: {
            newApp: "Latest version (Netlify):",
            oldApp: "Archived Version (GitHub Pages):",
          },
        },
      },
    },
    aboutAuthor: {
      title: "About the author",
      name: "Mariusz Matusiewicz",
      description: {
        part1:
          "Frontend development is my passion, especially using <strong>React</strong>. I love exploring new technologies and constantly improving my skills. My head is always full of ideas for new features for the apps I'm working on, which really drives me forward.",
        part2:
          "Outside of programming, I love the mountains. Hiking is the best way for me to rest and recharge my batteries. The <strong>Bieszczady</strong> Mountains are particularly close to my heart – their peace and natural beauty inspire me every time I return there. Combining my love for technology with curiosity about the world, I enthusiastically take on new challenges and create projects I can be proud of. 😊🚀",
      },
      links: {
        subTitle: "External Links",
        description: {
          personalHomepage: "Official Portfolio:",
          github: "GitHub Profile:",
        },
      },
    },
    contactForm: {
      title: "Contact",
      subTitle: "Drop me a message! ✉️",
    },
  },
  accountPage: {
    title: "User Panel",
    notLoggedIn: "You are not logged in",
    environmentReset: {
      title: "Configuration Reset",
    },
    switcher: {
      title: "Saved accounts",
      active: "Active",
      switch: "Switch",
      forget: "Remove from device",
      addAccount: "Log in another account",
      confirmForget:
        "Are you sure you want to remove this account from this device (forget)?",
      unnamedAccount: "Unnamed account",
      switchListTitle: "Switch account",
    },
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
      summaryLabel: "User accounts",
      count_few: "Number of active users: {{count}}",
      count_many: "Number of active users: {{count}}",
      count_other: "Number of active users: {{count}}",
    },
    userManagement: {
      title: "User Management",
      invite: {
        label: "Invite next user",
        placeholder: "Enter email address",
        button: "Send invitation",
        success: "Invitation sent successfully!",
        error: "Error sending invitation.",
      },
      users: {
        title: "User List",
        loading: "Loading...",
        empty: "No users in database.",
        deleteButton: "Delete",
        deleteConfirm: "Are you sure?",
        deleteSuccess: "Account has been deleted.",
        deleteError: "Error deleting account.",
        status: {
          active: "Active",
          pending: "Pending",
          deleted: "Deleted",
        },
      },
    },
    allDevices: {
      summaryLabel: "Active devices",
      device: "Total active devices: {{count}}",
      device_few: "Total active devices: {{count}}",
      device_many: "Total active devices: {{count}}",
      device_other: "Total active devices: {{count}}",
    },
    systemConsole: {
      title: "System Console (LOGS)",
      preserveLogs: "Preserve log",
      clear: "Clear",
    },
    systemAdmin: {
      title: "System & Maintenance",
      ablyStatus: {
        connected: "Connected",
        connecting: "Connecting...",
        disconnected: "Disconnected",
        failed: "Connection failed",
      },
      ably: {
        title: "Communication & Sync (Ably)",
        state: "Connection State: {{state}}",
        messagesUsage: "Messages Limit (Monthly)",
        connectionsUsage: "Concurrent Connections",
        labels: {
          status: "Connection State",
        },
      },
      database: {
        title: "Database (MongoDB)",
        cleanButton: "Run task cleanup",
        cleanLogsButton: "Run log cleanup",
        cleaning: "Cleaning...",
        users: "Users: {{count}}",
        lists: "Lists: {{count}}",
        tasks: "Tasks: {{count}}",
        dataSize: "Data Size: {{size}} MB",
        storageSize: "Disk Usage: {{size}} MB",
        indexSize: "Index Size: {{size}} MB",
        usage: "MongoDB Storage Usage (Limit 512MB)",
        labels: {
          dataSize: "Data Size",
          storageSize: "Disk Usage",
          indexSize: "Index Size",
          users: "Users",
          lists: "Lists",
          tasks: "Tasks",
        },
        results: {
          cleaned: "Cleaned records",
          deletedCount: "Deleted logs",
          modifiedCount: "Deleted tasks",
        },
      },
      storage: {
        title: "Image Storage (Cloudinary)",
        lastCleanup: "Last cleanup: {{date}}",
        never: "never",
        cleanButton: "Run cleanup",
        cleaning: "Cleaning...",
        bandwidthLabel: "Cloudinary Bandwidth Usage (25 GB Limit)",
        storageLabel: "Cloudinary Storage Usage (25 GB Limit)",
        transformationsLabel: "Transformation Usage (25,000 Limit)",
        resources: "Files: {{used}} / {{limit}}",
        transformations: "Transformations: {{used}} / {{limit}}",
        bandwidth: "Bandwidth: {{used}} GB / {{limit}} GB",
        credits: "Credits: {{used}} / {{limit}} ({{percent}}%)",
        creditsUsage: "Cloudinary Credits (Limit 25)",
        nextBillingPeriod: "Credits renew: Monthly",
        creditBreakdownLabel: "Credit Usage Breakdown",
        success: "Cleanup completed successfully!",
        error: "Error during cleanup.",
        labels: {
          resources: "Files",
          transformations: "Transformations",
          bandwidth: "Bandwidth",
          credits: "Credits",
          impressions: "Impressions",
          storage: "Storage",
        },
        results: {
          totalCloudinaryImages: "Total Cloudinary images",
          totalMongoImages: "Images in database",
          orphansFound: "Orphans found",
          missingInCloudinary: "Missing in Cloudinary",
          cleaned: "Images removed",
        },
      },
      netlify: {
        title: "Hosting & Platform (Netlify)",
        bandwidth: "Bandwidth Usage: {{used}} / {{limit}}",
        buildMinutes: "Build Minutes: {{used}} / {{limit}}",
        functions: "Function Invocations: {{used}} / {{limit}}",
        lastDeploy: "Last Deploy: {{date}}",
        siteName: "Site Name: {{name}}",
        noData: "Netlify monitoring is not configured or data unavailable.",
        siteMonitoringError:
          "Netlify monitoring systems are currently reporting data availability issues.<br/>Some statistics may be unavailable or zeroed out.",
        bandwidthLabel: "Netlify Bandwidth Usage (100 GB Limit)",
        productionDeploysLabel: "Production Deploys (Limit 20)",
        computeLabel: "Compute (Limit 60 GB-Hrs)",
        webRequestsLabel: "Web Requests (Limit 900,000)",
        creditBandwidthLabel: "Data Transfer (Limit 30 GB)",
        creditsLabel: "Netlify Credits (Limit 300)",
        nextBillingPeriod: "Credits renew on",
        creditBreakdownLabel: "Credit Usage Breakdown",
        breakdown: {
          productionDeploys: "Production Deploys",
          compute: "Compute",
          aiInference: "AI Inference",
          bandwidth: "Data Transfer",
          webRequests: "Web Requests",
          formSubmissions: "Form Submissions",
        },
        creditUnit: "",
        units: {
          deploys: "Deploys",
          gbHrs: "GB-Hrs",
          gbs: "GBs",
          webRequests: "Web Requests",
          submissions: "Forms",
        },
        labels: {
          siteName: "Site Name",
          lastDeploy: "Last Deploy",
        },
      },
      diagnosis: {
        title: "Diagnostics & System Maintenance",
        runButton: "Run API Tests",
        running: "Testing...",
        success: "Diagnosis completed successfully!",
        error: "Error",
      },
      logs: {
        title: "Recent System Events",
        noLogs: "No events recorded",
        success: "Completed successfully",
        types: {
          autobackup: "Auto-Backup (GD)",
          manualbackup: "Manual-Backup (GD)",
          backup_disk_all: "Full Backup (Disk)",
          backup_disk_user: "User Backup (Disk)",
          restore_gd: "Restore from GD",
          restore_disk: "Restore from Disk",
          cleanup: "Orphan Image Cleanup",
          cleanup_temp: "Temp Image Cleanup",
          cleanup_tasks: "Deleted Tasks Cleanup",
          cleanup_logs: "Old Logs Cleanup",
          oauth: "Google Authorization",
          user_invite: "User Invitation",
        },
      },
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
      title: "Backup",
      downloadUserLists: {
        button: "Download my lists to disk",
        tooltip: "Download only your lists to your computer",
        downloading: "Downloading your lists...",
        success: "Your lists have been downloaded!",
        error: "Error downloading your lists",
      },
      downloadAllUsers: {
        button: "Download all data to disk",
        tooltip: "Download all users' lists to your computer",
        downloading: "Downloading all users' lists...",
        success: "All users' lists have been downloaded!",
        error: "Error downloading all users' lists",
      },
      restoreUserLists: {
        button: "Restore my lists from disk",
        tooltip: "Restore only your lists from a file on your computer",
        processing: "Processing your lists...",
        success: "Backup has been restored!\nRestored {{count}} lists.",
        success_few: "Backup has been restored!\nRestored {{count}} lists.",
        success_many: "Backup has been restored!\nRestored {{count}} lists.",
        success_other: "Backup has been restored!\nRestored {{count}} lists.",
        error: "Error while restoring your lists",
      },
      restoreAllUsers: {
        button: "Restore all data from disk",
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
        loading: "Fetching backup list...",
        selectBackup: "Select a backup to restore",
        buttons: {
          prev: "Back",
          next: "Next",
          cancel: "Cancel",
        },
        tooltips: {
          restore: "Restore backup",
          delete: "Delete backup from Google Drive",
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
      success: "Registration successful.",
      error: "Registration failed.",
    },
    closeTab: "Close this tab and return to the previously opened browser.",
    tryAgain: "Try again later.",
    home: "Home",
  },
  accountRecoveryPage: {
    title: "Change password",
    subTitle: "Enter new password",
    message: {
      success: "Account has been recovered.",
      error: "Link has expired or has been used.",
    },
    closeTab: "Close this tab and return to the previously opened browser.",
    tryAgain: "Try again later.",
    home: "Home",
  },
  userInvitationPage: {
    title: "Account activation - To-do list",
    subTitle: "Set a password for your account",
    message: {
      error: "The link has expired or has been used.",
    },
    tryAgain: "Try again later.",
    home: "Home",
  },
  modal: {
    buttons: {
      confirmButton: "Confirm",
      cancelButton: "Cancel",
      cancelEdit: "Cancel Edit",
      deleteButton: "Delete",
      closeButton: "Close",
      logoutButton: "Logout",
      nextButton: "Next",
      refreshButton: "Refresh",
      replaceButton: "Replace",
      addButton: "Add",
      yesButton: "Yes",
      noButton: "No",
      loading: "Loading...",
      environmentResetTrigger: "Reset Device Configuration",
      environmentResetConfirm: "Confirm Reset",
    },
    notifications: {
      title: "Schedule notification",
      label: "Reminder 🕒",
      button: "🔍 Open app",
      confirm: "Schedule",
      taskContent: "Task",
      dateLabel: "Select date and time:",
      pastDateError:
        "Cannot schedule notification in the past. Please select a future date.",
      permissionBlocked:
        "Notifications are blocked in your browser. Please unlock them by clicking the lock icon next to the address bar to be able to schedule tasks.",
      notLoggedIn: "You must be logged in to set a notification.",
      error: "An error occurred while scheduling the notification.",
      scheduledTitle: "Scheduled reminders:",
      confirmDelete: "Are you sure you want to delete this notification?",
      deleteError: "Error while deleting notification.",
      cancelTooltip: "Cancel reminder",
      editTooltip: "Edit reminder",
      confirmUpdate: "Update",
      loading: "Loading...",
      refresh: "Refresh",
      listLabel: "List",
      fetchError: "Error while fetching notifications.",
      noScheduled: "No scheduled notifications.",
    },
    environmentReset: {
      title: "Local Parameter Reset",
      warningBody:
        "If the system on THIS device is malfunctioning, this operation will allow you to refresh its technical configuration. \n\n• Cloud-scheduled notifications will still be active.\n• User data and tasks will remain untouched.\n\nUse this option only for diagnostic purposes.",
      operationsTitle: "Diagnostic operation range:",
      operations: {
        sw: "Unregistering helper scripts (SW)",
        cache: "Clearing cache memory",
        indexedDB: "Refreshing OneSignal SDK database",
        storage: "Clearing local technical settings",
        cookies: "Removing diagnostic cookies",
        reload: "App environment reload",
      },
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
        info: "A password reset link has been sent to your email address.<br/>If you don't receive it, please try again in 15 minutes.",
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
    accountSwitch: {
      title: "Switching account",
      message: {
        loading: "Switching account...",
        success: "Successfully switched to account: <strong>{{email}}</strong>",
        error: {
          default: "Error switching account.",
          sessionExpired:
            "This account's session has expired. Please log in again to this account to refresh access.",
        },
      },
    },
    userInvitation: {
      title: "Account activation",
      message: {
        loading: "Activating account...",
        success:
          "Your account has been activated. You can now log in to the application using your email address: <strong>{{email}}</strong> and the password set during the activation process.",
        error: {
          default: "Error activating account.",
        },
      },
    },
    masterIdUnification: {
      title: "Account Unification",
      message: {
        info: "Your devices have been successfully linked into one profile. Your scheduled notifications will now be accessible across all your devices.",
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
          "The list <strong>{{name}}</strong> already exists.<br/>Do you want to replace it?",
        cancel: "Change the name of the list and save again.",
        loading: "Saving list <strong>{{name}}</strong> to the database...",
        success: "List <strong>{{name}}</strong> has been saved to the database.",
        error: {
          conflict:
            "Operation could not be performed because lists were outdated.<br/>Please try again.",
          default: "Error occurred while adding list to database.",
        },
      },
    },
    archiveTasks: {
      title: "Archiving tasks",
      message: {
        confirm: "Move current tasks to archive?",
      },
    },
    listRemove: {
      title: "Removing list",
      message: {
        confirm: "Are you sure you want to remove list:<br/><strong>{{name}}</strong> ?",
        loading: "Removing list...",
        success: "List has been removed from database.",
        error: {
          conflict:
            "Operation could not be performed because lists were outdated.<br/>Please try again.",
          default: "Error occurred while removing list.",
        },
      },
    },
    imageRemove: {
      title: "Removing image",
      message: {
        confirm: "Are you sure you want to remove image?",
        loading: "Removing...",
        success: "Image has been removed.",
        error: {
          default: "Error while removing image.",
        },
      },
    },
    deleteBackup: {
      title: "Deleting backup",
      message: {
        confirm: "Are you sure you want to delete backup: <strong>{{name}}</strong> ?",
        loading: "Deleting backup...",
        success: "Backup has been deleted.",
        error: "Error while deleting backup.",
      },
    },
    restoreBackup: {
      title: "Restoring backup",
      message: {
        confirm:
          "Are you sure you want to restore backup: <strong>{{name}}</strong>?<br/><br/><small>Note: Current data will be replaced with backup data.</small>",
        loading: "Restoring backup...",
        success: "Backup has been restored.",
        error: "Error while restoring backup.",
      },
    },
    listsUpdate: {
      title: "Updating lists",
      message: {
        loading: "Updating lists...",
        success: "Lists have been updated.",
        error: {
          conflict:
            "Operation could not be performed because lists were outdated.<br/>Please try again.",
          default: "Error occurred while updating lists.",
        },
      },
    },
    listLoad: {
      title: "Loading list",
      message: {
        info: "List <strong>{{name}}</strong> has been loaded for editing.",
      },
    },
    confirmation: {
      title: "Registration confirmation",
      message: {
        loading: "Checking registration status...",
        success: "Registration successful, close the page.",
        error: {
          default: "Link expired or has been used.",
        },
      },
    },
    sendMessage: {
      title: "Sending message",
      labels: {
        name: "Name:",
        email: "Email address:",
        message: "Message:",
      },
      placeholders: {
        name: "Enter your name",
        email: "Enter email address",
        message: "Enter message",
      },
      message: {
        loading: "Sending message...",
        success: "Message has been sent.",
        error: {
          default: "Error while sending message.",
        },
      },
      button: "Send",
      autoReply: {
        lang: "en",
        greeting: "Thank you for contacting!",
        intro:
          "Your message has reached me successfully. I will answer as soon as possible - usually within 1-2 business days.",
        messageLabel: "Your message",
        regards: "Sincerely,\nMariusz Matusiewicz",
        footer:
          "This message was generated automatically by the contact form of the To-Do List App. Please do not reply directly to this message.",
      },
    },
    backupAuthError: {
      title: "Automatic Backup Error",
      message:
        "Automatic backups have stopped running due to Google Drive authorization issues. <br/><br/>Please go to the backup section below and click the <strong>Authorize Google</strong> button to renew access.",
    },
    offline: {
      title: "No connection",
      message:
        "No internet. You have access to local tasks and can edit them - changes will be synchronized after reconnecting to the network.",
    },
  },
  updateNotification: {
    message: "A new version of the app is available",
    button: "Update",
  },
  prepareText: {
    period: "period",
    comma: "comma",
    enter: "enter",
  },
};

export default langEn;
