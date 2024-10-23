import { getSurplusPostId } from "@helpers/api-utils";
import { validateJsonSchema } from "@helpers/schema";
import test, { expect } from "@playwright/test";
import { newPostData, updatePostData } from "@data/post-data";

test("should get all posts", async ({ request }) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/posts",
  );

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.length).toBeGreaterThanOrEqual(1);

  await validateJsonSchema("all_posts", body);
});

test("should get an n-th post", async ({ request }) => {
  const postId = Math.ceil(Math.random() * 10);
  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  await validateJsonSchema("one_post", body);
});

test("should not get a post with ID exceeding posts' list length", async ({
  request,
}) => {
  const postNo = await getSurplusPostId();

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts/${postNo}`,
  );
  const body = await response.json();

  expect(response.status()).toEqual(404);
  await validateJsonSchema("non_existing_post", body);
});

newPostData.forEach(({ dataSet, userId, title, requestBody }) => {
  test(`should add new post with dataSet: ${dataSet}`, async ({ request }) => {
    const response = await request.post(
      "https://jsonplaceholder.typicode.com/posts",
      { data: { userId, title, body: requestBody } },
    );

    const body = await response.json();
    expect(response.ok()).toBeTruthy();
    expect(body.userId).toEqual(userId);
    expect(body.title).toEqual(title);
    expect(body.body).toEqual(requestBody);
    await validateJsonSchema("add_post", body);

    // had to comment out code below
    // turns out posts added via this POST method are not really adding data anywhere (response is mocked)
    // hence I cannot retrieve it to check if added properly (or at all)
    /* const newPostId = body.id;
      const getPostResponse = await request.get(
          `https://jsonplaceholder.typicode.com/posts/${newPostId}`,
      );
      const getPostBody = await getPostResponse.json();
      await validateJsonSchema("one_post", getPostBody); */
  });
});

updatePostData.forEach(({ dataSet, userId, title, requestBody }) => {
  test(`should update a post with dataSet: ${dataSet}`, async ({ request }) => {
    const postId = 1;

    const response = await request.put(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      { data: { userId, title, body: requestBody } },
    );

    const body = await response.json();
    expect(response.ok()).toBeTruthy();
    expect(body.userId).toEqual(userId);
    expect(body.title).toEqual(title);
    expect(body.body).toEqual(requestBody);
    expect(body.id).toEqual(postId);
    await validateJsonSchema("update_post", body);
  });
});

test("should not update a post that doesn't exist", async ({ request }) => {
  const postId = await getSurplusPostId();
  const userId = 16;
  const title = "kalabanga";
  const requestBody = "i do przodu";

  const response = await request.put(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { data: { userId, title, body: requestBody } },
  );

  expect(response.status()).toEqual(500);
});

updatePostData.forEach(({ dataSet, userId, title, requestBody }) => {
  test(`should patch a post with dataSet: ${dataSet}`, async ({ request }) => {
    const postId = 1;

    const response = await request.patch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      { data: { userId, title, body: requestBody } },
    );

    const body = await response.json();
    expect(response.ok()).toBeTruthy();
    if (userId) expect(body.userId).toEqual(userId);
    if (title) expect(body.title).toEqual(title);
    if (requestBody) expect(body.body).toEqual(requestBody);
    expect(body.id).toEqual(postId);
    await validateJsonSchema("update_post", body);
  });
});

test("should delete a post", async ({ request }) => {
  const postId = 1;
  const response = await request.delete(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  await validateJsonSchema("delete_post", body);
});

//skipped because API actually let's you delete a resource that doesn't exist
test.skip("should not delete a post that doesn't exist", async ({
  request,
}) => {
  const postId = await getSurplusPostId();

  const response = await request.delete(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  expect(response.status()).toEqual(200);
  const body = await response.json();
  await validateJsonSchema("delete_post_error", body);
});

test("should return a posts filtered by the user id", async ({ request }) => {
  const userId = 1;

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
  );

  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  expect(body.length).toBeGreaterThanOrEqual(1);
  expect(body[0].userId).toEqual(userId);
  expect(body[0].title).toBeDefined();
  expect(body[0].body).toBeDefined();
  await validateJsonSchema("filter_post", body);
});

test("should return a posts filtered by the title", async ({ request }) => {
  const title = "dolorem eum magni eos aperiam quia";

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts?title=${title}`,
  );

  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  expect(body.length).toBeGreaterThanOrEqual(1);
  expect(body[0].userId).toBeDefined();
  expect(body[0].title).toEqual(title);
  expect(body[0].body).toBeDefined();
  await validateJsonSchema("filter_post", body);
});

test("should return a posts filtered by the post id", async ({ request }) => {
  const id = 1;

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts?id=${id}`,
  );

  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  expect(body.length).toBeGreaterThanOrEqual(1);
  expect(body[0].id).toEqual(id);
  expect(body[0].userId).toBeDefined();
  expect(body[0].title).toBeDefined();
  expect(body[0].body).toBeDefined();
  await validateJsonSchema("filter_post", body);
});

test("should not return any posts with wrong filter", async ({ request }) => {
  const postId = await getSurplusPostId();

  const response = await request.get(
    `https://jsonplaceholder.typicode.com/posts?id=${postId}`,
  );

  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  await validateJsonSchema("filter_post_empty", body);
});
