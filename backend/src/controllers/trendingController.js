import User from "../models/user.js";
import Post from "../models/post.js";
import Project from "../models/project.js";

/**
 * Trending creators — scored by real activity signals:
 *   - Recent posts (community signals)
 *   - Number of projects
 *   - Number of connections (network effect)
 *   - Profile completeness (bio, avatar, genres, role)
 *   - Recency (joined recently = emerging)
 *
 * Uses Claude API to generate a one-line "trending reason" per creator.
 * If ANTHROPIC_API_KEY is not set, returns creators without AI reasons.
 */
export const getTrendingCreators = async (req, res) => {
  try {
    const [users, posts, projects] = await Promise.all([
      User.find({ deletedAt: null }).select("-password").limit(100),
      Post.find().select("author createdAt").lean(),
      Project.find().select("owner collaborators createdAt").lean(),
    ]);

    const postCountByUser = {};
    const projectCountByUser = {};

    posts.forEach((p) => {
      const id = p.author?.toString();
      if (id) postCountByUser[id] = (postCountByUser[id] || 0) + 1;
    });

    projects.forEach((p) => {
      const id = p.owner?.toString();
      if (id) projectCountByUser[id] = (projectCountByUser[id] || 0) + 1;
      (p.collaborators || []).forEach((c) => {
        const cid = c.toString();
        projectCountByUser[cid] = (projectCountByUser[cid] || 0) + 0.5;
      });
    });

    const now = Date.now();

    const scored = users
      .filter((u) => u._id.toString() !== req.user.id)
      .map((u) => {
        const uid = u._id.toString();
        let score = 0;

        // Activity signals
        score += (postCountByUser[uid] || 0) * 4;
        score += Math.floor(projectCountByUser[uid] || 0) * 3;
        score += (u.connections?.length || 0) * 2;

        // Profile completeness
        if (u.bio) score += 2;
        if (u.avatar) score += 2;
        if (u.genres?.length > 0) score += u.genres.length;
        if (u.role) score += 2;
        if (u.instruments?.length > 0) score += 1;

        // Recency bonus — creators who joined in the last 30 days
        const daysSinceJoin =
          (now - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceJoin < 30) score += 5;

        return { ...u.toObject(), _trendingScore: score };
      })
      .sort((a, b) => b._trendingScore - a._trendingScore)
      .slice(0, 6);

    // Try to get AI-generated trending reason for each creator
    if (process.env.ANTHROPIC_API_KEY && scored.length > 0) {
      try {
        const prompt = `You are generating short, punchy "trending reason" labels for musicians on a collaboration platform.

For each creator below, write EXACTLY one sentence (max 8 words) explaining why they might be trending.
Be specific to their role/genres. Sound like Spotify's "Popular with listeners" — short, energetic, real.

Creators:
${scored.map((u, i) => `${i + 1}. ${u.username} — ${u.role || "Creator"}, genres: ${u.genres?.join(", ") || "various"}, ${postCountByUser[u._id.toString()] || 0} posts, ${Math.floor(projectCountByUser[u._id.toString()] || 0)} projects`).join("\n")}

Respond ONLY with a JSON array of strings, one per creator, in the same order. No markdown. Example:
["Hot in the trap scene right now","Producers are obsessed with her beats"]`;

        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const raw = aiData.content?.[0]?.text || "[]";
          const reasons = JSON.parse(raw.replace(/```json|```/g, "").trim());

          if (Array.isArray(reasons)) {
            scored.forEach((u, i) => {
              u._trendingReason = reasons[i] || null;
            });
          }
        }
      } catch (err) {
        console.error("AI trending reason error:", err.message);
        // Non-fatal — return creators without reasons
      }
    }

    // Clean up internal scoring field
    const result = scored.map(({ _trendingScore, ...u }) => u);
    res.json(result);
  } catch (err) {
    console.error("getTrendingCreators:", err);
    res.status(500).json({ msg: "Failed to load trending creators" });
  }
};
