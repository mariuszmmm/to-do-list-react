<p align="right">
  🌍 <a href="README-pl.md">polski</a> ∙ <a href="README.md">English</a>
</p>

# To-Do List Application
[**Try it now**](https://to-do-list-typescript-react.netlify.app/) and discover all the possibilities of the application!  

</br>

* [Presentation](#-presentation)
* [Deployment](#-deployment)
* [Technologies](#-technologies)
* [Description](#-description)
* [Configuration](#-configuration)
* [Application views](#-application-views)
* [User Instructions](#-user-instructions)
* [Adding Tasks by Voice](#-adding-tasks-by-voice)

</br>

## 🎬 Presentation
![to-do list](images/presentation.gif)

<br>

## 🚀 Deployment
* [**New version :**](https://to-do-list-typescript-react.netlify.app/)</br>
Features requiring communication with the database and user management have been implemented using <b>Netlify</b> – a platform offering serverless functions and authentication support. With <b>Netlify GoTrue</b>, the application allows users to manage their accounts, including registration, login, password reset and change, as well as account deletion. Additionally, the application enables storing task lists in the <b>MongoDB</b> database, which allows for later retrieval, editing, and saving.
The application supports translating the entire site into three languages: <b>Polish (pl)</b>, <b>English (en)</b>, and <b>German (de)</b>, using <b>react-i18next</b>. New features have also been implemented, such as dynamic translation of error messages using <b>Cloud Translation API</b>, which ensures that server messages are translated in real-time based on the user’s selected language.
Another novelty is the migration to <b>TanStack Query</b> (formerly <b>React Query</b>) for handling queries and mutations in the app, which significantly simplifies state management and asynchronous operations. The entire application has also been adapted to work with <b>TypeScript</b>, improving code stability and easing maintenance.<br/>https://to-do-list-typescript-react.netlify.app

* [**Older version :**](https://mariuszmmm.github.io/to-do-list-react)</br>
The older version is hosted on the <b>gh-pages</b> branch and can be accessed at:</br>https://mariuszmmm.github.io/to-do-list-react

</br>

## 🛠 Technologies

<ul>
<li>TypeScript, JavaScript (ES6+)</li>
<li>React & JSX, React Router</li>
<li>Redux, Redux Toolkit, Redux Saga</li>
<li>TanStack Query (react-query)</li>
<li>react-i18next, Cloud Translation API</li>
<li>Netlify GoTrue.js</li>
<li>MongoDB</li>
<li>EmailJS</li>
<li>Normalize.css, Styled Components</li>
<li>CSS Grid & Flexbox, Media Queries</li>
<li>Controlled Components</li>
</ul>

<br>

## 📝 Description
<b>To-Do List</b> is an application built with React and TypeScript. This version has been significantly expanded – in addition to the classic to-do list features, a number of new improvements and capabilities have been introduced:
* <b>Core Features:</b>
   * Fetch sample tasks <i>(when the list is empty)</i>,
   * Add new tasks,
   * Mark tasks as completed,
   * Search tasks with the ability to show/hide filters and clear them,
   * Display task details,
   * Delete tasks,
   * Hide completed tasks,
   * Mark all tasks as completed and now also unmark all tasks.
* <b>New features:</b>
   * <b>TypeScript support:</b> The app has been rewritten in TypeScript for better type safety and maintainability.
   * <b>TanStack Query:</b> Replaced manual fetching (Redux Saga) with useQuery hooks to fetch sample tasks and lists, and useMutation hooks for list mutations and user-related operations.
   * <b>react-i18next:</b> App translation into pl, en, de.
   * <b>Dynamic error translation:</b> Server error messages are translated on the fly using the Cloud Translation API.
   * <b>Streamlined state management:</b> Redux and Saga remain only for global app state; fetching and mutation logic moved to TanStack Query.
   * <b>User Account Management:</b>
      <i>(Implementation based on the [Netlify GoTrue](https://github.com/netlify/gotrue-js) library with custom UI components.)</i>
      * Registration,
      * Login,
      * Password reset and change,
      * Account deletion.<br>
   * <b>Adding tasks by voice:</b> Ability to enter task content using speech recognition (Web Speech API).

* <b>Lists Page:</b></br>
After logging in, users can access the “Lists” page, where all saved lists from the MongoDB database are displayed. On this page, you can:
   * Preview the contents of a selected list,
   * Load the selected list into current to-do list,
   * Sort the list,
   * Delete the list.
* <b>Saving a list to the database:</b></br>
After logging in, users can save the current to-do list to the database.
* <b>Task Editing:</b></br>
Tasks can be edited (using the pencil icon) with options to undo and redo changes.

The application offers a user-friendly interface that supports effective task management.

</br>

## ⚙ Configuration
To run the to-do-list-react application locally, follow these steps:

1. <b>Clone the Repository:</b><br>
Clone the GitHub repository to your local machine:
```commandline
     git clone https://github.com/mariuszmmm/to-do-list-react.git
```
2. <b>Install Dependencies:</b><br>
Navigate to the project directory and install all required dependencies:
```commandline
    cd to-do-list-react
    npm install
```
3. <b>Configure Environment Variables:</b><br>
Create a .env file in the root directory and define the following variables:
```commandline
   MONGODB_URI=your_mongodb_uri
   MONGODB_DATABASE=your_database
   WEBHOOK_SECRET=your_webhook_secret
   REACT_APP_CONFIRMATION_URL="http://localhost:8888/#/user-confirmation"
   REACT_APP_RECOVERY_URL="http://localhost:8888/#/account-recovery"
   TRANSLATION_API_KEY="your_translation_api_key"
   TRANSLATION_API_URL="https://translation.googleapis.com/language/translate/v2"
```
4. <b>Start the Application:</b><br>
Run the application in development mode:
```commandline
    npm start
```
The app will launch in your browser at http://localhost:8888.

<br>

## 🖥 Application Views
The application is fully responsive and adapts to various devices, including smartphones, tablets, and desktops.
Example views:

- <b>320x568</b> <i>(Mobile view)</i>  
![to-do list](images/size_1.gif)

- <b>600x960</b> <i>(Tablet view)</i>  
![to-do list](images/size_2.gif)

</br>

## 📄 User Instructions
<b>Fetching Sample Tasks</b>
* Select the <b>"Fetch Sample Tasks"</b> option – tasks will be fetched only if the current to-do list is empty.

</br>

<b>Adding a Task</b>
* Enter the task name in the text field and click <b>"Add Task"</b> or press <b>Enter</b>.

</br>

<b>Marking a Task as Completed</b>
* Click the checkbox next to a task to mark it as completed.

</br>

<b>Editing a Task</b>
* Click the pencil icon to edit a task's content.
* Use the undo/redo options to revert or restore changes.

</br>

<b>Searching for Tasks</b>
* Enter a keyword or phrase in the search field.
* Use the <b>Show/Hide filter</b> or <b>Clear filter</b> options for better control of results.

</br>

<b>Task Management</b>
* <b>Display details:</b> Click a task to view its detailed information.
* <b>Delete task:</b> Click the trash icon next to a task to delete it.
* <b>Done all / Undone all:</b> Allows you to mark all tasks as completed or unmark them.
* <b>Enable/disable sorting:</b> Toggles sorting mode. In list view, buttons will appear to move tasks up and down.

</br>

<b>Undo and redo changes</b>
* Click the <b>"↺"</b> button – the last action on the to-do list will be reverted.
* Click the <b>"↻"</b> button – the reverted action will be restored.
</br>
Buttons are active only when undoing or redoing is possible.

</br>

<b>Save list</b> (available for logged-in users)
* Select the <b>"Save List"</b> option – the to-do list will be saved to the database. If the list name already exists, you can rename it or overwrite the existing one.

</br>

<b>User Account Management</b>
* After logging in, the user gains access to:
   * <b>Password change, account deletion, and other account features.</b>
   * <b>Lists Page:</b> View saved lists, preview contents, load a list into the current to-do-list, or delete a list.
   * <b>Save the current to-do list to the database.</b>

</br>

## 🎤 Adding Tasks by Voice
The application allows you to add and edit tasks using speech recognition. This feature uses the Web Speech API and is available in the add/edit task form.

</br>

**How does it work?**
- Next to the text field, there is a button with a microphone icon.
- Click the microphone to start listening – you can dictate the task content.
- The recognized text appears automatically in the text field.
- Clicking the microphone again stops listening.
- If your browser does not support speech recognition, the microphone button will be inactive.

</br>

**Additional information:**
- Various languages are supported – the app automatically adjusts the recognition language to the selected interface language.
- In task edit mode, speech recognition continues the existing content.
- Interim results are supported, so the text appears live as you speak (if the browser allows it).

</br>

## 📬 Contact Form
The application includes a contact form that allows users to send messages directly to the author. This form is integrated using [EmailJS](https://www.emailjs.com/docs/examples/reactjs/), enabling email sending without the need for a backend server.