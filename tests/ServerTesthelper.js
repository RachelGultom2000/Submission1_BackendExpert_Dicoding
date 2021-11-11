const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ServerTesthelper =  {
    async getAccessToken({
        id = 'user-123',
        username = 'rachel',
        password = 'gultom',
        fullname = 'rachelgultom',
    }) {
        // Add New User
        const query = {
            text: 'INSERT INTO users VALUES($1,$2,$3,$4)',
            values : [id,username,password,fullname],
        };
        await pool.query(query);

        // Generate Token
        const accessToken = Jwt.token.generate(
            {username,id},
            process.env.ACCESS_TOKEN_KEY,
        );
        const refreshToken = Jwt.token.generate(
            {username, id},
            process.env.REFRESH_TOKEN_KEY,
        );

        // Add Refresh Token to DB
        const authQuery = {
            text : 'INSERT INTO authentications VALUES($1)',
            values:[refreshToken],
        };
        await pool.query(authQuery);

        // Return Generated Access Token
        return accessToken;
    },
    async cleanTable(){
        await pool.query('DELETE FROM authentications WHERE 1=1');
        await pool.query('DELETE FROM users WHERE 1=1');
    },
};

module.exports = ServerTesthelper;