import mongoose, { Schema, Document } from "mongoose";
import {
  Permissions,
  PermissionType,
  Roles,
  RoleType,
} from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";

export interface RoleDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
  isDeleted: boolean;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add query middleware to filter out deleted documents by default
roleSchema.pre(/^find/, function(this: mongoose.Query<any, any, {}, any>, next) {
  if (!(this.getOptions().includeDeleted)) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;