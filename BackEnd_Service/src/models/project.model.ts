import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description: string | null; // Optional description for the project
  emoji: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: false,
      trim: true,
      default: "📊",
    },
    description: { type: String, required: false },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add query middleware to filter out deleted documents by default
projectSchema.pre(/^find/, function(this: mongoose.Query<any, any, {}, any>, next) {
  if (!(this.getOptions().includeDeleted)) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;