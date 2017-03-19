// @flow
import groupRepo from 'infra/repo/group';
import groupFeed from './group-feed';

export default {

  countGroupFeedPost: (req: AppRequest, res: AppResponse) => {
    const dateStart = new Date(req.query.date_start);
    const dateEnd = new Date(req.query.date_end);

    try {
      groupRepo.readAll()
        .then((groups) => {
          const groupIds = groups.map(group => group.id);
          groupIds.forEach((groupId) => {
            groupFeed.countGroupFeedPost(groupId, dateStart, dateEnd, 'd', 1);
            groupFeed.countGroupFeedPost(groupId, dateStart, dateEnd, 'w', 1);
            groupFeed.countGroupFeedPost(groupId, dateStart, dateEnd, 'M', 1);
            groupFeed.countGroupFeedPost(groupId, dateStart, dateEnd, 'Y', 1);
          });
        });

      res.ok(`Counting group feed post from ${dateStart.toISOString()} to ${dateEnd.toISOString()}`);
    } catch (err) {
      res.error(err);
    }
  },

  readGroupFeedPost: (req: AppRequest, res: AppResponse) => {
    const groupId = req.query.group_id;
    const dateStart = new Date(req.query.date_start);
    const dateEnd = new Date(req.query.date_end);
    const granularity = req.query.granularity;
    const interval = 1;

    groupFeed.scanCountGroupFeedPost(groupId, dateStart, dateEnd, granularity, interval)
      .then(arr => res.list(arr))
      .catch(err => res.error(err));
  },

};
