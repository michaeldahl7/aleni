import React, { useState } from "react";
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { getWorkoutsOfUser } from "~/db/workout.server";
import { requireUserSession } from "~/utils/require-user.server";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
} from "@remix-run/node";
import { UserSelect } from "~/db/schema.server";
import { deleteWorkout } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";

import { Button } from "~/components/ui/button";

import invariant from "tiny-invariant";
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
import { Ellipsis } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export const action = defineAction(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const formData = await request.formData();
  const workoutId = formData.get("workoutId");
  invariant(workoutId, "Workout ID is required");
  await deleteWorkout(workoutId as string);
  return { ok: true };
});

export const loader = defineLoader(async ({ request }) => {
  const user = await requireUserSession(request);
  try {
    const workouts = await getWorkoutsOfUser(user.id);
    invariant(workouts, "workouts is required");
    return { workouts, user };
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return { error: "Failed to load workouts", status: 500 };
  }
});

export default function WorkoutsRoute() {
  const { workouts, user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  invariant(user, "user is required");
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
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:mx-16">
      <Card className="mx-auto grid flex-1 auto-rows-max gap-4 sm:col-span-2">
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
          <div className="grid gap-2">
            <CardTitle>Workouts</CardTitle>
            <CardDescription>
              Track your workouts and progress in a simple and organized way.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link to={`/${user.username}/workouts/new`}>Add Workout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {workouts ? (
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
                            <Ellipsis className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex-grow">
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                to={`/${user.username}/workouts/${workout.id}/edit`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex-grow"
                            onSelect={() => handleDeleteClick(workout.id)}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
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
          ) : (
            <div>No workouts</div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This workout will no longer be
              accessible by you or others you've shared it with.
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
