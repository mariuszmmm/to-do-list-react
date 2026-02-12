import { darken, lighten } from "polished";

const colorNames = {
  black: "#151515ff",
  silver: "#ccc",
  alto: "#ddd",
  gallery: "#eee",
  white: "#fff",
  empress: "#767374",
  teal: "#007380",
  crimson: "#db143c",
  snowyMint: "#c0ffccff",
  forestGreen: "#228c22",
  red: "#ff3e3e",
  blue: "#0083e7ff",
  yellow: "#b19900ff",
  transparent: "transparent",
  orange: "#f6a800f6",
  test: "#f6a800f6",
};

const common = {
  fontWeight: {
    normal: 400,
    semiBold: 600,
    bold: 700,
  },
  breakpoint: {
    mobileMax: "767px",
    mobileMid: "570px",
    mobileMin: "350px",
  },
};

export const themeLight = {
  ...common,
  colors: {
    textPrimary: colorNames.black,
    textSecendary: colorNames.empress,
    backgroundPrimary: colorNames.gallery,
    backgroundSecendary: colorNames.white,
    backgrouncSelected: colorNames.snowyMint,
    themeSwitch: {
      icon: colorNames.white,
      text: colorNames.empress,
    },
    nav: {
      text: colorNames.white,
      background: colorNames.teal,
    },
    button: {
      primaryText: colorNames.white,
      secendaryText: colorNames.teal,
      blackText: colorNames.black,
      background: colorNames.teal,
      check: colorNames.forestGreen,
      image: colorNames.orange,
      edit: colorNames.empress,
      sort: colorNames.blue,
      remove: colorNames.crimson,
      cancel: colorNames.empress,
      disabled: colorNames.silver,
      transparent: colorNames.transparent,
    },
    status: {
      error: colorNames.red,
      warning: colorNames.crimson,
      changed: colorNames.yellow,
      pending: colorNames.blue,
      info: colorNames.blue,
      success: colorNames.forestGreen,
      default: colorNames.black,
    },
    border: {
      primary: colorNames.alto,
      secendary: colorNames.teal,
    },
    shadow: {
      primary: colorNames.alto,
    },
  },
  boxShadow: "0 0 50px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.05)" as string,
} as const;

export const themeDark: typeof themeLight = {
  ...common,
  colors: {
    textPrimary: colorNames.silver,
    textSecendary: colorNames.empress,
    backgroundPrimary: colorNames.black,
    backgroundSecendary: lighten(0.06, colorNames.black),
    backgrouncSelected: darken(0.05, colorNames.snowyMint),
    themeSwitch: {
      icon: colorNames.black,
      text: colorNames.silver,
    },
    nav: {
      text: colorNames.gallery,
      background: darken(0.05, colorNames.teal),
    },
    button: {
      primaryText: colorNames.gallery,
      secendaryText: lighten(0.15, colorNames.teal),
      blackText: colorNames.black,
      background: darken(0.05, colorNames.teal),
      check: lighten(0.02, colorNames.forestGreen),
      image: darken(0.05, colorNames.orange),
      edit: lighten(0.02, colorNames.empress),
      sort: lighten(0.1, colorNames.blue),
      remove: darken(0.04, colorNames.crimson),
      cancel: darken(0.03, colorNames.empress),
      disabled: lighten(0.15, colorNames.black),
      transparent: colorNames.transparent,
    },
    status: {
      error: lighten(0.06, colorNames.red),
      warning: lighten(0.06, colorNames.crimson),
      changed: lighten(0.2, colorNames.yellow),
      pending: lighten(0.15, colorNames.blue),
      info: lighten(0.2, colorNames.blue),
      success: lighten(0.15, colorNames.forestGreen),
      default: colorNames.gallery,
    },
    border: {
      primary: darken(0.6, colorNames.alto),
      secendary: colorNames.teal,
    },
    shadow: {
      primary: darken(0.8, colorNames.alto),
    },
  },
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)",
} as const;
