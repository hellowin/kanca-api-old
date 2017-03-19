// @flow
import moment from 'moment-timezone';
import matrixRepo from 'infra/repo/matrix';
import timeUtil from 'infra/service/time-util';
import { groupFeed as groupFeedOrm } from 'infra/service/orm';

// count group feed posts
const countGroupFeedPostKey = 'group-feed-post-count';
const countGroupFeedPost = (groupId: string, dateStart: Date, dateEnd: Date, granularity: string = 'd', interval: number = 1) => {
  const array = timeUtil.dateRangeParser(dateStart, dateEnd, granularity, interval);
  const promises = array.map((granStart) => {
    const granEnd = moment(granStart).endOf(granularity);

    return groupFeedOrm.count({
      where: {
        groupId,
        createdTime: { $and: { $gt: granStart, $lt: granEnd } },
      },
    })
      .then((count) => matrixRepo.upsertTimeseries(groupId, countGroupFeedPostKey, granStart, granularity, interval, count)
        .then(() => console.log(`counted group post count at ${granStart.format('YYYY-MM-DD')} interval ${granularity} is ${count}`)));
  });

  return Promise.all(promises);
};

const scanCountGroupFeedPost = (groupId: string, dateStart: Date, dateEnd: Date, granularity: string = 'd', interval: number = 1) =>
  matrixRepo.scanTimeseries(groupId, countGroupFeedPostKey, dateStart, dateEnd, granularity, interval);

export default {
  countGroupFeedPost,
  scanCountGroupFeedPost,
};
