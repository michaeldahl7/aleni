// import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { UserSelect } from "~/db/schema.server";
import { deleteWorkout, getWorkoutById } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
// import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Trash2, SquarePen, Activity } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Car } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { AlertDialog, AlertDialogHeader } from "~/components/ui/alert-dialog";
import { AlertDialogContent } from "@radix-ui/react-alert-dialog";

export const loader = defineLoader(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "Workout ID is required");
  const workout = await getWorkoutById(params.workoutId);
  invariant(workout, "Workout is required");

  return { workout, user };
});

export const action = defineAction(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "Workout ID is required");
  await deleteWorkout(params.workoutId);
  throw redirect(`/${user.username}/home`);
});

export default function WorkoutRoute() {
  const { workout } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className=" flex px-8 justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="flex justify-center gap-2">
            {workout.title}{" "}
            {workout.date ? "- " + workout.date.toLocaleDateString() : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {workout.activities.map((activity, activityIndex) => {
            return (
              <Card key={activityIndex}>
                <CardHeader>
                  <CardTitle>{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Set</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead>Weight (optional)</TableHead>
                        {/* <TableHead>kg/lb</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activity.sets.map((set, setIndex) => {
                        return (
                          <TableRow>
                            <TableCell className="font-semibold text-center">
                              {setIndex + 1}
                            </TableCell>
                            <TableCell>{set.reps}</TableCell>
                            <TableCell>{set.weight}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Form method="post">
            <Button variant="destructive" type="submit" className="flex gap-2">
              <Trash2 />
              Delete
            </Button>
          </Form>
          <Button variant="default" asChild>
            <Link to="edit" className="flex gap-2">
              <SquarePen />
              Edit
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
