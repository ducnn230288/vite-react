import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@store';
import { CommonEntity, PaginationQuery } from '@models';

const name = 'Time';
const action = new Action<Time>(name);
export const timeSlice = createSlice(new Slice<Time>(action));
export const TimeFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Time>),
    set: (values: State<Time>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Time>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<Time> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: Time) => dispatch(action.post(values)),
    put: (values: Time) => dispatch(action.put(values)),
    putDisable: (values: { id: string; disable: boolean }) => dispatch(action.putDisable(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Time extends CommonEntity {
  constructor(
    public content?:String,
  ) {
    super();
  }
}
