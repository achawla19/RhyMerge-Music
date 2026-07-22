import { useEffect } from "react";
import AppRouter from "./AppRouter";
import { useAuth } from "./context/AuthContext";
import { applyAccentColor } from "./utils/theme";

function App() {
  const { user } = useAuth();

  // Apply the saved accent color as soon as we know who's logged in (and
  // whenever it changes in Settings) — not just while the Settings page
  // happens to be mounted. Re-derives every --rm-purple-* token, not just
  // the base, so buttons/borders/fills stay consistent with the pick.
  useEffect(() => {
    const accent = user?.preferences?.accentColor;
    if (accent) applyAccentColor(accent);
  }, [user?.preferences?.accentColor]);

  return <AppRouter />;
}

export default App;
