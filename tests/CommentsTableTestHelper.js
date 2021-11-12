const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        threadId = 'thread-123',
        content = 'rachel',
        date = '2021-08-08T07:59:48.766Z',
        isDelete = false,
        owner = 'user-123',
    }) { 
        const addQuery = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
            values : [id ,threadId, content, date, isDelete, owner],
        };

        await pool.query(addQuery);
    },

    async getCommentById(id){
        const getQuery = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(getQuery);
        return result.rows;
    },

    async deleteCommentByIdCommentId(commentid){
        const deleteQuery = {
            text: 'UPDATE comments set is_delete=true WHERE id = $1',
            values : [commentid],
        };

        await pool.query(deleteQuery);
    },

    async cleanTable(){
        await pool.query("DELETE FROM comments WHERE 1=1");
    },

};

module.exports = CommentsTableTestHelper;