import { db } from "~/db/config.server"; // Adjust the import according to your db setup
import { sets, activities, workouts } from "~/db/schema.server"; // Adjust the import according to your schema file
import { config } from "dotenv";

// Load environment variables
config();

async function deleteAllRecords() {
  try {
    // Delete all records from the sets table
    await db.delete(sets).execute();

    // Delete all records from the activities table
    await db.delete(activities).execute();

    // Delete all records from the workouts table
    await db.delete(workouts).execute();

    console.log("All records deleted successfully.");
  } catch (error) {
    console.error("Error deleting records:", error);
  }
}

// Example usage
deleteAllRecords();
