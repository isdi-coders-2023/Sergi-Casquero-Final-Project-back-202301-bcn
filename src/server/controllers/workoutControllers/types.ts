export interface WorkoutStructure {
  name: string;
  description: string;
  difficulty: string;
  image: string;
  exercises: string[];
}

export type WorkoutsStructure = WorkoutStructure[];
