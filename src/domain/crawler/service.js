// @flow
import groupRepo from 'infra/repo/group';
import groupFeedRepo from 'infra/repo/group-feed';
import type { GroupFeed } from 'infra/repo/group-feed';
import graph from 'infra/service/graph';
import type { FBListResult } from 'infra/service/graph';

const listAllGroups = (): Promise<Array<Group>> => groupRepo.readAll();

const injectGroup = (token: string, groupId: string): Promise<any> => graph.getGroup(token, groupId)
  .then(group => groupRepo.upsert(group));

const injectGroupFeeds = (feeds: GroupFeed[]): Promise<any> => {
  const promises = feeds.map(feed => groupFeedRepo.upsert(feed));
  return Promise.all(promises);
};

const crawlGroupFeeds = (token: string, groupId: string, next: ?string): Promise<any> => {
  const promise = next ? graph.get(next) : graph.getGroupFeeds(token, groupId);

  return promise
    .then((res: FBListResult) => {
      const feeds = (res.data || []).map((re: { [key: string]: any }) => ({
        id: re.id,
        groupId,
        createdTime: re.created_time,
        updatedTime: re.updated_time,
        message: re.message,
        caption: re.caption,
        story: re.story,
        description: re.description,
        link: re.link,
        name: re.name,
        picture: re.picture,
        fromId: (re.from || {}).id,
        statusType: re.status_type,
        type: re.type,
        sharesCount: (re.shares || {}).count,
        permalinkUrl: re.permalink_url,
      }));
      return injectGroupFeeds(feeds).then(() => res.paging || {});
    })
    .then(paging => {
      const isNext = paging.next;
      let nextPromise;

      if (isNext) {
        nextPromise = crawlGroupFeeds(token, groupId, isNext);
      } else {
        nextPromise = true;
      }

      return nextPromise;
    });
};

export default {
  listAllGroups,
  injectGroup,
  crawlGroupFeeds,
};
