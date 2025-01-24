declare module "*.svg" {
  import React = require("react");

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

// declare module 'netlify-identity-widget';
declare module "netlify-identity-widget" {
  export default netlifyIdentity;
}

//
