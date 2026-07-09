import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

const PlayerContext = createContext();

/**
 * Global audio player — singleton <audio> element shared across the app.
 * Any component can call playTrack(track) to take over the bottom bar.
 * track shape: { url, title, subtitle, artwork, stemType }
 */
export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null);
  const [isPlaying, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = useCallback(
    (newTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (track?.url === newTrack.url) {
        // Same track — just toggle play/pause
        isPlaying ? audio.pause() : audio.play().catch(() => {});
        setPlaying((p) => !p);
        return;
      }

      audio.src = newTrack.url;
      audio.play().catch(() => {});
      setTrack(newTrack);
      setPlaying(true);
      setProgress(0);
    },
    [track, isPlaying],
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    isPlaying ? audio.pause() : audio.play().catch(() => {});
    setPlaying((p) => !p);
  }, [isPlaying, track]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  }, []);

  const changeVolume = useCallback((v) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = v;
    setVolume(v);
  }, []);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setTrack(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        progress,
        duration,
        volume,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
