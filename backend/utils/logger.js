export const log = (label, data) => {
  console.log(`\n🔹 ${label}`);
  console.log(JSON.stringify(data, null, 2));
};