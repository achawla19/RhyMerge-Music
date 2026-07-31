import AppRouter from "./AppRouter";

// NOTE: this used to also apply a per-user "accent color" preference on
// every load (Settings > Appearance), which re-derived --rm-purple-* on
// the root element. That feature is removed — RhyMerge now ships one
// deliberate brand palette (see index.css) instead of a customizable
// one, so it can't drift back toward stray purple/violet defaults.
function App() {
  return <AppRouter />;
}

export default App;
