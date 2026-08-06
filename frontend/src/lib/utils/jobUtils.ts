export const formatEmploymentType = (type?: string) => {
  if (!type) return "Not specified";
  const typeMap: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    remote: "Remote",
    freelance: "Freelance",
    internship: "Internship",
  };
  return typeMap[type.toLowerCase()] || type;
};
