export const getSurplusPostId = async () => {
  const getResponse = await fetch("https://jsonplaceholder.typicode.com/posts");
  const getBody = await getResponse.json();
  const surplus = 2;
  return getBody.length + surplus;
};
