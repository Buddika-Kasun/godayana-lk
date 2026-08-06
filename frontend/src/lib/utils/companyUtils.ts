export const formatCategory = (category?: string) => {
  if (!category) return "Not specified";
  const categoryMap: Record<string, string> = {
    IT: "IT & Software",
    ENGINEERING: "Engineering",
    MARKETING: "Marketing & Advertising",
    FINANCE: "Finance & Banking",
    HEALTHCARE: "Healthcare",
    EDUCATION: "Education",
    CONSTRUCTION: "Construction",
    HOSPITALITY: "Hospitality",
    RETAIL: "Retail",
    MANUFACTURING: "Manufacturing",
    OTHER: "Other",
  };
  return categoryMap[category.toUpperCase()] || category;
};

export const formatCompanyType = (type?: string) => {
  if (!type) return "Not specified";
  const typeMap: Record<string, string> = {
    PRIVATE: "Private Limited",
    PUBLIC: "Public Limited",
    SOLE: "Sole Proprietorship",
    PARTNERSHIP: "Partnership",
    LLC: "LLC",
    NONPROFIT: "Non-Profit",
  };
  return typeMap[type.toUpperCase()] || type;
};

export const formatEmployeeCount = (count?: number) => {
  if (!count) return "Not specified";
  const countMap: Record<number, string> = {
    1: "1-10 employees",
    2: "11-50 employees",
    3: "51-200 employees",
    4: "201-500 employees",
    5: "501-1000 employees",
    6: "1000+ employees",
  };
  return countMap[count] || `${count} employees`;
};