const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // CREATE
  async addLike(threadId, commentId, owner) {
    const id = `like-${this._idGenerator()}`;

    const getQueryThread = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const resultThread = await this._pool.query(getQueryThread);
    if (!resultThread.rowCount) {
      throw new NotFoundError('tidak bisa menambah like: thread tidak ditemukan');
    }
    const getQueryComment = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const resultComment = await this._pool.query(getQueryComment);
    if (!resultComment.rowCount) {
      throw new NotFoundError('tidak bisa menambah like: komentar tidak ditemukan');
    }

    const getLikeQuery = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, owner],
    };

    const result = await this._pool.query(getLikeQuery);

    return { status: 'success' };
  }

  // REMOVE
  async removeLike(id) {
    const likeQuery = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };
    await this._pool.query(likeQuery);

    return { status: 'success' };
  }

  // GET
  async getLikeDetail(threadId, commentId, owner) {
    const likeQuery = {
      text: 'SELECT * FROM likes WHERE thread_id=$1 AND comment_id=$2 AND owner=$3',
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(likeQuery);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
