export const formatPrice = (price?: number) => {
  if (!price) return "Free";
  if (price === 0) return "Free";
  return `LKR ${price.toLocaleString()}`;
};
