import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

const ProjectPanelContext = createContext();

/**
 * Breakpoints:
 *   >= 1280px (xl) — right panel slides in alongside content
 *   < 1280px       — navigate to full ProjectDetails page
 *
 * We use 1280 not 1024 because at 1024px the sidebar + main + 380px panel
 * is too cramped. At 1280px it fits comfortably.
 */
const canShowPanel = () => window.innerWidth >= 1280;

export const ProjectPanelProvider = ({ children }) => {
  const [openProjectId, setOpenProjectId] = useState(null);
  const pendingIdRef = useRef(null);
  const navigate = useNavigate();

  const openPanel = useCallback(
    (projectId) => {
      if (canShowPanel()) {
        setOpenProjectId(projectId);
      } else {
        // On tablet/phone — navigate to the full page
        navigate(`/projects/${projectId}`);
      }
    },
    [navigate],
  );

  const closePanel = useCallback(() => setOpenProjectId(null), []);

  const setPendingId = useCallback((id) => {
    pendingIdRef.current = id;
  }, []);
  const consumePendingId = useCallback(() => {
    const id = pendingIdRef.current;
    pendingIdRef.current = null;
    return id;
  }, []);

  return (
    <ProjectPanelContext.Provider
      value={{
        openProjectId,
        openPanel,
        closePanel,
        setPendingId,
        consumePendingId,
      }}
    >
      {children}
    </ProjectPanelContext.Provider>
  );
};

export const useProjectPanel = () => useContext(ProjectPanelContext);
