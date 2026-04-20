const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    genre: String,

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: String,
    timeline: String,
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
