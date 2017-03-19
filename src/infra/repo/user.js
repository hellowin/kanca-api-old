// @flow
import { user as userOrm } from 'infra/service/orm';

export const UserRole = {
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
};
export type UserRoleType = $Keys<typeof UserRole>

export type UserUpdate = {
  facebookId?: string,
  name?: string,
  email?: string,
  role?: UserRoleType,
  token?: string,
  tokenCreated?: Date,
  tokenExpired?: Date,
}

const create = (user: UserUpdate) =>
  userOrm.create(user);

const readAll = (): Promise<Array<User>> =>
  userOrm.findAll();

const read = (id: string): Promise<User> =>
  userOrm.findById(id);

const readByFBId = (facebookId: string): Promise<User> =>
  userOrm.findOne({ where: { facebookId } })
    .then(res => {
      if (!res || !res.facebookId) throw new Error('Read by FB Id error not found');
      return res;
    });

const readByEmail = (email: string): Promise<User> =>
  userOrm.findOne({ where: { email } })
    .then(res => {
      if (!res || !res.email) throw new Error('Read by email error not found');
      return res;
    });

const update = (id: number, data: UserUpdate) =>
  userOrm.update(data, { where: { id } });

const del = (id: number) =>
  userOrm.destroy({ where: { id } });

export default {
  create,
  readAll,
  read,
  readByFBId,
  readByEmail,
  update,
  delete: del,
};
