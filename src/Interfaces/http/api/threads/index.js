const ThreadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { injections }) => {
    const threadsHandler = new ThreadHandler(injections);
    server.route(routes(threadsHandler));
  },
};
