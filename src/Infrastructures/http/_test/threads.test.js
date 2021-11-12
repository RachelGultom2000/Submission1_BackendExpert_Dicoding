const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ServerTesthelper = require('../../../../tests/ServerTesthelper');
const injections = require('../../injections');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

// deklarasikan testing
describe('/threads endpoint', () => {
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
  describe('when POST /threads', () => {
    it('should response 201 and persisted addedThread', async () => {
      // Arrange
      const requestPayload = {
        title: 'rachel',
        body: 'gultom',
      };
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(postResponse.payload);
      expect(postResponse.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.owner).toEqual('user-123');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'rachel',
      };
      const accessToken = await ServerTesthelper.getAccessToken({ id: 'user-123' });
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads',
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

    it('should response 401 when request payload not contain auth', async () => {
      // Arrange
      const requestPayload = {
        title: 'rachel',
        body: 'gultom',

      };
      const server = await createServer(injections);

      // Action
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,

      });

      // Assert
      expect(postResponse.statusCode).toEqual(401);
    });
  });

  // GET
  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted detail thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
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
      const getResponse = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(getResponse.payload);
      expect(getResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 when no thread found', async () => {
      // Arrange
      const server = await createServer(injections);

      // Action
      const getResponse = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(getResponse.payload);
      expect(getResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
