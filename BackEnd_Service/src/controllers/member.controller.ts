import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { joinWorkspaceByInviteService, deleteMemberService } from "../services/member.service";

export const joinWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
      const inviteCode = z.string().parse(req.params.inviteCode);
      const userId = req.user?._id;
  
      const { workspaceId, role } = await joinWorkspaceByInviteService(
        userId,
        inviteCode
      );
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Successfully joined the workspace",
        workspaceId,
        role,
      });
    }
  );

export const deleteMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = z.string().parse(req.params.workspaceId);
    const memberId = z.string().parse(req.params.memberId);
    const userId = req.user?._id;

    const result = await deleteMemberService(workspaceId, memberId, userId);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);