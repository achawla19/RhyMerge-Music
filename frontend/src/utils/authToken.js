// A plain (non-React) module-level store for the current auth token.
// AuthContext keeps this in sync whenever the user logs in/out. Kept
// outside React state on purpose — this needs to be readable by the
// global fetch patch below, which runs outside any component.
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
};

export const getAuthToken = () => currentToken;
