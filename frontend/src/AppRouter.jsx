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
import Collab from "./pages/Collab";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import PageTransition, { trackNavigation } from "./components/PageTransition";
import { useProjectPanel } from "./context/ProjectPanelContext";
import { useAuth } from "./context/AuthContext";

const NavigationTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    trackNavigation(location, navigationType);
  }, [location, navigationType]);
  return null;
};

/**
 * When someone visits /projects/:id directly (or clicks a link):
 *  - Desktop (>=1280px, where the slide-in panel fits): store the ID in
 *    the panel context ref, navigate to /projects, and the Projects page
 *    consumes + opens it as a panel on mount.
 *  - Tablet/phone: render the full ProjectDetails page directly. Redirecting
 *    to /projects here would just bounce straight back to /projects/:id via
 *    openPanel()'s own mobile fallback — an infinite loop between the two
 *    routes. Rendering in place avoids that entirely.
 */
const ProjectRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPendingId } = useProjectPanel();
  const isDesktop = window.innerWidth >= 1280;

  useEffect(() => {
    if (isDesktop) {
      setPendingId(id);
      navigate("/projects", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDesktop]);

  if (isDesktop) return null;
  return <ProjectDetails />;
};

const Wrap = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      <PageTransition>{children}</PageTransition>
    </MainLayout>
  </ProtectedRoute>
);

/**
 * "/" is public — logged-out visitors need a real marketing page to land
 * on instead of getting bounced straight to /login. `user` hydrates
 * synchronously from localStorage in AuthProvider, so this reads instantly
 * with no loading flicker; ProtectedRoute (inside Wrap) still does the
 * real server-side session check for anyone who does have a cached user,
 * so a stale/expired cookie still correctly redirects to /login.
 */
const RootRoute = () => {
  const { user } = useAuth();
  if (user) {
    return (
      <Wrap>
        <Home />
      </Wrap>
    );
  }
  return <Landing />;
};

const AppRouter = () => (
  <>
    <NavigationTracker />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<RootRoute />} />
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
      <Route
        path="/collab"
        element={
          <Wrap>
            <Collab />
          </Wrap>
        }
      />
      <Route
        path="/collab/:id"
        element={
          <Wrap>
            <Collab />
          </Wrap>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

export default AppRouter;
