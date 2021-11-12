const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // CREATE 
  async addReply(newReply, threadId, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const now = new Date();
    const date = now.toISOString();
    const isDelete = false;

    const getQueryThread = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const resultThread = await this._pool.query(getQueryThread);
    if (!resultThread.rowCount) {
      throw new NotFoundError('tidak bisa menambah reply: thread tidak ditemukan');
    }
    const getQueryComment = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const resultComment = await this._pool.query(getQueryComment);
    if (!resultComment.rowCount) {
      throw new NotFoundError('tidak bisa menambah reply: komentar tidak ditemukan');
    }

    const getLikeQuery = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, date, isDelete, owner],
    };

    const result = await this._pool.query(getLikeQuery);

    return new AddedReply({ ...result.rows[0] });
  }

  // VERIFY
  async verifyReplyAccess(replyId, credentialId) {
    const replyQuery = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(replyQuery);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // DELETE
  async deleteReplyByReplyId(replyId) {
    const replyQuery = {
      text: 'UPDATE replies set is_delete=true WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(replyQuery);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return { status: 'success' };
  }
}

module.exports = ReplyRepositoryPostgres;
