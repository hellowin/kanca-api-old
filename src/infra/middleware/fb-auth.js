// @flow
import graph from 'infra/service/graph';

/* eslint no-param-reassign: 0 */
export default (): AppMiddleware => (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
  const token: string = req.cookies['fb-auth-token'] || '';
  graph.getProfile(token)
    .then((user: FBUser) => {
      req.user = user;
      req.token = token;
      next();
    })
    .catch((err: Error) => {
      res.error(err, 'FORBIDDEN');
    });
};
