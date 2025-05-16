import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type UUID = string; // We can modified by zod or prisma later.
export type Timestamp = string;
export type Integer4 = number;

export type UsersTable = {
  id: UUID;
  email: string;
  name: string;
  created_at: Timestamp;
};

export type DiarysTable = {
  diary_id: UUID;
  owner: UUID;
  create_time: Timestamp;
  category: string;
};

export type DiaryFoodTable = {
  id: UUID;
  diarys_id: UUID;
  food_id: Integer4;
  create_time: Timestamp;
};

export type DiaryExerciseTable = {
  id: UUID;
  diarys_id: UUID;
  avg_heartrate: Float;
  duration: Integer4;
  create_time: Timestamp;
};

export type FoodDataTable = {
  food_id: Integer4;
  food_name: string;
  carbohydrates: Float;
  protein: Float;
  create_id: UUID;
  create_date: Timestamp;
};
