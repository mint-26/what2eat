export type UserRole = "adrian" | "janina";
export type MatchType = "exact" | "compromise" | "random";
export type WeekStatus = "active" | "completed";

export interface Profile {
  id: string;
  display_name: string;
  role: UserRole;
  avatar_url: string | null;
  cook_count: number;
  created_at: string;
}

export interface WeeklyPlan {
  id: string;
  week_start: string;
  status: WeekStatus;
  created_at: string;
}

export interface DailySuggestion {
  id: string;
  weekly_plan_id: string | null;
  day_of_week: number;
  date: string;
  user_role: UserRole;
  suggestion_index: number;
  meal_name: string;
  meal_description: string | null;
  cuisine_type: string | null;
  calories_adrian: number | null;
  calories_janina: number | null;
  protein_grams: number | null;
  prep_time_minutes: number | null;
  spice_level: number | null;
  recipe_json: RecipeJSON | null;
  meal_image_url: string | null;
  created_at: string;
}

export interface UserSelection {
  id: string;
  date: string;
  user_role: UserRole;
  selected_suggestion_id: string;
  selected_at: string;
}

export interface MatchResult {
  id: string;
  date: string;
  matched_meal_name: string;
  matched_recipe_json: RecipeJSON;
  matched_image_url: string | null;
  who_cooks: UserRole;
  match_type: MatchType;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  weekly_plan_id: string | null;
  items: ShoppingItem[];
  created_at: string;
}

export interface MealHistory {
  id: string;
  meal_name: string;
  date_cooked: string;
  rating_adrian: number | null;
  rating_janina: number | null;
  would_repeat: boolean;
  image_url: string | null;
}

// Recipe JSON structure
export interface RecipeJSON {
  ingredients: Ingredient[];
  steps: string[];
  equipment: string[];
  spice_note: string;
  nutrition_per_person: {
    adrian: NutritionInfo;
    janina: NutritionInfo;
  };
}

export interface Ingredient {
  name: string;
  amount_adrian: string;
  amount_janina: string;
  unit: string;
  category: string;
  image_url?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  unit: string;
  category: string;
  checked: boolean;
  image_url?: string;
}

// Supabase Database type (simplified for what2eat schema)
export interface Database {
  what2eat: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { display_name: string; role: UserRole };
        Update: Partial<Profile>;
      };
      weekly_plans: {
        Row: WeeklyPlan;
        Insert: Partial<WeeklyPlan> & { week_start: string };
        Update: Partial<WeeklyPlan>;
      };
      daily_suggestions: {
        Row: DailySuggestion;
        Insert: Partial<DailySuggestion> & {
          day_of_week: number;
          date: string;
          user_role: UserRole;
          suggestion_index: number;
          meal_name: string;
        };
        Update: Partial<DailySuggestion>;
      };
      user_selections: {
        Row: UserSelection;
        Insert: Partial<UserSelection> & {
          date: string;
          user_role: UserRole;
          selected_suggestion_id: string;
        };
        Update: Partial<UserSelection>;
      };
      match_results: {
        Row: MatchResult;
        Insert: Partial<MatchResult> & {
          date: string;
          matched_meal_name: string;
          matched_recipe_json: RecipeJSON;
          who_cooks: UserRole;
        };
        Update: Partial<MatchResult>;
      };
      shopping_lists: {
        Row: ShoppingList;
        Insert: Partial<ShoppingList> & { items: ShoppingItem[] };
        Update: Partial<ShoppingList>;
      };
      meal_history: {
        Row: MealHistory;
        Insert: Partial<MealHistory> & {
          meal_name: string;
          date_cooked: string;
        };
        Update: Partial<MealHistory>;
      };
    };
  };
}
