import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { CommonEntity } from '@models';
import { API, routerLinks } from '@utils';
import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@store';

const name = 'SubStore';

const action = {
  ...new Action<SubStore>(name),
  getSubStore: createAsyncThunk(
    name + '/get',
    async ({ page, perPage, filter }: { page: number, perPage: number, filter: { storeId?: string, supplierType: string } }) => {
      const filterSubStore = JSON.parse(filter.toString() || '{}')
      const data = await API.get(routerLinks(name, 'api'), { page, perPage, storeId: filterSubStore.storeId, supplierType: filterSubStore.supplierType })
      return data
    }
  ),
}

export const subStoreSlice = createSlice(new Slice<SubStore>(action));

export const SubStoreFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<SubStore>),
    set: (values: State<SubStore>) => dispatch(action.set(values)),
    // get: (params: PaginationQuery<SubStore>) => dispatch(action.get(params)),
    get: ({ page, perPage, filter }: { page: number, perPage: number, filter: { storeId?: string, supplierType: string } }) => {
      console.log(page, perPage, filter)
      return dispatch(action.getSubStore({ page, perPage, filter }))
    },
  };
};

export class SubStore extends CommonEntity {
  constructor(
    public id?: string,
    public name?: string,
    public code?: string,
    public isActive?: boolean,
    public isParent?: boolean,
    public createdById?: string,
    public orgId?: string,
    public isKiotViet?: boolean,
    public categoryKiotId?: string,
    public parentId?: string,
  ) {
    super();
  }
}

