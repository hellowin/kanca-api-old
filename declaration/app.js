// @flow
/* eslint no-undef: 0, no-unused-vars: 0 */
import type { UserRoleType } from 'infra/repo/user';
import type { GroupPrivacyType } from 'infra/repo/group';

declare class AppRequest extends express$Request {
  user: FBUser;
  token: string;
}

declare class AppResponse extends express$Response {
  error: Function;
  ok: Function;
  list: Function;
}

declare type AppNextFunction = express$NextFunction

declare type AppMiddleware =
  ((req: AppRequest, res: AppResponse, next: AppNextFunction) => mixed) |
  ((error: ?Error, req: AppRequest, res: AppResponse, next: AppNextFunction) => mixed)

declare type User = {
  id: number,
  facebookId: string,
  name?: string,
  email?: string,
  role: UserRoleType,
  token?: string,
  tokenCreated?: Date,
  tokenExpired?: Date,
}

declare type FBUser = {
  id: string,
  name: string,
  email?: string,
}

declare type FBError = {
  message: string,
  type: string,
  code: number,
  fbtrace_id: string
}

declare type Group = {
  id: string,
  name: string,
  privacy: GroupPrivacyType,
}
