import { useState } from "react";
import Modal from "../projects/Modal";
import Select from "../ui/Select";
import { useToast } from "../ui/Toast";
import { createCollabPost } from "../../api/collab";
import { createPost } from "../../api/post";
import { ROLES, GENRES } from "../../constants/profileOptions";

const TERMS = ["Paid", "Revenue Split", "Credit Only", "Just for Fun"];
const LOCATION_TYPES = ["Remote", "In-person", "Either"];

const initial = {
  title: "",
  description: "",
  lookingFor: "",
  genres: [],
  terms: "Revenue Split",
  termsNote: "",
  locationType: "Remote",
  location: "",
};

const CollabComposer = ({ isOpen, onClose, onCreated }) => {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [shareToFeed, setShareToFeed] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleGenre = (g) =>
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(g)
        ? f.genres.filter((x) => x !== g)
        : f.genres.length < 5
          ? [...f.genres, g]
          : f.genres,
    }));

  const reset = () => setForm(initial);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.lookingFor) {
      toast.error(
        "Title, description, and who you're looking for are required",
      );
      return;
    }
    setSaving(true);
    try {
      const post = await createCollabPost(form);
      toast.success("Your collab post is live");

      if (shareToFeed) {
        try {
          await createPost({
            content: `Looking for a ${form.lookingFor.toLowerCase()} — "${form.title}" 🤝`,
            linkedCollabPost: post._id,
          });
        } catch {}
      }

      onCreated(post);
      reset();
      onClose();
    } catch (err) {
      toast.error(err.message || "Couldn't post that");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Collab" wide>
      <div className="space-y-4">
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{ color: "var(--rm-text-muted)" }}
          >
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => set("title")(e.target.value)}
            placeholder="Need a vocalist for a lo-fi EP"
            maxLength={100}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{ color: "var(--rm-text-muted)" }}
          >
            What's the project?
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            placeholder="Tell people what you're working on and what you're picturing..."
            maxLength={2000}
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-xs mb-1.5 block"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Looking for
            </label>
            <Select
              value={form.lookingFor}
              onChange={set("lookingFor")}
              options={ROLES}
              placeholder="Pick a role"
            />
          </div>
          <div>
            <label
              className="text-xs mb-1.5 block"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Terms
            </label>
            <Select
              value={form.terms}
              onChange={set("terms")}
              options={TERMS}
            />
          </div>
        </div>

        {form.terms !== "Just for Fun" && (
          <div>
            <label
              className="text-xs mb-1.5 block"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Terms detail <span style={{ opacity: 0.6 }}>(optional)</span>
            </label>
            <input
              value={form.termsNote}
              onChange={(e) => set("termsNote")(e.target.value)}
              placeholder='"$100 flat", "50/50 split", "TBD"...'
              maxLength={60}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-xs mb-1.5 block"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Location type
            </label>
            <Select
              value={form.locationType}
              onChange={set("locationType")}
              options={LOCATION_TYPES}
            />
          </div>
          {form.locationType !== "Remote" && (
            <div>
              <label
                className="text-xs mb-1.5 block"
                style={{ color: "var(--rm-text-muted)" }}
              >
                Where
              </label>
              <input
                value={form.location}
                onChange={(e) => set("location")(e.target.value)}
                placeholder="Austin, TX"
                maxLength={100}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          )}
        </div>

        <div>
          <label
            className="text-xs mb-2 block"
            style={{ color: "var(--rm-text-muted)" }}
          >
            Genres <span style={{ opacity: 0.6 }}>(up to 5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const active = form.genres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={
                    active
                      ? {
                          background: "var(--rm-purple-dim)",
                          border: "1px solid var(--rm-purple-border)",
                          color: "var(--rm-purple-light)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--rm-text-muted)",
                        }
                  }
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <div
            className="w-10 h-5 rounded-full relative transition-colors"
            style={{
              background: shareToFeed
                ? "var(--rm-purple)"
                : "rgba(255,255,255,0.1)",
            }}
            onClick={() => setShareToFeed((v) => !v)}
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: shareToFeed ? "translateX(20px)" : "none" }}
            />
          </div>
          <span
            className="text-sm"
            style={{ color: "var(--rm-text-secondary)" }}
          >
            Share to your feed
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) =>
            !saving && (e.currentTarget.style.background = "#6D28D9")
          }
          onMouseLeave={(e) =>
            !saving && (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          {saving ? "Posting..." : "Post it"}
        </button>
      </div>
    </Modal>
  );
};

export default CollabComposer;
