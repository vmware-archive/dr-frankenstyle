export default async function(promise, errorText) {
  let result;
  try {
    result = await promise;
  } catch (e) {
    console.error(errorText || e.stack);
    throw e;
  }
  return result;
}