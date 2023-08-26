import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API, routerLinks } from '@utils';
import { Message } from '@core/message';
import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@store';
import { PaginationQuery } from '@models';

const name = 'User';
export const action = {
  ...new Action<User>(name),
  post: createAsyncThunk(name + '/post', async (values: User) => {
    // if (values.avatar) values.avatar = values.avatar[0].url;
    if (values.teams) values.teamsId = values.teams as string[];
    const { data, message } = await API.post<User>(routerLinks(name, 'api'), values);
    if (message) Message.success({ text: message });
    return data;
  }),
  put: createAsyncThunk(name + '/put', async ({ id, ...values }: User) => {
    // if (values.avatar) values.avatar = values.avatar[0].url;
    if (values.teams) values.teamsId = values.teams as string[];
    const { data, message } = await API.put<User>(`${routerLinks(name, 'api')}/${id}`, values);
    if (message) Message.success({ text: message });
    return data;
  }),
};
export const userSlice = createSlice(new Slice<User>(action));

export const UserFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<User>),
    set: (values: State<User>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<User>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<User> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: User) => dispatch(action.post(values)),
    put: (values: User) => dispatch(action.put(values)),
    putDisable: (values: { id: string; disable: boolean }) => dispatch(action.putDisable(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
