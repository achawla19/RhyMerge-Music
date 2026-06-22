import {
  Guitar,
  CheckCircle2,
  XCircle,
  Users,
  Music2,
  Sparkles,
  Brain,
  Rocket,
  MessageCircle,
  Bell,
} from "lucide-react";

export const notificationVisuals = {
  project_request: {
    icon: Guitar,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },

  request_accepted: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },

  request_rejected: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },

  connection_request: {
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },

  connection_accepted: {
    icon: Music2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },

  recommendation: {
    icon: Sparkles,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },

  ai_insight: {
    icon: Brain,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },

  project_match: {
    icon: Rocket,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },

  message: {
    icon: MessageCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },

  system: {
    icon: Bell,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
};
