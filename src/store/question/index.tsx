import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State, TLanguage } from '@store';
import { CommonEntity, PaginationQuery } from '@models';
import { Code } from './type';

const name = 'Question';
const action = new Action<Question>(name);
export const questionSlice = createSlice(new Slice<Question>(action));
export const QuestionFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...useTypedSelector((state) => state[action.name] as State<Question>),
    set: (values: State<Question>) => dispatch(action.set(values)),
    get: (params: PaginationQuery<Question>) => dispatch(action.get(params)),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<Question> }) =>
      dispatch(action.getById({ id, keyState })),
    post: (values: Question) => dispatch(action.post(values)),
    put: (values: Question) => dispatch(action.put(values)),
    putDisable: (values: { id: string; disable: boolean }) => dispatch(action.putDisable(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};
export class Question extends CommonEntity {
  constructor(
    public typeCode?: string,
    public question?: string,
    public options?: string,
    public correct?: string,
    public level?: number,
    public image?: string,
    public order?: number | null,
    public createdAt?: string,
    public updatedAt?: string,
    public item?: Code,
  ) {
    super();
  }
}
