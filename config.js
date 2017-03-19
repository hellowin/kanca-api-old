// @flow
require('dotenv').config();

module.exports = {
  appSecret: process.env.APP_SECRET,
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  fbAppToken: process.env.FB_APP_TOKEN,
  db: {
    host: process.env.MYSQL_PORT_3306_TCP_ADDR,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
};
