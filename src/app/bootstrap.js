import {
  group,
  user,
  groupFeed,
  matrixTimeseries,
} from 'infra/service/orm';

export default () => {
  const promises = [
    // sync all models
    group.sync(),
    user.sync(),
    groupFeed.sync(),
    matrixTimeseries.sync(),
  ];

  // return promise
  return Promise.all(promises);
};
