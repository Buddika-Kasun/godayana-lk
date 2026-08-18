import { courseCategories, courseLevels, migrationPaths, requirementLevels } from "@/types/course";

/**
 * Format course category for display
 */
export const formatCourseCategory = (category?: string): string => {
  if (!category) return "Not specified";
  const found = courseCategories.find((c) => c.value === category);
  return found?.label || category;
};

/**
 * Format migration path for display
 */
export const formatMigrationPath = (path?: string): string => {
  if (!path) return "Not specified";
  const found = migrationPaths.find((p) => p.value === path);
  return found?.label || path;
};

/**
 * Format multiple migration paths for display
 */
export const formatMigrationPaths = (paths?: string[]): string => {
  if (!paths || paths.length === 0) return "Not specified";
  return paths.map((path) => formatMigrationPath(path)).join(", ");
};

/**
 * Format requirement level for display
 */
export const formatRequirementLevel = (level?: string): string => {
  if (!level) return "Not specified";
  const found = requirementLevels.find((l) => l.value === level);
  return found?.label || level;
};

/**
 * Format course level for display
 */
export const formatCourseLevel = (level?: number | string): string => {
  if (!level) return "Not specified";
  const levelStr = level.toString();
  const found = courseLevels.find((l) => l.value == levelStr);
  return found?.label || levelStr;
};

/**
 * Get color for migration path badge
 */
export const getMigrationPathColor = (path?: string): string => {
  if (!path) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  
  const colors: Record<string, string> = {
    sri_lanka: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    uk: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    australia: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    canada: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    japan: "bg-white-100 text-white-800 dark:bg-white-900/30 dark:text-white-400 border-white-200 dark:border-white-800",
    germany: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
    uae: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    qatar: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    usa: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    singapore: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    global: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  };
  
  return colors[path] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
};
