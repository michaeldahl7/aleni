import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Ellipsis, CirclePlusIcon } from "lucide-react";

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

import { Link, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { toast } from "sonner";

export function Workouts({
  workouts,
  username,
}: {
  workouts: {
    date: Date;
    id: string;
    title: string;
  }[];
  username: string;
}) {
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
    <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <div className="flex justify-center">
        <Card className="">
          <CardHeader className="flex flex-row gap-8 items-center">
            <div className="grid gap-2">
              <CardTitle>Workouts</CardTitle>
              <CardDescription>
                Track your workouts and progress.
              </CardDescription>
            </div>
            <Button asChild className="ml-auto gap-2">
              <Link to={`/${username}/workouts/new`} prefetch="intent">
                <CirclePlusIcon />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Workout
                </span>

              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workout</TableHead>
                      <TableHead className="">Date</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell>{workout.title}</TableCell>
                        <TableCell>
                          {workout.date
                            ? workout.date.toLocaleDateString()
                            : "No Date"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <Ellipsis className="size-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="flex justify-start"
                                >
                                  <Link
                                    to={`/${username}/workouts/${workout.id}`}
									prefetch="intent"
                                  >
                                    View
                                  </Link>
                                </Button>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="flex justify-start"
                                >
                                  <Link
                                    to={`/${username}/workouts/${workout.id}/edit`}
									prefetch="intent"
                                  >
                                    Edit
                                  </Link>
                                </Button>
                              </DropdownMenuItem>
                              <DropdownMenuItem

                                onSelect={() => handleDeleteClick(workout.id)}
                                asChild
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full hover:cursor-default flex justify-start"
                                >
                                  Delete
                                </Button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Card className="m-4 p-2">
                <div className="flex justify-center">No workouts</div>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
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
    </main>
  );
}
