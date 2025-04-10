import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import {  BadRequestException, NotFoundException } from "../utils/appError";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.model";

//tao 1 workspace moi
export const createWorkspaceService = async (
    userid: string,
     body: {
        name: string;
        description?: string | undefined;
     }
    ) => {
        const { name, description } = body;
        const user = await UserModel.findById(userid);
        
        if(!user){
            throw new NotFoundException("User not found");
        }
        const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
        if (!ownerRole) {
            throw new NotFoundException("Owner Role not found");
        }

        const workspace = new WorkspaceModel({
            name: name,
            description: description,
            owner: user._id,
        });
        await workspace.save();

        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        await member.save();

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save(); 

        return {
            workspace,
        };
};

//lay tat ca cac workspace cua user
export const getAllWorkspacesUserIsMemberService = async (userid: string) => {
    const memberships = await MemberModel.find({ 
      userId: userid,
      isDeleted: { $ne: true }
    })
    .populate({
      path: "workspaceId",
      match: { isDeleted: { $ne: true } }
    })
    .select("-password")
    .exec();
    
    const workspaces = memberships
      .map((membership) => membership.workspaceId)
      .filter(workspace => workspace !== null);
    
    return {
        workspaces,
    };
};

//lay workspace theo id
export const getWorkspaceByIdService = async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      isDeleted: { $ne: true }
    });

    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const members = await MemberModel.find({
        workspaceId,
        isDeleted: { $ne: true }
    }).populate("role");

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members,
    };

    return {
        workspace: workspaceWithMembers,
    };
};

//lay cac thanh vien cua workspace
export const getWorkspaceMembersService = async (workspaceId: string) => {
    // Fetch all members of the workspace
  
    const members = await MemberModel.find({
      workspaceId,
      isDeleted: { $ne: true },
    })
      .populate("userId", "name email profilePicture -password")
      .populate("role", "name");
  
    const roles = await RoleModel.find({}, { name: 1, _id: 1 })
      .select("-permission")
      .lean();
  
    return { members, roles };
};

//lay thong ke cua workspace
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
    const currentDate = new Date();
  
    const totalTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
      isDeleted: { $ne: true },
    });
  
    const overdueTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
      dueDate: { $lt: currentDate },
      status: { $ne: TaskStatusEnum.DONE },
      isDeleted: { $ne: true },
    });
  
    const completedTasks = await TaskModel.countDocuments({
      workspace: workspaceId,
      status: TaskStatusEnum.DONE,
      isDeleted: { $ne: true },
    });
  
    const analytics = {
      totalTasks,
      overdueTasks,
      completedTasks,
    };
  
    return { analytics };
  };

//Thay doi vai tro cua thanh vien trong workspace
export const changeMemberRoleService = async (
    workspaceId: string,
    memberId: string,
    roleId: string
  ) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
  
    const role = await RoleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException("Role not found");
    }
  
    const member = await MemberModel.findOne({
      userId: memberId,
      workspaceId: workspaceId,
      isDeleted: { $ne: true },
    });
  
    if (!member) {
      throw new Error("Member not found in the workspace");
    }
  
    member.role = role;
    await member.save();
  
    return {
      member,
    };
};

//Thay doi thong tin workspace theo id
export const updateWorkspaceByIdService = async (
    workspaceId: string,
    name: string,
    description?: string
  ) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
  
    // Cap nhat thong tin workspace
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();
  
    return {
      workspace,
    };
  };

//Xoa workspace theo id
export const deleteWorkspaceService = async (
    workspaceId: string,
    userId: string
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const workspace = await WorkspaceModel.findById(workspaceId).session(
        session
      );
      if (!workspace) {
        throw new NotFoundException("Workspace not found");
      }
  
      // Kiem tra xem co phai la chu workspace khong?
      if (workspace.owner.toString() !== userId) {
        throw new BadRequestException(
          "You are not authorized to delete this workspace"
        );
      }
  
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        throw new NotFoundException("User not found");
      }
  
      // Soft delete all projects in the workspace
      await ProjectModel.updateMany(
        { workspace: workspace._id },
        { isDeleted: true }
      ).session(session);
      
      // Soft delete all tasks in the workspace
      await TaskModel.updateMany(
        { workspace: workspace._id },
        { isDeleted: true }
      ).session(session);
  
      // Soft delete all members in the workspace
      await MemberModel.updateMany(
        { workspaceId: workspace._id },
        { isDeleted: true }
      ).session(session);
  
      // Cap nhat workspace hien tai cua user thanh 1 cai khac neu nhu cai hien tai bi xoa
      if (user?.currentWorkspace?.equals(workspaceId)) {
        const memberWorkspace = await MemberModel.findOne({ 
          userId,
          isDeleted: { $ne: true }
        }).session(session);
        
        // Cap nhat workspace hien tai cua user thanh cai khac
        user.currentWorkspace = memberWorkspace
          ? memberWorkspace.workspaceId
          : null;
  
        await user.save({ session });
      }
  
      // Soft delete the workspace
      workspace.isDeleted = true;
      await workspace.save({ session });
  
      await session.commitTransaction();
  
      session.endSession();
  
      return {
        currentWorkspace: user.currentWorkspace,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };