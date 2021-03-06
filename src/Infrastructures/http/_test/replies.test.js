const pool = require('../../database/postgres/pool');
const ServerTesthelper = require('../../../../tests/ServerTesthelper');
const injections = require('../../injections');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

// deklarasikan testing
describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTesthelper.cleanTable();
  });

  // POST
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted addedReply', async () => {
      // Arrange
      const requestPayload = {
        content: 'rachel gultom',
      };
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'rachelgul',
        body: 'mode',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(postResponse.payload);
      expect(postResponse.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'rachelgul',
        body: 'mode',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(postResponse.payload);
      expect(postResponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when request request not contain auth', async () => {
      // Arrange
      const requestPayload = {
        content: 'rachel gultom',
      };
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,

      });

      // Assert
      expect(postResponse.statusCode).toEqual(401);
    });

    it('should response 404 when thread or comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'rachel gultom',
      };
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments/xxx/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(postResponse.payload);
      expect(postResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  // GET
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and success', async () => {
      // Arrange
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'rachelgul',
        body: 'mode',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when no reply found', async () => {
      // Arrange
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      const server = await createServer(injections);

      // Action
      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(deleteResponse.payload);
      expect(deleteResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when request request not contain auth', async () => {
      // Arrange
      const server = await createServer(injections);

      // Action
      const deleteResponse = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/xxx',
      });

      // Assert
      expect(deleteResponse.statusCode).toEqual(401);
    });
  });
});
