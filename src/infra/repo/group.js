// @flow
import { group as groupOrm } from 'infra/service/orm';

export const GroupPrivacy = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};
export type GroupPrivacyType = $Keys<typeof GroupPrivacy>

export type GroupUpdate = {
  name: string,
  privacy: GroupPrivacyType,
}

const upsert = (group: Group) =>
  groupOrm.upsert(group);

const readAll = (): Promise<Array<Group>> =>
  groupOrm.findAll();

const read = (id: string): Promise<Group> =>
  groupOrm.findById(id);

const del = (id: string) =>
  groupOrm.destroy({ where: { id } });

export default {
  upsert,
  readAll,
  read,
  delete: del,
};
