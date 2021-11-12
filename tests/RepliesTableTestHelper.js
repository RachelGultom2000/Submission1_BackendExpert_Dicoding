
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    content = 'rachel',
    date = '2021-08-08T07:59:48.766Z',
    isDelete = false,
    owner = 'user-123',
  }) {
    const addQuery = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, threadId, commentId, content, date, isDelete, owner],
    };

    await pool.query(addQuery);
  },

  async getReplyById(id) {
    const getQuery = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(getQuery);
    return result.rows;
  },

  async deleteReplyByReplyId(replyId) {
    const deleteQuery = {
      text: 'UPDATE replies set is_delete=true WHERE id = $1',
      values: [replyId],
    };

    await pool.query(deleteQuery);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
