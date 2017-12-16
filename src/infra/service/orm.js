// @flow
/* eslint new-cap: 0 */

import Sequelize from 'sequelize';
import config from 'config';

const orm = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password, {
    host: config.db.host,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    logging: () => {},
  },
);

const group = orm.define('group',
  {
    id: { type: Sequelize.STRING(255), unique: true, primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(255) },
    privacy: { type: Sequelize.ENUM(['CLOSED', 'OPEN']), defaultValue: 'OPEN' },
  },
);

const user = orm.define('user',
  {
    facebookId: { type: Sequelize.STRING(255), unique: true },
    name: { type: Sequelize.STRING(255) },
    email: { type: Sequelize.STRING(255) },
    role: { type: Sequelize.ENUM(['ADMIN', 'GUEST']), defaultValue: 'GUEST' },
    token: { type: Sequelize.TEXT() },
    tokenCreated: { type: Sequelize.DATE() },
    tokenExpired: { type: Sequelize.DATE() },
  },
);

const groupFeed = orm.define('feed',
  {
    id: { type: Sequelize.STRING(255), unique: true, primaryKey: true, allowNull: false },
    groupId: { type: Sequelize.STRING(255), allowNull: false },
    createdTime: { type: Sequelize.DATE() },
    updatedTime: { type: Sequelize.DATE() },
    message: { type: Sequelize.TEXT() },
    caption: { type: Sequelize.TEXT() },
    story: { type: Sequelize.TEXT() },
    description: { type: Sequelize.TEXT() },
    link: { type: Sequelize.TEXT() },
    name: { type: Sequelize.TEXT() },
    picture: { type: Sequelize.TEXT() },
    fromId: { type: Sequelize.STRING(255) },
    statusType: { type: Sequelize.STRING(255) },
    type: { type: Sequelize.STRING(255) },
    sharesCount: { type: Sequelize.INTEGER() },
    permalinkUrl: { type: Sequelize.TEXT() },
  },
);

const matrixTimeseries = orm.define('matrixTimeseries',
  {
    id: { type: Sequelize.STRING(255), unique: true, primaryKey: true, allowNull: false },
    groupId: { type: Sequelize.STRING(255) },
    key: { type: Sequelize.STRING(255) },
    time: { type: Sequelize.DATE() },
    granularity: { type: Sequelize.STRING(50) },
    interval: { type: Sequelize.INTEGER() },
    value: { type: Sequelize.DOUBLE() },
  },
  {
    indexes: [
      { unique: true, fields: ['time', 'granularity', 'interval', 'groupId', 'key'] },
    ],
  },
);

export {
  orm as default,
  group,
  user,
  groupFeed,
  matrixTimeseries,
};
