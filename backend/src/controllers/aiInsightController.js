/**
 * AI Insight Controller
 *
 * Generates AI-powered insights for a project using Claude API.
 * Previous version crashed because it referenced `project.owner` before
 * `project` was defined in scope, and called `createNotification` which
 * didn't exist in that module.
 *
 * This version:
 *  - Guards all undefined references
 *  - Degrades gracefully if ANTHROPIC_API_KEY is missing
 *  - Uses the actual Anthropic Messages API
 *  - Never crashes — worst case returns a useful static fallback
 */

import Project from "../models/project.js";

const buildPrompt = (project) => `
You are a music production advisor helping collaborators work better together.

Project details:
- Title: "${project.title}"
- Genre: ${project.genre || "Not specified"}
- Status: ${project.status}
- BPM: ${project.bpm || "Not specified"}
- Key: ${project.musicalKey || "Not specified"}
- Description: "${project.description || "No description"}"
- Open roles: ${project.neededRoles?.join(", ") || "None listed"}
- Tags: ${project.tags?.join(", ") || "None"}

Provide a JSON response with exactly these keys:
{
  "summary": "One sentence describing the project vibe",
  "suggestions": ["tip 1", "tip 2", "tip 3"],
  "idealCollaborators": ["role 1", "role 2"],
  "productionTips": "One paragraph of genre-specific production advice"
}

Respond ONLY with valid JSON. No markdown, no preamble.
`;

const FALLBACK_INSIGHT = {
  summary: "A creative music collaboration project looking for the right team.",
  suggestions: [
    "Add reference tracks to help collaborators understand the direction",
    "Set a clear BPM and key so everyone stays in sync",
    "Break the project into phases with clear milestones",
  ],
  idealCollaborators: ["Producer", "Mix Engineer"],
  productionTips:
    "Focus on getting the fundamentals right — a solid rhythm section and clear arrangement will make everything else fall into place.",
};

export const getAIInsights = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "owner",
      "username",
    );

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Verify the requester is a project member
    const userId = req.user.id;
    const isOwner = project.owner?._id?.toString() === userId;
    const isCollaborator = project.collaborators?.some(
      (c) => c.toString() === userId,
    );

    if (!isOwner && !isCollaborator) {
      return res
        .status(403)
        .json({ msg: "Only project members can view insights" });
    }

    // If no API key configured, return graceful fallback instead of crashing
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        insight: FALLBACK_INSIGHT,
        source: "fallback",
        msg: "AI insights unavailable — ANTHROPIC_API_KEY not configured",
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: buildPrompt(project) }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return res.json({ insight: FALLBACK_INSIGHT, source: "fallback" });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "{}";

    let insight;
    try {
      insight = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      insight = FALLBACK_INSIGHT;
    }

    res.json({ insight, source: "ai" });
  } catch (err) {
    console.error("getAIInsights:", err);
    // Never let this crash — AI insights are non-critical
    res.json({ insight: FALLBACK_INSIGHT, source: "fallback" });
  }
};
