import { Amplify } from "aws-amplify";

// These values will be replaced with the actual values from CloudFormation outputs
const region = import.meta.env.VITE_REGION || "us-east-1";
const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolWebClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;
const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

export const configureAuth = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId: userPoolWebClientId,
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ["email", "openid", "profile"],
            redirectSignIn: [window.location.origin],
            redirectSignOut: [window.location.origin],
            responseType: "token",
          },
        },
      },
    },
  });
};
