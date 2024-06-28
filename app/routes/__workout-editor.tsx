import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

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
  useNavigation,
} from "@remix-run/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";

import { type action } from "~/utils/__workout-editor.server";
import { Input } from "~/components/ui/input";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

const setSchema = z.object({
  reps: z.number({ required_error: "Reps are required" }).min(1),
  weight: z.number().optional(),
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
      weight: number | null;
    }[];
  }[];
};

export const createEmptyActivity = () => ({
  name: "",
  sets: [
    { reps: null, weight: null },
    { reps: null, weight: null },
    { reps: null, weight: null },
  ],
});

export function WorkoutEditor({
  workout,
  userId,
}: {
  workout?: Workout;
  userId: string;
}) {

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
    <div className="w-[600px]">
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
            <CardTitle>New Workout</CardTitle>
            <CardDescription>
              Create a new workout consisting of one or more activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field
              labelProps={{
                htmlFor: fields.title.name,
                children: "Workout Title",
              }}
              inputProps={{
                ...getInputProps(fields.title, { type: "text" }),
                placeholder: "e.g. Chest, Legs, Back, etc.",
              }}
              errors={fields.title.errors}
              className=" grid gap-2 flex-grow"
            />
            {activitiesFields.map((activity, activityIndex) => {
              const activityFields = activity.getFieldset();
              const setsFields = activityFields.sets.getFieldList();
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex justify-between">
                        Activity
                        <Button
                          variant="outline"
                          {...form.remove.getButtonProps({
                            name: fields.activities.name,
                            index: activityIndex,
                          })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <Field
                        labelProps={{
                          htmlFor: activityFields.name.name,
                          children: "Name",
                        }}
                        inputProps={{
                          ...getInputProps(activityFields.name, {
                            type: "text",
                          }),
                          placeholder: "e.g. Squats, Lunges, Crunches, etc.",
                        }}
                        errors={activityFields.name.errors}
                        className="font-normal leading-normal tracking-normal grid gap-2"
                      />
                    </CardTitle>
                    {/* <CardDescription>
                        Enter (one or more) sets to this activity, which
                        consists of a at least one rep and optional weight.
                      </CardDescription> */}
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
                                  <MinusCircle />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <div className="flex justify-center border-t mt-3 pt-2 -mb-2">
                      <Button
                        className="gap-2 w-1/2"
                        variant="ghost"
                        {...form.insert.getButtonProps({
                          name: `${fields.activities.name}[${activityIndex}].sets`,
                        })}
                      >
                        <PlusCircle />
                        <p className="text-lg">Set</p>
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
              <div className="flex items-center gap-2">
                <PlusCircle />
                <p className="text-lg">Activity</p>
              </div>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center my-5">
            <ErrorList id={form.errorId} errors={form.errors} />
            <div className="flex gap-4">
              <Button variant="outline" {...form.reset.getButtonProps()}>
                Clear
              </Button>
			  <input type="hidden" name="intent" value="create" />
              <Button
                type="submit"
                disabled={navigation.state === "submitting"}
              >
                {isCreating ? "Submitting..." : "Submit"}
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
