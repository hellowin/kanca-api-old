// @flow
import moment from 'moment-timezone';
import { matrixTimeseries as matrixTimeserieOrm } from '../service/orm';

export type TimeSeries = {
  groupId: string,
  key: string,
  time: Date,
  granularity: string,
  interval: number,
  value: number,
}

const timeSeriesIdGenerator = (groupId: string, key: string, time: Date, granularity: string, interval: number): string => {
  const timeString = moment(time).toISOString();
  return `${groupId}-${key}-${timeString}-${granularity}-${interval}`;
};

const upsertTimeseries = (groupId: string, key: string, time: Date, granularity: string, interval: number, value: number): Promise<any> => {
  const id = timeSeriesIdGenerator(groupId, key, time, granularity, interval);
  console.log(id);
  const data = {
    id,
    groupId,
    key,
    time,
    granularity,
    interval,
    value,
  };
  return matrixTimeserieOrm.upsert(data);
};

const scanTimeseries = (groupId: string, key: string, dateStart: Date, dateEnd: Date, granularity: string, interval: number): Promise<TimeSeries[]> => {
  const granStart = moment(dateStart).startOf(granularity);
  const granEnd = moment(dateEnd).endOf(granularity);

  return matrixTimeserieOrm.sync()
    .then(() => matrixTimeserieOrm.findAll({
      where: {
        groupId,
        key,
        granularity,
        interval,
        time: { $and: { $gte: granStart, $lt: granEnd } },
      },
      order: [['time', 'ASC']],
    }))
    .then(ins => ins.map(int => int.toJSON()));
};

export default {
  upsertTimeseries,
  scanTimeseries,
};
