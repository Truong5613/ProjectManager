import WorkspaceForm from "./create-workspace-form";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CreateWorkspaceDialog = () => {
  const { open, onClose } = useCreateWorkspaceDialog();

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl !p-0 overflow-hidden border-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <WorkspaceForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;