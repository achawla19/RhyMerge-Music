/**
 * Seed script — populates the database with realistic demo data across
 * every model in the app: users, connections, projects, project files,
 * collab posts + responses, project requests, community posts (including
 * ones linked to a project/collab post), conversations + messages, and a
 * handful of notifications.
 *
 * DEFAULT BEHAVIOR: adds fake users/projects/etc. ALONGSIDE whatever's
 * already in your database — your own account and any real data is never
 * touched or deleted. Safe to run on a database that already has real
 * users in it.
 *
 *   node src/scripts/seed.js            # adds demo data, keeps everything else
 *   node src/scripts/seed.js --force    # WIPES all app data first, then seeds
 *
 * --force is destructive and deletes real accounts too — only use it on
 * an empty/throwaway/local database, never against anything with real
 * user data you care about.
 *
 * Every seeded user's password is: Password123!
 * (bcrypt-hashed the same way real registration does, so you can actually
 * log in as any of them.)
 *
 * Requires MONGO_URI and MESSAGE_ENCRYPTION_KEY in your .env — same as
 * running the server normally. Does NOT require RESEND_API_KEY (email
 * sending is skipped for seed data, notifications are inserted directly).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/user.js";
import Project from "../models/project.js";
import ProjectFile from "../models/projectFile.js";
import ProjectRequest from "../models/projectRequest.js";
import CollabPost from "../models/collabPost.js";
import CollabResponse from "../models/collabResponse.js";
import Post from "../models/post.js";
import Notification from "../models/notification.js";
import Conversation, { buildParticipantsKey } from "../models/conversation.js";
import Message from "../models/message.js";
import { encrypt } from "../utils/encryption.js";

dotenv.config();

const FORCE = process.argv.includes("--force");
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const avatarFor = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=256`;
const coverFor = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

const GENRES = [
  "Hip-Hop",
  "LoFi",
  "EDM",
  "Indie",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Soul",
  "Trap",
];
const ROLES = [
  "Singer",
  "Producer",
  "Songwriter",
  "DJ",
  "Musician",
  "Sound Engineer",
];
const CITIES = [
  "Mumbai",
  "Chennai",
  "Austin",
  "Berlin",
  "Toronto",
  "Lagos",
  "Manila",
  "London",
];

const SAMPLE_TRACKS = Array.from(
  { length: 8 },
  (_, i) =>
    `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`,
);

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set — check your .env file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to ${mongoose.connection.name}`);

  if (FORCE) {
    console.log(
      "--force passed: wiping ALL app data (including real accounts)...",
    );
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      ProjectFile.deleteMany({}),
      ProjectRequest.deleteMany({}),
      CollabPost.deleteMany({}),
      CollabResponse.deleteMany({}),
      Post.deleteMany({}),
      Notification.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
    ]);
  }

  // ── USERS ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const userSeeds = [
    {
      username: "zara_k",
      name: "Zara Khan",
      role: "Singer",
      genres: ["R&B", "Soul"],
    },
    {
      username: "beatsbyomar",
      name: "Omar Reyes",
      role: "Producer",
      genres: ["Hip-Hop", "Trap"],
    },
    {
      username: "lyra_writes",
      name: "Lyra Chen",
      role: "Songwriter",
      genres: ["Pop", "Indie"],
    },
    {
      username: "dj_ravi",
      name: "Ravi Patel",
      role: "DJ",
      genres: ["EDM", "Pop"],
    },
    {
      username: "the_six_string",
      name: "Marcus Webb",
      role: "Musician",
      genres: ["Rock", "Indie"],
    },
    {
      username: "mixedby_ana",
      name: "Ana Torres",
      role: "Sound Engineer",
      genres: ["Jazz", "Soul"],
    },
    {
      username: "kofi_beats",
      name: "Kofi Mensah",
      role: "Producer",
      genres: ["Hip-Hop", "R&B"],
    },
    {
      username: "elena_sings",
      name: "Elena Rossi",
      role: "Singer",
      genres: ["Pop", "Jazz"],
    },
    {
      username: "wordsmith_jay",
      name: "Jay Okonkwo",
      role: "Songwriter",
      genres: ["Hip-Hop", "Soul"],
    },
    {
      username: "prod_nova",
      name: "Nova Kim",
      role: "Producer",
      genres: ["EDM", "Trap"],
    },
    {
      username: "guitarwolf",
      name: "Sam Wolfe",
      role: "Musician",
      genres: ["Rock", "Jazz"],
    },
    {
      username: "studio_priya",
      name: "Priya Sharma",
      role: "Sound Engineer",
      genres: ["Indie", "Pop"],
    },
  ];

  const existingSeedUsers = await User.find({
    username: { $in: userSeeds.map((u) => u.username) },
  }).select("username");
  const existingUsernames = new Set(existingSeedUsers.map((u) => u.username));
  const newSeeds = userSeeds.filter((u) => !existingUsernames.has(u.username));

  let users = existingSeedUsers.length
    ? await User.find({ username: { $in: userSeeds.map((u) => u.username) } })
    : [];

  if (newSeeds.length > 0) {
    const inserted = await User.insertMany(
      newSeeds.map((u) => ({
        username: u.username,
        name: u.name,
        email: `${u.username}@example.com`,
        password: hashedPassword,
        role: u.role,
        bio: `${u.role} based in ${rand(CITIES)}. Into ${u.genres.join(" and ")}. Always down to collaborate on something new.`,
        avatar: avatarFor(u.name),
        genres: u.genres,
        instruments: rand([
          ["Vocals"],
          ["Piano", "Guitar"],
          ["Drums"],
          ["Bass", "Synth"],
          [],
        ]),
        location: rand(CITIES),
        experienceLevel: rand([
          "Beginner",
          "Intermediate",
          "Advanced",
          "Professional",
        ]),
        availability: rand([
          "Available",
          "Available",
          "Available",
          "Busy",
          "Not Looking",
        ]),
        socials: {
          instagram: "",
          soundcloud: "",
          spotify: "",
          youtube: "",
          website: "",
        },
      })),
    );
    users = [...users, ...inserted];
    console.log(
      `Seeded ${inserted.length} new fake users (${existingUsernames.size} already existed, skipped)`,
    );
  } else {
    console.log(
      `All ${users.length} fake users already exist — reusing them, nothing new created`,
    );
  }

  // Belt-and-suspenders: if any of these seed accounts were created by an
  // earlier version of this script (before fake social links were removed),
  // force-clear those fields now regardless of new/existing. Scoped only to
  // the fixed seed usernames — never touches any other account.
  await User.updateMany(
    { username: { $in: userSeeds.map((u) => u.username) } },
    {
      $set: {
        "socials.instagram": "",
        "socials.soundcloud": "",
      },
    },
  );

  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));

  // ── CONNECTIONS (mutual) + a few pending requests ──────────────────────────
  const pairs = [
    ["zara_k", "beatsbyomar"],
    ["zara_k", "mixedby_ana"],
    ["lyra_writes", "beatsbyomar"],
    ["dj_ravi", "prod_nova"],
    ["the_six_string", "guitarwolf"],
    ["kofi_beats", "wordsmith_jay"],
    ["elena_sings", "studio_priya"],
  ];
  for (const [a, b] of pairs) {
    await User.updateOne(
      { _id: byUsername[a]._id },
      { $addToSet: { connections: byUsername[b]._id } },
    );
    await User.updateOne(
      { _id: byUsername[b]._id },
      { $addToSet: { connections: byUsername[a]._id } },
    );
  }
  const pendingPairs = [
    ["prod_nova", "zara_k"],
    ["guitarwolf", "elena_sings"],
  ];
  for (const [sender, receiver] of pendingPairs) {
    await User.updateOne(
      { _id: byUsername[sender]._id },
      { $addToSet: { sentRequests: byUsername[receiver]._id } },
    );
    await User.updateOne(
      { _id: byUsername[receiver]._id },
      { $addToSet: { receivedRequests: byUsername[sender]._id } },
    );
  }
  console.log(
    `Seeded ${pairs.length} connections, ${pendingPairs.length} pending requests`,
  );

  // ── PROJECTS ────────────────────────────────────────────────────────────
  const projectSeeds = [
    {
      title: "Midnight Protocol EP",
      genre: "Trap",
      bpm: 140,
      key: "F minor",
      status: "Production",
    },
    {
      title: "Golden Hour",
      genre: "R&B",
      bpm: 92,
      key: "D major",
      status: "Recording",
    },
    {
      title: "Static & Silence",
      genre: "Indie",
      bpm: 118,
      key: "A minor",
      status: "Mixing",
    },
    {
      title: "Raag × Trap Fusion",
      genre: "Hip-Hop",
      bpm: 132,
      key: "C minor",
      status: "Planning",
    },
    {
      title: "Coastal Drift",
      genre: "LoFi",
      bpm: 80,
      key: "G major",
      status: "Completed",
    },
    {
      title: "Afterglow",
      genre: "Pop",
      bpm: 104,
      key: "E major",
      status: "Recording",
    },
    {
      title: "Concrete Bloom",
      genre: "Rock",
      bpm: 150,
      key: "B minor",
      status: "Production",
    },
    {
      title: "Blue Room Sessions",
      genre: "Jazz",
      bpm: 96,
      key: "Bb major",
      status: "Completed",
    },
  ];
  const projects = [];
  for (let i = 0; i < projectSeeds.length; i++) {
    const p = projectSeeds[i];
    const owner = rand(users);
    const collaborators = randN(
      users.filter((u) => u._id.toString() !== owner._id.toString()),
      randInt(0, 2),
    );
    const project = await Project.create({
      title: p.title,
      description: `A ${p.genre.toLowerCase()} project in the works. Looking to build something honest and a little unexpected.`,
      genre: p.genre,
      bpm: p.bpm,
      musicalKey: p.key,
      coverImage: coverFor(`project-${i}`),
      status: p.status,
      owner: owner._id,
      collaborators: collaborators.map((c) => c._id),
      neededRoles: randN(ROLES, randInt(1, 2)),
      tags: randN(GENRES, 2),
      lookingForCollaborators: Math.random() > 0.4,
    });
    projects.push(project);
  }
  console.log(`Seeded ${projects.length} projects`);

  // ── PROJECT FILES (real playable audio via SoundHelix demo tracks) ────────
  let fileCount = 0;
  for (const project of projects.slice(0, 6)) {
    const numFiles = randInt(1, 3);
    for (let i = 0; i < numFiles; i++) {
      const uploader =
        rand([project.owner, ...project.collaborators]) || project.owner;
      await ProjectFile.create({
        project: project._id,
        uploader,
        url: rand(SAMPLE_TRACKS),
        cloudinaryPublicId: `seed/${project._id}/${i}`,
        filename: `${project.title.toLowerCase().replace(/\s+/g, "_")}_${rand(["vocals", "beat", "master", "guitar_take", "mix_v2"])}.mp3`,
        fileType: "audio/mpeg",
        fileSize: randInt(2_000_000, 9_000_000),
        duration: randInt(120, 240),
        stemType: rand([
          "vocals",
          "drums",
          "bass",
          "melody",
          "guitar",
          "keys",
          "full",
        ]),
        version: 1,
      });
      fileCount++;
    }
  }
  console.log(`Seeded ${fileCount} project files`);

  // ── PROJECT REQUESTS ────────────────────────────────────────────────────
  let requestCount = 0;
  for (const project of randN(projects, 5)) {
    const sender = rand(
      users.filter((u) => u._id.toString() !== project.owner.toString()),
    );
    await ProjectRequest.create({
      project: project._id,
      sender: sender._id,
      role: rand(project.neededRoles.length ? project.neededRoles : ROLES),
      message:
        "Would love to jump on this — I think I could add something to it.",
      status: rand(["Pending", "Pending", "Accepted", "Rejected"]),
    });
    requestCount++;
  }
  console.log(`Seeded ${requestCount} project requests`);

  // ── COLLAB POSTS ────────────────────────────────────────────────────────
  const collabSeeds = [
    {
      title: "Need a vocalist for a lo-fi EP",
      lookingFor: "Singer",
      genres: ["LoFi", "R&B"],
    },
    {
      title: "Producer wanted for trap/hip-hop project",
      lookingFor: "Producer",
      genres: ["Trap", "Hip-Hop"],
    },
    {
      title: "Looking for a lyricist — have the beat, need the words",
      lookingFor: "Songwriter",
      genres: ["Hip-Hop", "Soul"],
    },
    {
      title: "Guitarist needed for an indie rock 4-track",
      lookingFor: "Musician",
      genres: ["Indie", "Rock"],
    },
    {
      title: "Mix engineer for a finished jazz session",
      lookingFor: "Sound Engineer",
      genres: ["Jazz"],
    },
    {
      title: "DJ/remixer wanted for an EDM edit",
      lookingFor: "DJ",
      genres: ["EDM", "Pop"],
    },
    {
      title: "Duet partner for an R&B single",
      lookingFor: "Singer",
      genres: ["R&B", "Pop"],
    },
  ];
  const collabPosts = [];
  for (const c of collabSeeds) {
    const poster = rand(users);
    const post = await CollabPost.create({
      title: c.title,
      description:
        "Working on something I think could be really special with the right person on this. Open to hearing your take on it.",
      lookingFor: c.lookingFor,
      genres: c.genres,
      terms: rand(["Paid", "Revenue Split", "Credit Only", "Just for Fun"]),
      termsNote: rand(["", "50/50 split", "$100 flat", "TBD once we vibe"]),
      locationType: rand(["Remote", "Remote", "In-person", "Either"]),
      location: rand(CITIES),
      skillsNeeded: randN(GENRES, 1),
      postedBy: poster._id,
      status: "Open",
    });
    collabPosts.push(post);
  }
  console.log(`Seeded ${collabPosts.length} collab posts`);

  // ── COLLAB RESPONSES ────────────────────────────────────────────────────
  let responseCount = 0;
  for (const post of randN(collabPosts, 4)) {
    const responder = rand(
      users.filter((u) => u._id.toString() !== post.postedBy.toString()),
    );
    await CollabResponse.create({
      post: post._id,
      responder: responder._id,
      message:
        "This caught my eye — I've done a lot of work in this space and would love to talk more.",
      status: rand(["Pending", "Pending", "Accepted"]),
    });
    await CollabPost.updateOne(
      { _id: post._id },
      { $inc: { responsesCount: 1 } },
    );
    responseCount++;
  }
  console.log(`Seeded ${responseCount} collab responses`);

  // ── COMMUNITY POSTS (some linked to a project or collab post) ─────────────
  const postContents = [
    "Just wrapped tracking vocals for a new one — feeling really good about this direction.",
    "Anyone else fall down a sample-chopping rabbit hole at 2am? No regrets.",
    "Finally upgraded my monitors. The difference in the low end is wild.",
    "Looking for feedback on a rough mix — drop a comment if you're up for a listen.",
    "Three years on this platform and still finding new people to make things with.",
    "Studio session today turned into a full writing session. Best kind of accident.",
    "What's everyone's go-to plugin for vocal warmth right now?",
    "Shoutout to everyone who's ever sent a cold DM to collaborate — that's how the best stuff happens.",
  ];
  let postCount = 0;
  for (let i = 0; i < 12; i++) {
    const author = rand(users);
    const attachProject = i % 4 === 0;
    const attachCollab = !attachProject && i % 5 === 0;
    await Post.create({
      author: author._id,
      content: attachProject
        ? `Just started working on "${rand(projects).title}" 🎵`
        : attachCollab
          ? `Looking for a ${rand(collabPosts).lookingFor.toLowerCase()} — posted the details 🤝`
          : rand(postContents),
      tags: randN(GENRES, randInt(0, 2)),
      linkedProject: attachProject ? rand(projects)._id : null,
      linkedCollabPost: attachCollab ? rand(collabPosts)._id : null,
      likes: randN(users, randInt(0, 6)).map((u) => u._id),
      comments:
        i % 3 === 0
          ? [
              {
                user: rand(users)._id,
                text: "This is great — love where this is going.",
                replies: [],
              },
            ]
          : [],
    });
    postCount++;
  }
  console.log(`Seeded ${postCount} community posts`);

  // ── CONVERSATIONS + MESSAGES (encrypted, matching the real message flow) ──
  const convoPairs = [
    ["zara_k", "beatsbyomar"],
    ["lyra_writes", "kofi_beats"],
  ];
  let convoCount = 0;
  let messageCount = 0;
  for (const [a, b] of convoPairs) {
    const userA = byUsername[a];
    const userB = byUsername[b];
    const key = buildParticipantsKey(userA._id, userB._id);
    const convo = await Conversation.create({
      participants: [userA._id, userB._id],
      participantsKey: key,
    });
    const exchange = [
      [userA, "hey! saw your post, really dig your sound"],
      [userB, "appreciate that! what'd you have in mind?"],
      [userA, "got a track that needs exactly what you do — down to hear it?"],
      [userB, "always down. send it over"],
    ];
    let lastMessage = null;
    for (const [sender, text] of exchange) {
      lastMessage = await Message.create({
        conversation: convo._id,
        sender: sender._id,
        content: encrypt(text),
        isRead: true,
      });
      messageCount++;
    }
    await Conversation.updateOne(
      { _id: convo._id },
      { lastMessage: lastMessage._id, lastMessageAt: lastMessage.createdAt },
    );
    convoCount++;
  }
  console.log(`Seeded ${convoCount} conversations, ${messageCount} messages`);

  // ── NOTIFICATIONS (a handful for demo richness) ────────────────────────────
  let notifCount = 0;
  for (const [sender, receiver] of pendingPairs) {
    await Notification.create({
      recipient: byUsername[receiver]._id,
      sender: byUsername[sender]._id,
      type: "connection_request",
      title: "New Sync Request",
      description: `${byUsername[sender].username} wants to connect`,
      link: "/network",
      priority: 1,
    });
    notifCount++;
  }
  for (const post of collabPosts.slice(0, 2)) {
    const responder = rand(
      users.filter((u) => u._id.toString() !== post.postedBy.toString()),
    );
    await Notification.create({
      recipient: post.postedBy,
      sender: responder._id,
      type: "collab_interest",
      title: "Someone wants to collaborate",
      description: `${responder.username} reached out about "${post.title}"`,
      link: `/collab/${post._id}`,
      collabPost: post._id,
      priority: 1,
    });
    notifCount++;
  }
  console.log(`Seeded ${notifCount} notifications`);

  console.log("\nDone. Every seeded user's password is: Password123!");
  console.log(
    "Example logins:",
    userSeeds
      .slice(0, 3)
      .map((u) => u.username)
      .join(", "),
  );

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
