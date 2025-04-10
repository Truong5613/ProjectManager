import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { log } from "console";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { logoutMutationFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useStoreBase } from "@/store/store";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const Navigate = useNavigate();

  const {clearAccessToeken} = useStoreBase();

  const queryClient = useQueryClient();

  const { mutate, isPending} = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["authUser"],
      });
      clearAccessToeken();
      Navigate("/");
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  });

  // Handle logout action
  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [
    isPending,
    mutate,
  ]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will end your current session and you will need to log in
              again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="anime-spin"/>}
              Sign out
            </Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
