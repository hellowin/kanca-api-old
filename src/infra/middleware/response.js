// @flow

/* eslint no-param-reassign: 0 */
export default (): AppMiddleware => (req: AppRequest, res: AppResponse, next: AppNextFunction) => {

  res.error = (err: Error, code: string = 'UNKNOWN_ERROR') => res.json({
    error: err.message,
    code,
    stack: err.stack,
  });

  res.ok = (message: string = 'ok') => res.json({
    message,
  });

  res.list = (collection: any[]) => res.json({
    collection,
  });

  next();
};
