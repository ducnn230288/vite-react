import { Message } from '@core/message';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API, routerLinks } from '@utils';

import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@store';
import { CommonEntity, PaginationQuery, EStatusState } from '@models';

const name = 'DayOff';
const action = {
  ...new Action<DayOff>(name),
  post: createAsyncThunk(name + '/post', async ({ dateLeave, ...values }: DayOff) => {
    values.dateLeaveStart = dateLeave![0];
    values.dateLeaveEnd = dateLeave![1];
    const { data, message } = await API.post<DayOff>(routerLinks(name, 'api'), values);
    if (message) Message.success({ text: message });
    return data;
  }),
  putStatus: createAsyncThunk(name + '/putStatus', async ({ id, ...values }: DayOff) => {
    if (!values.status) values.status = -1;
    const { data, message } = await API.put<DayOff>(`${routerLinks(name, 'api')}/${id}/status`, values);
    if (message) Message.success({ text: message });
    return data;
  }),
};
export const dayoffSlice = createSlice(
  new Slice<DayOff>(action, { isVisibleDetail: false, isVisibleReject: false }, (builder) => {
    builder
      .addCase(action.putStatus.pending, (state: StateDayOff<DayOff>) => {
        state.isLoading = true;
        state.status = EStatusState.putStatusPending;
      })
      .addCase(action.putStatus.fulfilled, (state: StateDayOff<DayOff>, action: PayloadAction<DayOff>) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isVisibleReject = false;
        state.isVisibleDetail = false;
        state.status = EStatusState.putStatusFulfilled;
      })
      .addCase(action.putStatus.rejected, (state: StateDayOff<DayOff>) => {
        state.isLoading = false;
        state.status = EStatusState.putStatusRejected;
      });
  }),
);
interface StateDayOff<T> extends State<T> {
  isVisibleDetail?: boolean;
  isVisibleReject?: boolean;
}
export const DayoffFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as StateDayOff<DayOff>),
    set: (values: StateDayOff<DayOff>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<DayOff>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof StateDayOff<DayOff> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: DayOff) => dispatch(action.post(values)),
    put: (values: DayOff) => dispatch(action.put(values)),
    putStatus: (values: DayOff) => dispatch(action.putStatus(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class DayOff extends CommonEntity {
  constructor(
    public dateLeave?: Date[],
    public code?: string,
    public type?: number,
    public status: number = 0,
    public reason?: string,
    public time?: number,
    public timeNumber?: number,
    public image?: string,
    public dateLeaveStart?: Date,
    public dateLeaveEnd?: Date,
    public approvedAt?: Date,
    public approvedById?: string,
    public approvedBy?: User,
    public reasonReject?: string,
    public staff?: User,
    public managerId?: string,
    public manager?: User,
  ) {
    super();
  }
}
