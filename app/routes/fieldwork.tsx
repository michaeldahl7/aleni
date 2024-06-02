import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Field, ErrorList } from "~/components/Forms";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@remix-run/react";

export default function WorkoutForm() {
  return (
    //className="overflow-hidden rounded-[0.5rem] border bg-background shadow"
    <Form method="post">
      <Card className="w-[640px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl">Create workout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Workout Name</Label>
            <Input id="name" placeholder="Legs, Back, Chest, etc." />
          </div>

          <div className="grid gap-2">
            <div className="flex align-baseline justify-between">
              <Label htmlFor="name">Activity</Label>
              <Label className="text-destructive">error text</Label>
            </div>
            <Input name="set" placeholder="Squat" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            <div className="grid col-span-3 gap-2">
              <div className="flex align-baseline justify-between">
                <Label htmlFor="reps">Reps</Label>
                <Label className="text-destructive">
                  Please provide number of reps
                </Label>
              </div>
              <Input name="reps" placeholder="10" />
            </div>
            <div className="grid col-span-3 gap-2">
              <div className="flex align-baseline justify-between">
                <Label htmlFor="weight">Weight</Label>
                <Label className="text-destructive">error text</Label>
              </div>
              <Input name="weight" placeholder="120" />
            </div>
            <Button variant="destructive" className="grid gap-2 self-end">
              Remove
            </Button>
          </div>
          <div>
            <Button>+</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

////grid grid-cols-2 gap-6
