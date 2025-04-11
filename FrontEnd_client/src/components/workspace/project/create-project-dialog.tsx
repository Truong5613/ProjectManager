import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateProjectForm from "@/components/workspace/project/create-project-form";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateProjectDialog();
  return (
    <div>
      <Dialog modal={true} open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg border-0">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <CreateProjectForm {...{ onClose }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;
