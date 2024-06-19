import { MinusCircle, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorList, Field } from "~/components/Forms";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";

import { type action } from "~/utils/__workout-editor.server";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

const setSchema = z.object({
  reps: z.number({ required_error: "Reps are required" }).min(1),
  weight: z.string().optional(),
});

const activitySchema = z.object({
  name: z.string({ required_error: "Please provide a name" }).min(1),
  sets: z
    .array(setSchema)
    .nonempty({ message: "Please provide at least one set" }),
});

export const workoutSchema = z.object({
  userId: z.string(),
  //   title: z.string().optional(),
  title: z.string({ required_error: "Please provide a workout title" }),
  activities: z
    .array(activitySchema)
    .nonempty({ message: "Please provide at least one activity" }),
});

export type Workout = {
  id: string;
  title: string;
  activities: {
    name: string;
    sets: {
      reps: number | null;
      weight: string | null;
    }[];
  }[];
};

export const createEmptyActivity = () => ({
  name: "",
  sets: [
    { reps: "", weight: "" },
    { reps: "", weight: "" },
    { reps: "", weight: "" },
  ],
});

export function WorkoutEditor({
  workout,
  userId,
}: {
  workout?: Workout;
  userId: string;
}) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isCreating = navigation.state === "submitting";
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "workout-form",
    lastResult,
    constraint: getZodConstraint(workoutSchema),
    defaultValue: {
      userId,
      ...workout,
    },

    onValidate({ formData }) {
      const parseResult = parseWithZod(formData, { schema: workoutSchema });
      return parseResult;
    },

    shouldValidate: "onBlur",
  });

  const activitiesFields = fields.activities.getFieldList();

  return (
    <div className="w-[640] mx-auto">
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-4 "
      >
        <Card>
          <button type="submit" className="hidden" />
          <Input
            type="hidden"
            name="userId"
            value={userId}
            className="visually-hidden"
          />
          <CardHeader>
            <CardTitle>Workout</CardTitle>
            <CardDescription>
              Create a new workout consisting of activities and sets.
              <Field
                labelProps={{
                  // htmlFor: activityFields.name.name,
                  children: "Name",
                }}
                inputProps={{
                  ...getInputProps(fields.title, { type: "text" }),
                }}
                errors={fields.title.errors}
                className="grid gap-2 flex-grow"
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {activitiesFields.map((activity, activityIndex) => {
              const activityFields = activity.getFieldset();
              const setsFields = activityFields.sets.getFieldList();
              return (
                <Card>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div className="grid gap-2">
                      <CardTitle>Activity</CardTitle>
                      <CardDescription>
                        Enter a name for this activity
                      </CardDescription>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      {...form.remove.getButtonProps({
                        name: fields.activities.name,
                        index: activityIndex,
                      })}
                    >
                      <Cross1Icon />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Field
                      labelProps={{
                        // htmlFor: activityFields.name.name,
                        children: "Name",
                      }}
                      inputProps={{
                        ...getInputProps(activityFields.name, { type: "text" }),
                      }}
                      errors={activityFields.name.errors}
                      className="grid gap-2 flex-grow"
                    />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Set</TableHead>
                          <TableHead>Reps</TableHead>
                          <TableHead>Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {setsFields.map((set, setIndex) => {
                          const setFields = set.getFieldset();
                          return (
                            <TableRow>
                              <TableCell className="font-semibold text-center">
                                {setIndex + 1}
                              </TableCell>
                              <TableCell>
                                <Field
                                  labelProps={{
                                    htmlFor: setFields.reps.name,
                                    // children: "Reps",
                                  }}
                                  inputProps={{
                                    ...getInputProps(setFields.reps, {
                                      type: "number",
                                    }),
                                  }}
                                  errors={setFields.reps.errors}
                                  className="grid  gap-1"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  labelProps={{
                                    htmlFor: setFields.weight.name,
                                    // children: "Weight",
                                  }}
                                  inputProps={{
                                    ...getInputProps(setFields.weight, {
                                      type: "number",
                                    }),
                                  }}
                                  errors={setFields.weight.errors}
                                  className="grid  gap-2"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-2"
                                  {...form.remove.getButtonProps({
                                    name: `${fields.activities.name}[${activityIndex}].sets`,
                                    index: setIndex,
                                  })}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <div className="flex justify-center mt-2 -mb-2">
                      <Button
                        variant="ghost"
                        className="gap-2"
                        {...form.insert.getButtonProps({
                          name: `${fields.activities.name}[${activityIndex}].sets`,
                        })}
                      >
                        <PlusCircle />
                        Set
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Button
              variant="secondary"
              {...form.insert.getButtonProps({
                name: fields.activities.name,
                defaultValue: createEmptyActivity(),
              })}
            >
              <div className="inline-flex items-center gap-2">
                <PlusCircle />
                Activity
              </div>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <ErrorList id={form.errorId} errors={form.errors} />
            <div className="flex gap-3">
              <Button variant="outline" {...form.reset.getButtonProps()}>
                Reset
              </Button>
              <Button
                type="submit"
                disabled={navigation.state === "submitting"}
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
