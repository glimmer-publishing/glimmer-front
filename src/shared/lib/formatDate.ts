export const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};
