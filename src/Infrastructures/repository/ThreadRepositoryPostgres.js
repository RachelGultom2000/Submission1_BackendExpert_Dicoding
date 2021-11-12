const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // CREATE
  async addThread(newThread, owner) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const now = new Date();
    const date = now.toISOString();

    const addThreadQuery = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(addThreadQuery);
    // console.log(query);

    return new AddedThread({ ...result.rows[0] });
  }

  // GET Comment
  async getCommentByThreadId(threadId) {
    const getCommentQuery = {
      text: `SELECT comments.*, users.username 
            FROM comments LEFT JOIN users ON users.id = comments.owner
            WHERE comments.thread_id = $1 
            ORDER BY date ASC`,
      values: [threadId],
    };
    const responseComments = await this._pool.query(getCommentQuery);
    return responseComments.rows;
  }

  // GET Reply
  async getReplyByThreadId(threadId) {
    const getRepliesQuery = {
      text: `SELECT replies.*, users.username 
          FROM replies LEFT JOIN users ON users.id = replies.owner
          WHERE replies.thread_id = $1 
          ORDER BY date ASC`,
      values: [threadId],
    };
    const responseReplies = await this._pool.query(getRepliesQuery);
    return responseReplies.rows;
  }

  // GET Like
  async getlikeByThreadId(threadId) {
    const getLikesQuery = {
      text: `SELECT * FROM likes
          WHERE thread_id = $1`,
      values: [threadId],
    };
    const responselikes = await this._pool.query(getLikesQuery);
    return responselikes.rows;
  }

  // GET Thread
  async getThreadById(threadId) {
    const getThreadQuery = {
      text: `SELECT threads.*, users.username 
      FROM threads LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(getThreadQuery);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
