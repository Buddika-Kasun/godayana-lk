// src/types/job.ts or src/lib/utils/jobUtils.ts

// Experience Levels
export const experienceLevels = [
  { value: "0", label: "Fresher" },
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5+ Years" },
];

// Education Levels
export const educationLevels = [
  { value: "high-school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
];

// Locations
export const locations = [
  { value: "colombo", label: "Colombo" },
  { value: "kandy", label: "Kandy" },
  { value: "galle", label: "Galle" },
  { value: "kegalle", label: "Kegalle" },
  { value: "matara", label: "Matara" },
  { value: "jaffna", label: "Jaffna" },
  { value: "remote", label: "Remote" },
  { value: "other", label: "Other" },
];

// Employment Types
export const employmentTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

// Job Categories
export const jobCategories = [
  { value: "it", label: "IT & Software" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "engineering", label: "Engineering" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" },
];

// Utility functions
export const getLabelFromValue = (
  value: string,
  options: Array<{ value: string; label: string }>,
) => {
  const found = options.find((opt) => opt.value === value);
  return found?.label || value;
};

export const formatExperience = (value: string) =>
  getLabelFromValue(value, experienceLevels);
export const formatEducation = (value: string) =>
  getLabelFromValue(value, educationLevels);
export const formatLocation = (value: string) =>
  getLabelFromValue(value, locations);
export const formatEmploymentType = (value: string) =>
  getLabelFromValue(value, employmentTypes);
export const formatJobCategory = (value: string) =>
  getLabelFromValue(value, jobCategories);
