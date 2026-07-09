import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigationType,
  useParams,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Community from "./pages/Community";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import PageTransition, { trackNavigation } from "./components/PageTransition";
import { useProjectPanel } from "./context/ProjectPanelContext";

const NavigationTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    trackNavigation(location, navigationType);
  }, [location, navigationType]);
  return null;
};

/**
 * When someone visits /projects/:id directly (or clicks a link),
 * store the ID in the panel context ref, navigate to /projects,
 * and the Projects page will consume + open it on mount.
 */
const ProjectRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPendingId } = useProjectPanel();

  useEffect(() => {
    setPendingId(id);
    navigate("/projects", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
};

const Wrap = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      <PageTransition>{children}</PageTransition>
    </MainLayout>
  </ProtectedRoute>
);

const AppRouter = () => (
  <>
    <NavigationTracker />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <Wrap>
            <Home />
          </Wrap>
        }
      />
      <Route
        path="/community"
        element={
          <Wrap>
            <Community />
          </Wrap>
        }
      />
      <Route
        path="/network"
        element={
          <Wrap>
            <Network />
          </Wrap>
        }
      />
      <Route
        path="/profile/:username"
        element={
          <Wrap>
            <Profile />
          </Wrap>
        }
      />
      <Route
        path="/search"
        element={
          <Wrap>
            <Search />
          </Wrap>
        }
      />
      <Route
        path="/settings"
        element={
          <Wrap>
            <Settings />
          </Wrap>
        }
      />
      <Route
        path="/projects"
        element={
          <Wrap>
            <Projects />
          </Wrap>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Wrap>
            <ProjectRedirect />
          </Wrap>
        }
      />
      <Route
        path="/messages"
        element={
          <Wrap>
            <Messages />
          </Wrap>
        }
      />
      <Route
        path="/library"
        element={
          <Wrap>
            <Library />
          </Wrap>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

export default AppRouter;
