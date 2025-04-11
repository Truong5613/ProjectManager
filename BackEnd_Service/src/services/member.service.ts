import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";

//lay role cua user trong workspace
export const getMemberRoleInWorkspace = async (
    userId: string, workspaceId: string
) => {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      isDeleted: { $ne: true } // Explicitly filter out deleted workspaces
    });
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const member = await MemberModel.findOne({
        userId: userId,
        workspaceId: workspaceId,
        isDeleted: { $ne: true } // Explicitly filter out deleted members
    }).populate("role");

    if (!member) {
        throw new UnauthorizedException("User not found in workspace",
            ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const rolename = member.role?.name;
    return {
        role: rolename,
    };

};

//Tham gia workspace bang ma moi
export const joinWorkspaceByInviteService = async (
    userId: string,
    inviteCode: string
  ) => {
    // Tim workspace = ma moi
    const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
    if (!workspace) {
      throw new NotFoundException("Invalid invite code or workspace not found");
    }
  
    // Kiem tra xem user da la thanh vien cua workspace chua?
    const existingMember = await MemberModel.findOne({
      userId,
      workspaceId: workspace._id,
    }).exec();
  
    if (existingMember) {
      throw new BadRequestException("You are already a member of this workspace");
    }
  
    const role = await RoleModel.findOne({ name: Roles.MEMBER });
  
    if (!role) {
      throw new NotFoundException("Role not found");
    }
  
    // Them user vao workspace
    const newMember = new MemberModel({
      userId,
      workspaceId: workspace._id,
      role: role._id,
    });
    await newMember.save();
  
    return { workspaceId: workspace._id, role: role.name };
};

// Soft delete a member from workspace
export const softDeleteMemberService = async (
  workspaceId: string,
  memberId: string
) => {
  const member = await MemberModel.findOne({
    _id: memberId,
    workspaceId: workspaceId,
  });

  if (!member) {
    throw new NotFoundException("Member not found in this workspace");
  }

  // Soft delete the member
  member.isDeleted = true;
  await member.save();

  return { message: "Member removed from workspace successfully" };
};

// Delete a member from workspace (only owner can do this)
export const deleteMemberService = async (
  workspaceId: string,
  memberId: string,
  userId: string
) => {
  // Check if the user is the owner of the workspace
  const userMember = await MemberModel.findOne({
    userId: userId,
    workspaceId: workspaceId,
    isDeleted: { $ne: true }
  }).populate('role');

  if (!userMember || userMember.role.name !== Roles.OWNER) {
    throw new UnauthorizedException(
      "Only workspace owner can delete members",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  // Find the member to delete by userId
  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId: workspaceId,
    isDeleted: { $ne: true }
  });

  if (!member) {
    throw new NotFoundException("Member not found in this workspace");
  }

  // Soft delete the member
  member.isDeleted = true;
  await member.save();

  return { message: "Member removed from workspace successfully" };
};