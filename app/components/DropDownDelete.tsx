import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export default function DropDownDelete() {
  const fetcher = useFetcher();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );
  const handleDeleteClick = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    fetcher.submit({ workoutId: selectedWorkoutId }, { method: "post" });
    setShowDeleteDialog(false);
    toast("Workout Deleted");
  };
  return (
    // <div className="flex gap-2">
    //   <Button variant="secondary">
    //     <span className="sr-only">Actions</span>
    //     <DotsHorizontalIcon className="h-4 w-4" />
    //   </Button>
    // </div>
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
