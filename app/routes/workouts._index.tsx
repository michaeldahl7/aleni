// import React from "react";
import { type MetaFunction } from "@remix-run/react";
// import { type loader as workoutsLoader } from './workouts.tsx'

export default function WorkoutsIndexRoute() {
  return (
    <div>
      <p>Select a workout</p>
    </div>
  );
}

// export const meta: MetaFunction<
// 	null,
// 	{ 'routes/users+/$username_+/notes': typeof workouts }
// > = ({ params, matches }) => {
// 	const notesMatch = matches.find(
// 		m => m.id === 'routes/users+/$username_+/notes',
// 	)
// 	const displayName = notesMatch?.data?.owner.name ?? params.username
// 	const noteCount = notesMatch?.data?.owner.notes.length ?? 0
// 	const notesText = noteCount === 1 ? 'note' : 'notes'
// 	return [
// 		{ title: `${displayName}'s Notes | Epic Notes` },
// 		{
// 			name: 'description',
// 			content: `Checkout ${displayName}'s ${noteCount} ${notesText} on Epic Notes`,
// 		},
// 	]
// }
