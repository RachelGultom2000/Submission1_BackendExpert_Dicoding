const routes = (handler) => ([
    {
        // mengedit atau update data likes
        method: 'PUT',
        path: '/threads/{threadId}/comments/{commentId}/likes',
        handler: handler.performLikeHandler,
        options: {
            auth: 'forumapp_jwt',
        },
    },
]);

module.exports = routes;