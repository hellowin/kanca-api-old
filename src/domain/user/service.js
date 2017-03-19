// @flow
import userRepo, { UserRole } from 'infra/repo/user';
import type { UserUpdate } from 'infra/repo/user';
import config from 'config';
import graph from 'infra/service/graph';
import type { DebugToken } from 'infra/service/graph';

const checkAndUpsertUser = (token: string): Promise<any> => {
  let fbUser: FBUser;
  let debugToken: DebugToken;
  const appToken: string = config.fbAppToken || '';

  if (!appToken) return Promise.reject(new Error('Facebook App Token not yet set.'));

  return graph.getProfile(token).then(res => (fbUser = res))

    // fetch profile and debug token first
    .then(() => graph.debugToken(appToken, token))
    .then(res => (debugToken = res))

    // main logic
    .then(() => {
      const data: UserUpdate = {
        facebookId: fbUser.id,
        name: fbUser.name,
        email: fbUser.email,
        token,
        tokenCreated: new Date(),
        tokenExpired: new Date(debugToken.data.expires_at * 1000),
      };
      // check existence
      return userRepo.readByFBId(fbUser.id)
        // exist, update user
        .then(user => {
          const userId: number = user.id;
          if (!userId) throw new Error('User have no ID?');
          userRepo.update(userId, data);
        })
        // not exist, create user
        .catch(() => userRepo.create(data));
    });
};

const setAsAdminByEmail = (email: string, secret: string): Promise<any> => {
  if (secret !== config.appSecret) return Promise.reject(new Error('Secret key not valid'));

  return userRepo.readByEmail(email)
    .then(user => userRepo.update(user.id, { role: UserRole.ADMIN }));
};

const setAsGuestByEmail = (email: string, secret: string): Promise<any> => {
  if (secret !== config.appSecret) return Promise.reject(new Error('Secret key not valid'));

  return userRepo.readByEmail(email)
    .then(user => userRepo.update(user.id, { role: UserRole.GUEST }));
};

export default {
  checkAndUpsertUser,
  setAsAdminByEmail,
  setAsGuestByEmail,
};
