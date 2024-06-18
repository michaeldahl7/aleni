import { MinusCircle, PlusCircle, PlusIcon } from "lucide-react";

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
import { Field } from "~/components/Forms";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";

import { type action } from "~/utils/__workout-editor.server";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Cross1Icon } from "@radix-ui/react-icons";

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
  title: z.string().optional(),
  //   title: z.string({ required_error: "Please provide a workout title" }),
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

export default function Component({
  workout,
  userId,
}: {
  workout?: Workout;
  userId: string;
}) {
  const navigate = useNavigate();
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

      console.log("parseResult", parseResult);
      return parseResult;
    },

    shouldValidate: "onBlur",
  });

  const activitiesFields = fields.activities.getFieldList();

  return (
    <div className="mx-auto">
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-4 "
      >
        <Card>
          <CardHeader>
            <CardTitle>Workout</CardTitle>
            <CardDescription>
              Create a new workout consisting of activities and sets.
            </CardDescription>
          </CardHeader>
        </Card>

        {activitiesFields.map((activity, activityIndex) => {
          const activityFields = activity.getFieldset();
          const setsFields = activityFields.sets.getFieldList();
          return (
            <Card>
              <CardHeader>
                <CardTitle>Workout</CardTitle>
                <CardDescription>
                  Create a new workout consisting of activities and sets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between relative">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Activity
                  </h4>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-0 "
                    {...form.remove.getButtonProps({
                      name: fields.activities.name,
                      index: activityIndex,
                    })}
                  >
                    <div className="inline-flex items-center ">
                      <Cross1Icon />
                    </div>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a name for this activity
                </p>

                <Field
                  labelProps={{
                    htmlFor: activityFields.name.name,
                    //   children: "Name",
                  }}
                  inputProps={{
                    ...getInputProps(activityFields.name, { type: "text" }),
                  }}
                  errors={activityFields.name.errors}
                  className="grid gap-1 flex-grow"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Set</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Weight</TableHead>
                      {/* <TableHead className="w-[100px]">KG/LB</TableHead> */}
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
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  {...form.insert.getButtonProps({
                    name: `${fields.activities.name}[${activityIndex}].sets`,
                  })}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Set
                </Button>
              </CardFooter>
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
            <PlusIcon />
            Activity
          </div>
        </Button>
        <Card>
          <CardHeader>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button variant="outline" {...form.reset.getButtonProps()}>
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </CardHeader>
        </Card>
      </Form>
    </div>
  );
}
