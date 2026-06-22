/**
 * One-time cleanup script — removes corrupted entries from connection
 * arrays (receivedRequests, sentRequests, connections, followers, following).
 *
 * This fixes pre-existing bad data already sitting in your database from
 * before — something previously wrote a malformed value like
 *   "[ \"ObjectId('...')\" ]"
 * into a user's receivedRequests array, instead of a real ObjectId. Once
 * any field on that user gets saved, Mongoose validates the WHOLE document
 * by default and throws on that corrupted entry — which is exactly the
 * "Cast to [ObjectId] failed" error you saw.
 *
 * This script finds and strips out any entries that aren't valid ObjectIds,
 * across every affected user, in one pass. It does NOT touch any other data.
 *
 * Run once from your backend folder:
 *   node src/scripts/cleanupCorruptedConnections.js
 *
 * Safe to delete after running.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const ARRAY_FIELDS = [
  "receivedRequests",
  "sentRequests",
  "connections",
  "followers",
  "following",
];

const isValidObjectId = (val) => {
  try {
    return (
      mongoose.Types.ObjectId.isValid(val) &&
      String(new mongoose.Types.ObjectId(val)) === String(val)
    );
  } catch {
    return false;
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Scanning users for corrupted connection data...");

  const users = await User.find({}).select(
    ["_id", "username", ...ARRAY_FIELDS].join(" "),
  );

  let totalFixed = 0;

  for (const user of users) {
    let changed = false;

    for (const field of ARRAY_FIELDS) {
      const raw = user[field] || [];
      const clean = raw.filter((entry) => isValidObjectId(entry));

      if (clean.length !== raw.length) {
        console.log(
          `Fixing ${user.username} (${user._id}) — ${field}: removed ${raw.length - clean.length} corrupted entr${raw.length - clean.length === 1 ? "y" : "ies"}`,
        );
        user[field] = clean;
        changed = true;
      }
    }

    if (changed) {
      await user.save({ validateModifiedOnly: true });
      totalFixed++;
    }
  }

  console.log(`\nDone. Fixed ${totalFixed} user(s).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
