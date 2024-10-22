import { validateJsonSchema } from "@helpers/schema";
import test, { expect } from "@playwright/test";

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
    const postNo = Math.floor(Math.random() * 10);
    const response = await request.get(
        `https://jsonplaceholder.typicode.com/posts/${postNo}`,
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    await validateJsonSchema("one_post", body);
});

test('should not get a post with ID exceeding posts\' list length', async ({ request }) => {
    const allResponse = await request.get(
        "https://jsonplaceholder.typicode.com/posts",
    );
    const allBody = await allResponse.json();
    const surplus = 2;
    const postNo = allBody.length + surplus;

    const response = await request.get(
        `https://jsonplaceholder.typicode.com/posts/${postNo}`,
    );
    const body = await response.json();

    expect(response.status()).toEqual(404);
    await validateJsonSchema("non_existing_post", body);
});

test('should add new post', async ({ request }) => {
    const response = await request.post(
        "https://jsonplaceholder.typicode.com/posts", { data: { userId: 16, title: "kalabanga", body: "i do przodu" } }
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    await validateJsonSchema("add_post", body);

    // had to comment out code below
    // turns out posts added via this POST method are not really added anywhere (response is mocked)
    // hence I cannot retrieve it to check if added properly (or at all)
    /* const newPostId = body.id;
    const getPostResponse = await request.get(
        `https://jsonplaceholder.typicode.com/posts/${newPostId}`,
    );
    const getPostBody = await getPostResponse.json();
    await validateJsonSchema("one_post", getPostBody); */
})


