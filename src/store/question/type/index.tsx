import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State, User } from '@store';
import { CommonEntity, PaginationQuery } from '@models';
import { Question } from '../';

const name = 'Code';
const action = new Action<Code>(name);
export const codeSlice = createSlice(new Slice<Code>(action, { keepUnusedDataFor: 9999 }));
export const CodeFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Code>),
    set: (values: State<Code>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Code>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<Code> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: Code) => dispatch(action.post(values)),
    put: (values: Code) => dispatch(action.put(values)),
    putDisable: (values: { id: string; disable: boolean }) => dispatch(action.putDisable(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Code extends CommonEntity {
  constructor(
    public code?: string,
    public type?: string,
    public name?: string,
    public description?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public item?: Question[],
    public users?: User[],
  ) {
    super();
  }
}
