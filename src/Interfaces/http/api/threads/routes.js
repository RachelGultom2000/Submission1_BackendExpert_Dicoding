const routes = (handler) => ([
  {
  // Menyimpan data threads
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
  // Mengambil data threads berdasarkan ID
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getDetailThreadHandler,
  },
]);

module.exports = routes;
