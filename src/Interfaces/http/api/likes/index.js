const LikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'likes', // instance (tabel)
    register: async(server, {injections}) => {
        const likeHandler = new LikeHandler(injections);
        server.route(routes(likeHandler));
    },
};