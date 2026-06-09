export const formatDate = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long", // Outputs: "June"
    day: "numeric", // Outputs: "9"
    year: "numeric", // Outputs: "2026"
  });

  return formattedDate;
};
