// @flow
import userController from 'domain/user/controller';
import crawlerController from 'domain/crawler/controller';
import matrixController from 'domain/matrix/controller';

export default [
  { method: 'get', endpoint: '/api/user/profile', controller: userController.profile },
  { method: 'post', endpoint: '/api/user/inject', controller: userController.inject },
  { method: 'post', endpoint: '/api/user/set-admin', controller: userController.setAdmin },
  { method: 'post', endpoint: '/api/user/set-guest', controller: userController.setGuest },

  { method: 'get', endpoint: '/api/crawl/groups', controller: crawlerController.readAllGroups },
  { method: 'post', endpoint: '/api/crawl/group', controller: crawlerController.injectGroup },

  { method: 'post', endpoint: '/api/matrix/group-feed-post-count', controller: matrixController.countGroupFeedPost },
  { method: 'get', endpoint: '/api/matrix/group-feed-post-count', controller: matrixController.readGroupFeedPost },
];
