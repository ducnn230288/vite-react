import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector, Action, Slice, State, User, CodeType, Code } from '@store';
import { CommonEntity, PaginationQuery } from '@models';
import { type Dayjs } from 'dayjs';

const name = 'Booking';
const action = new Action<Booking>(name);
export const bookingSlice = createSlice(new Slice<Booking>(action));

export const BookingFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<Booking>),
    set: (values: State<Booking>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Booking>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<Booking> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: Booking) => dispatch(action.post(values)),
    put: (values: Booking) => dispatch(action.put(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};

export class Booking extends CommonEntity {
  constructor(
    public name?: string,
    public description?: string,
    public startTime?: string,
    public time?: Dayjs[],
    public endTime?: string,
    public userId?: string,
    public user?: User,
    public typeCode?: string,
    public type?: CodeType,
    public itemCode?: string,
    public item?: Code,
  ) {
    super();
  }
}
