import React from 'react';
import { useLoaderData, Link } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getFullWorkouts } from "~/db/workout.server";
import { Flex, Text, Box, Heading, TextField} from '@radix-ui/themes';

interface Workout {
  id: number;
  userId: number;
  date: string;
  title: string;
  createdAt: string;
  activities: Activity[];
}
interface Activity  { 
  id: number
  name: string; 
  sets: Set[] 
}

interface Set { 
  reps: number;
  weight: string | null; 
  order: number;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  // Get workouts of user from database
  try {
    const workouts = await getFullWorkouts(user.id!);
    return json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return json({ error: "Failed to load workouts" }, { status: 500 });
  }
  
};


const formatWeight = (weight: string | null) => {
  if (weight === null || weight === '') {
    return 'N/A';
  }
  const weightNumber = parseFloat(weight);
  return weightNumber % 1 === 0 ? weightNumber.toFixed(0) : weightNumber.toFixed(2);
};

interface SetProps {
  set: Set;
}

const SetComponent: React.FC<SetProps> = ({ set }) => (
  <Flex direction="row" justify="start" gap="3">
    <Text>Set {set.order + 1}</Text>
    <Text>Reps: {set.reps ?? 'N/A'}</Text>
    <Text>Weight: {formatWeight(set.weight)}</Text>
  </Flex>
);

interface ActivityProps {
  activity: Activity;
}

const ActivityComponent: React.FC<ActivityProps> = ({ activity }) => (
  <Box >
    <Heading as="h3" mb="1" >Activity: {activity.name}</Heading>
    {activity.sets.map((set, index) => (
      <SetComponent key={index} set={set} />
    ))}
  </Box>
);



interface WorkoutProps {
  workout: Workout;
}

const WorkoutComponent: React.FC<WorkoutProps> = ({ workout }) => (
  
  <div>
    <h2>Workout: {workout.title}</h2>
    <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
    {workout.activities.map(activity => (
      <ActivityComponent key={activity.id} activity={activity} />
    ))}
  </div>
);

export default function Workouts() {
  const workouts = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Workouts</h1>
      <ul>
        {workouts.map((workout: Workout) => (
          
          <WorkoutComponent key={workout.id} workout={workout} />
        ))}
      </ul>
      <Link to="/workouts/new">Add New Workout</Link>
    </div>
  );
};

