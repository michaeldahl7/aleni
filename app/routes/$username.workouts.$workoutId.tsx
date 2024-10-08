import { Form, Link, useLoaderData } from "@remix-run/react";
import { GetWorkout, NewUser } from "~/db/schema.server";
import { deleteWorkout, getWorkout } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
import { Trash2, SquarePen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";

import { Button } from "~/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { requireUser } from "~/utils/require-user.server";


export const loader = defineLoader(async ({ request, params }) => {
  const user: NewUser = await requireUser(request);
  invariant(params.workoutId, "Workout ID is required");
  const workout: GetWorkout = await getWorkout(params.workoutId);
  invariant(workout, "Workout is required");

  return { workout, user };
});

export const action = defineAction(async ({ request, params }) => {
  const user: NewUser = await requireUser(request);
  invariant(params.workoutId, "Workout ID is required");
  await deleteWorkout(params.workoutId);
  throw redirect(`/${user.username}/home`);
});

export default function WorkoutRoute() {
  const { workout } = useLoaderData<typeof loader>();

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
            <Link to="edit" className="flex gap-2" prefetch="intent">
              <SquarePen />
              Edit
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}