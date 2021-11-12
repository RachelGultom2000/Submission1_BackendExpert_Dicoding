const routes = (handler) => ([
    {
        // menyimpan data threads
        method: 'POST',
        path  : '/threads/{threadId}/comments',
        handler : handler.postCommentHandler,
        options : {
            auth : 'forumapp_jwt',
        },
    },
    {
        // menghapus data threads
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler : handler.deleteCommentHandler,
        options: {
            auth: 'forumapp_jwt',
        },
    },
]);

module.exports = routes;