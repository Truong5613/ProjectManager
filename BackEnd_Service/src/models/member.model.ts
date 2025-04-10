import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: RoleDocument;
  joinedAt: Date;
  isDeleted: boolean;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add query middleware to filter out deleted documents by default
memberSchema.pre(/^find/, function(this: mongoose.Query<any, any, {}, any>, next) {
  if (!(this.getOptions().includeDeleted)) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel;