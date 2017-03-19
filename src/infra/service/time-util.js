// @flow
import moment from 'moment-timezone';

const dateRangeParser = (dateStart: Date, dateEnd: Date, granularity: string, interval: number): moment.Moment[] => {
  // define start and end time
  const granStart = moment(dateStart).startOf(granularity);
  const granEnd = moment(dateEnd).endOf(granularity);

  const cursor = moment(granStart);
  const array: moment.Moment[] = [];
  while (cursor.valueOf() < granEnd.valueOf()) {
    array.push(moment(cursor));
    cursor.add(interval, granularity);
  }

  return array;
};

export default { dateRangeParser };
