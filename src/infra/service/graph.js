// @flow
import graph from 'fbgraph';
import type { GroupFeed } from 'infra/repo/group-feed';

export type DebugToken = {
  data: {
    app_id: string,
    application: string,
    expires_at: number,
    is_valid: boolean,
    scopes: string[],
    user_id: string
  }
}

export type FBListResult = {
  data: {}[],
  paging?: {
    previous: string,
    next: string
  }
}

const get = (url: string): Promise<any> => new Promise((resolve, reject) => {
  graph.get(url, (err: FBError, fbRes: { [key: string]: any }) => {
    if (err) return reject(new Error(err.message));
    return resolve(fbRes);
  });
});

const debugToken = (appToken: string, userToken: string): Promise<DebugToken> => get(`debug_token?input_token=${userToken}&access_token=${appToken}`)
  .then(res => {
    if (res.data.error) throw new Error(res.data.error.message);
    return res;
  });

const getProfile = (token: string): Promise<FBUser> => get(`me?fields=id,name,email&access_token=${token}`);

const getGroup = (token: string, groupId: string): Promise<Group> => get(`${groupId}?access_token=${token}`);

const getGroupFeeds = (token: string, groupId: string): Promise<FBListResult> => get(`${groupId}/feed?fields=created_time,id,message,updated_time,caption,story,description,from,link,name,picture,status_type,type,shares,permalink_url&access_token=${token}`);

export default {
  get,
  debugToken,
  getProfile,
  getGroup,
  getGroupFeeds,
};
