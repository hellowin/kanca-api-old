// @flow
import { groupFeed as groupFeedOrm } from 'infra/service/orm';

export type GroupFeed = {
  id: string,
  groupId: string,
  createdTime?: Date,
  updatedTime?: Date,
  message?: string,
  caption?: string,
  story?: string,
  description?: string,
  link?: string,
  name?: string,
  picture?: string,
  fromId?: string,
  statusType?: string,
  type?: string,
  sharesCount?: number,
  permalinkUrl?: string,
}

const upsert = (feed: GroupFeed) =>
  groupFeedOrm.upsert(feed);

const read = (id: string): GroupFeed =>
  groupFeedOrm.findById(id);

const scanByCreatedTime = (dateStart: Date, dateEnd: Date): Array<GroupFeed> =>
  groupFeedOrm.findAll({
    where: {
      createdTime: {
        $and: [
          { $gte: dateStart },
          { $lte: dateEnd },
        ],
      },
    },
  });

export default {
  upsert,
  read,
  scanByCreatedTime,
};
