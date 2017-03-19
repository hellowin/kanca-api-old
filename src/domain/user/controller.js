//  @flow
import userService from './service';

export default {

  profile: (req: AppRequest, res: AppResponse) => {
    res.json(req.user);
  },

  inject: (req: AppRequest, res: AppResponse) => {
    userService.checkAndUpsertUser(req.token)
      .then(() => res.ok('token has been injected'))
      .catch(err => res.error(err, 'FAILED_INJECT'));
  },

  setAdmin: (req: AppRequest, res: AppResponse) => {
    const secret: string = (req && req.body && req.body.secret && typeof req.body.secret === 'string') ? req.body.secret : '';
    const email: string = (req && req.body && req.body.email && typeof req.body.email === 'string') ? req.body.email : '';
    userService.setAsAdminByEmail(email, secret)
      .then(() => res.ok(`${email} has become admin`))
      .catch(err => res.error(err));
  },

  setGuest: (req: AppRequest, res: AppResponse) => {
    const secret: string = (req && req.body && req.body.secret && typeof req.body.secret === 'string') ? req.body.secret : '';
    const email: string = (req && req.body && req.body.email && typeof req.body.email === 'string') ? req.body.email : '';
    userService.setAsGuestByEmail(email, secret)
      .then(() => res.ok(`${email} has become guest`))
      .catch(err => res.error(err));
  },

};
