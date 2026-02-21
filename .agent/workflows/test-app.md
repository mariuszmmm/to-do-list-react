---
description: How to run and test the to-do-list-react application in the browser
---

# Running and Testing the Application

## Important: Always use `npm start` (NOT `react-scripts start`)

The application requires **Netlify Dev** to function properly (authentication, serverless functions, etc.).

- `npm start` → runs `netlify dev` → starts on **http://localhost:8888**
- This launches both the React frontend AND the Netlify backend (Identity, Functions)
- **Never** use `npx react-scripts start` directly — it only starts the frontend on port 3000 without the backend, which breaks login and other features

## Steps to test the app

// turbo-all

1. Start the app:

```
npm start
```

Wait until you see: `Local dev server ready: http://localhost:8888`

2. Open the browser at `http://localhost:8888` (NOT port 3000)

3. To log in use:
   - **Email:** mariusz.myprojects@gmail.com
   - **Password:** test

## Common issues

- **Login fails with "Login error"**: The app was likely started with `react-scripts start` instead of `npm start`. The Netlify Identity endpoint at port 8888 is not available.
- **Browser won't open (`$HOME` not set)**: Set the `HOME` environment variable to `C:\Users\Mariusz` at the user level. Restart VS Code after setting it.
