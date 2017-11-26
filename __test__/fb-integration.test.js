import config from 'config';
import graph from 'infra/service/graph';
import userService from 'domain/user/service';
import crawlerService from 'domain/crawler/service';
import userRepo, { UserRole } from 'infra/repo/user';
import { user as userOrm, group as groupOrm, groupFeed as groupFeedOrm } from 'infra/service/orm';

// variable used in test
const appToken = config.fbAppToken;
const userToken = '';
const groupId = '1920036621597031';
const timeoutInterval = 30000;

const getUserByToken = (): Promise<User> =>
  graph.getProfile(userToken).then(fbUser => userRepo.readByFBId(fbUser.id));

beforeAll(() => Promise.all([
  userOrm.sync(),
  groupOrm.sync(),
  groupFeedOrm.sync(),
]).then(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutInterval;
}));

afterAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
});

describe('Facebook integration test', () => {
  describe('graph interface', () => {
    test('check token validation', () => graph.debugToken(appToken, userToken)
      .then(res => {
        expect(res.data.app_id).toBeDefined();
        expect(res.data.application).toBeDefined();
        expect(res.data.expires_at).toBeDefined();
        expect(res.data.is_valid).toBeDefined();
        expect(res.data.scopes).toBeDefined();
        expect(res.data.user_id).toBeDefined();
        expect(res.data.error).toBeUndefined();
      }));

    test('test get profile from user token', () => graph.getProfile(userToken)
      .then(fbUser => {
        expect(fbUser.id).toBeDefined();
        expect(fbUser.name).toBeDefined();
        expect(fbUser.email).toBeDefined();
      }));
  });

  describe('user service', () => {
    test('inject token naturally', () => userService.checkAndUpsertUser(userToken));

    test('inject token from new user', () => getUserByToken().then(user => userRepo.delete(user.id))
      .then(() => userService.checkAndUpsertUser(userToken)));

    test('inject token again to make sure upsert mechanism works', () => userService.checkAndUpsertUser(userToken));

    test('set injected user as admin', () => {
      let user;
      return getUserByToken().then(res => (user = res))
      .then(() => userService.setAsAdminByEmail(user.email, config.appSecret))
      .then(() => userRepo.read(user.id))
      .then(modUser => {
        expect(modUser.role).toBe(UserRole.ADMIN);
      });
    });

    test('set injected user as guest', () => {
      let user;
      return getUserByToken().then(res => {
        user = res;
        expect(user.role).toBe(UserRole.ADMIN);
      })
      .then(() => userService.setAsGuestByEmail(user.email, config.appSecret))
      .then(() => userRepo.read(user.id))
      .then(modUser => {
        expect(modUser.role).toBe(UserRole.GUEST);
      });
    });
  });

  describe('group service', () => {
    test('able to fetch group', () => crawlerService.listAllGroups()
      .then(res => {
        expect(res.length).toBeDefined();
      }));

    test('able to create or update group', () => crawlerService.injectGroup(userToken, groupId)
      .then(() => crawlerService.listAllGroups())
      .then(res => {
        expect(res.length).toBeDefined();
        expect(res.length).toBeGreaterThan(0);
        expect(res.map(grp => grp.id)).toContain(groupId);
      }));

    test('able to handle injected random group', () => crawlerService.injectGroup(userToken, 'xxx')
      .catch(err => {
        expect(err).toBeDefined();
      }));

    test('crawl group feeds', () => groupFeedOrm.destroy({ truncate: true })
      .then(() => crawlerService.crawlGroupFeeds(userToken, groupId))
      .then(() => groupFeedOrm.count())
      .then(count => {
        expect(count).toBeGreaterThan(0);
      }));

    test('crawler able to handle random group id', () => crawlerService.crawlGroupFeeds(userToken, 'xxx')
      .catch(err => {
        expect(err).toBeDefined();
      }));
  });
});
