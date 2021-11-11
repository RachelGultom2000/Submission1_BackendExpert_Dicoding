/* Thread RepositoryPostgres.test.js */

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'rachel',
          body: 'gultom',
        });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        const fakeIdGenerator = () => '123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread, 'user-123');

        // Assert
        const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          title: 'rachel',
          owner: 'user-123',
        }));
        expect(thread).toHaveLength(1);
      });
    });

    describe('getThreadById', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.getThreadById('thread-1234'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return detail thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'rachelgul',
          body: 'magical mode',
          owner: 'user-123',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const detailThread = await threadRepositoryPostgres.getThreadById('thread-123');

        // Assert
        expect(detailThread[0].title).toEqual('rachelgul');
        expect(detailThread[0].body).toEqual('magical mode');
        expect(detailThread[0].username).toEqual('dicoding');
      });
    });

    describe('getCommentByThreadId', () => {
      it('should return array of Comment in thread', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'rachelgul',
          body: 'magical mode',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          threadId: 'thread-123',
          date: '2021-09-08T07:59:48.766Z',
          isDelete: true,
          owner: 'user-123',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const comments = await threadRepositoryPostgres.getCommentByThreadId('thread-123');

        // Assert
        expect(comments).toHaveLength(2);
      });
    });

    describe('getReplyByThreadId', () => {
      it('should return array of Reply in Comment in thread', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'rachelgul',
          body: 'magical mode',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          threadId: 'thread-123',
          date: '2021-09-08T07:59:48.766Z',
          isDelete: true,
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-321',
          threadId: 'thread-123',
          commentId: 'comment-123',
          date: '2021-09-08T07:59:48.766Z',
          isDelete: true,
          owner: 'user-123',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const replies = await threadRepositoryPostgres.getReplyByThreadId('thread-123');

        // Assert
        expect(replies).toHaveLength(2);
      });
    });

    describe('getlikeByThreadId', () => {
      it('should return array of like in Comment in thread', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'rachelgul',
          body: 'magical mode',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-321',
          threadId: 'thread-123',
          date: '2021-09-08T07:59:48.766Z',
          isDelete: true,
          owner: 'user-123',
        });
        await LikesTableTestHelper.addLike({
          id: 'like-123',
          threadId: 'thread-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const likes = await threadRepositoryPostgres.getlikeByThreadId('thread-123');

        // Assert
        expect(likes).toHaveLength(1);
      });
    });
  });
});
