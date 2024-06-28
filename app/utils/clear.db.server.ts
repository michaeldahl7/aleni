import { db } from "~/db/config.server"; // Adjust the import according to your db setup
import { workouts, users } from "~/db/schema.server"; // Adjust the import according to your schema file

async function deleteAllRecords() {
  try {
	//right now all records are deleted if you delete users
	await db.delete(users).execute();

  } catch (error) {
    console.error("Error deleting records:", error);
  }
}

// Example usage
deleteAllRecords();
