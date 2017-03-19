// @flow
import graph from 'infra/service/graph';
import crawlerService from './service';

export default {

  readAllGroups: (req: AppRequest, res: AppResponse) => crawlerService.listAllGroups()
    .then(groups => res.list(groups))
    .catch(err => res.error(err, 'READ_ALL_GROUP_ERROR')),

  injectGroup: (req: AppRequest, res: AppResponse) => {
    const groupId: string = (req && req.body && req.body.id && typeof req.body.id === 'string') ? req.body.id : '';

    crawlerService.injectGroup(req.token, groupId)
      .then(() => res.ok('Group has been created.'))
      .catch(err => res.error(err, 'ERROR_INJECT_GROUP'));
  },

  crawlGroupFeeds: (req: AppRequest, res: AppResponse) => {
    const groupId: string = req.params.groupId;

    graph.getGroup(req.token, groupId)
      // don't wait and don't care about the final result
      .then(group => {
        const groupName = group.name || '';
        crawlerService.crawlGroupFeeds(req.token, groupId);
        res.ok(`Crawling group ${groupName}`);
      })
      .catch(err => res.error(err, 'ERROR_CRAWLING_GROUP'));
  },

};
