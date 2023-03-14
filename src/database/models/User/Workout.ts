import { model, Schema } from "mongoose";

const workoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  exercises: {
    type: Array,
    required: true,
  },
});

const Workout = model("Workout", workoutSchema, "workouts");

export default Workout;
