/* LikesTableTestHelper */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
  }) {
    const addQuery = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, owner],
    };

    await pool.query(addQuery);
  },

  async getLikeDetail(threadId, commentId, owner) {
    const getQuery = {
      text: 'SELECT * FROM likes WHERE thread_id=$1 AND comment_id=$2 AND owner=$3',
      values: [threadId, commentId, owner],
    };

    const result = await pool.query(getQuery);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
