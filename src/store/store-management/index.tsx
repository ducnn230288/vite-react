import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';


import { Message } from '@core/message';
import { API, routerLinks } from '@utils';
import { District, Province, Ward } from '@store';
import { CommonEntity, Responses } from '@models';
import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@store';

const name = 'Organization';

const action = {
  ...new Action<StoreManagement>(name),
  getStore: createAsyncThunk(
    name + '/get',
    async ({ page, perPage, filter, fullTextSearch }: { page: number, perPage: number, filter: { type?: string }, fullTextSearch: string }) => {
      const filterStore = JSON.parse(filter.toString() || '{}');
      return await API.get(routerLinks(name, 'api'), { page, perPage, type: filterStore.type, fullTextSearch: fullTextSearch })
    }
  ),
  getByIdStore: createAsyncThunk(name + '/getById', async ({ id, keyState = 'isVisible' }: { id: string; keyState: keyof State<StoreManagement> }) => {
    let data = (await API.get<StoreManagement>(`${routerLinks(name, 'api')}/detail/${id}`));
    data = { ...data, provinceId: data?.address?.province?.id + '|' + data?.address?.province?.code, districtId: data?.address?.district?.id + '|' + data?.address?.district?.code, wardId: data?.address?.ward?.id, street: data.address?.street }
    // delete data.address
    return { data, keyState };
  }),
  postStore: createAsyncThunk(name + '/post', async (values: StoreManagement) => {
    const provinceId = values.provinceId?.slice(0, values.provinceId.indexOf('|'))
    const districtId = values.districtId?.slice(0, values.districtId.indexOf('|'))
    const wardId = values.wardId
    const street = values.street
    const supplierType = 'BALANCE'
    const type = 'STORE'
    const connectKiot = {}
    const address = { provinceId, districtId, wardId, street }
    const { statusCode, message } = await API.post<StoreManagement>(routerLinks(name, 'api'), {
      ...values, address, supplierType, type, connectKiot
    });
    if (message) await Message.success({ text: message });
    return statusCode;
  }),
  putStore: createAsyncThunk(name + '/put', async ({ id, ...values }: StoreManagement) => {
    const provinceId = values.provinceId?.slice(0, values.provinceId.indexOf('|'))
    const districtId = values.districtId?.slice(0, values.districtId.indexOf('|'))
    const wardId = values.wardId
    const street = values.street
    const supplierType = 'BALANCE'
    const connectKiot = {}
    const type = 'STORE'
    const address = { provinceId, districtId, wardId, street }
    const rs = { ...values, address, supplierType, type, connectKiot }
    delete (rs.provinceId)
    delete (rs.districtId)
    delete (rs.wardId)
    const { statusCode, message } = await API.put<StoreManagement>(`${routerLinks(name, 'api')}/${id}`, rs);
    if (message) await Message.success({ text: message });
    return statusCode;
  }),
};
export const storeSlice = createSlice(
  new Slice<StoreManagement>(action, (builder: any) => {
    builder
      .addCase(
        action.getStore.pending,
        (
          state: State<StoreManagement>,
          action: PayloadAction<undefined, string, { arg: StoreManagement; requestId: string; requestStatus: 'pending' }>,
        ) => {
          console.log('21')
          state.time = new Date().getTime() + (state.keepUnusedDataFor || 60) * 1000;
          state.queryParams = JSON.stringify(action.meta.arg);
          state.isLoading = true;
          state.status = 'get.pending';
        },
      )
      .addCase(action.getStore.fulfilled, (state: State<StoreManagement>, action: PayloadAction<Responses<StoreManagement[]>>) => {
        if (action.payload.data) {
          state.result = action.payload;
          state.status = 'get.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.getByIdStore.pending, (state: State<StoreManagement>) => {
        state.isLoading = true;
        state.status = 'getById.pending';
      })
      .addCase(action.getByIdStore.fulfilled, (state: State<StoreManagement>, action: PayloadAction<{ data: StoreManagement; keyState: keyof State<StoreManagement> }>) => {
        if (action.payload) {
          const { data, keyState } = action.payload;
          if (JSON.stringify(state.data) !== JSON.stringify(data)) state.data = data;
          state[keyState] = true;
          state.status = 'getById.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(
        action.postStore.pending,
        (
          state: State<StoreManagement>,
          action: PayloadAction<undefined, string, { arg: StoreManagement; requestId: string; requestStatus: 'pending' }>,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'post.pending';
        },
      )
      .addCase(action.postStore.fulfilled, (state: State<StoreManagement>, action: PayloadAction<StoreManagement>) => {
        if (action.payload.toString() === '200') {
          state.isVisible = false;
          state.status = 'post.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(
        action.put.pending,
        (
          state: State<StoreManagement>,
          action: PayloadAction<undefined, string, { arg: StoreManagement; requestId: string; requestStatus: 'pending' }>,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'put.pending';
          console.log(state.status)
        },
      )
      .addCase(action.put.fulfilled, (state: State<StoreManagement>, action: PayloadAction<StoreManagement>) => {
        if (action.payload.toString() === '200') {
          state.isVisible = false;
          state.status = 'put.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
  }),
);

export const StoreFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State<StoreManagement>),
    set: (values: State<StoreManagement>) => dispatch(action.set(values)),
    get: ({ page, perPage, filter, fullTextSearch }: { page: number, perPage: number, filter: { type?: string }, fullTextSearch: string }) => dispatch(action.getStore({ page, perPage, filter, fullTextSearch })),
    getById: ({ id, keyState = 'isVisible' }: { id: string; keyState?: keyof State<StoreManagement> }) =>
      dispatch(action.getByIdStore({ id, keyState })),
    post: (values: StoreManagement) => dispatch(action.postStore(values)),
    put: (values: StoreManagement) => dispatch(action.putStore(values)),
    delete: (id: string) => dispatch(action.delete(id)),
  };
};

export class StoreManagement extends CommonEntity {
  constructor(
    public code?: string,
    public id?: string,
    public isActive?: boolean,
    public isMain?: boolean,
    public name?: string,
    public note?: string,
    public districtId?: string,
    public provinceId?: string,
    public street?: string,
    public wardId?: string,
    // public type?: string,
    // public contract?: string
    public address?: {
      id?: number;
      street?: string;
      district?: District
      province?: Province
      ward?: Ward;
    },
    public userRole?: {
      0: {
        createdAt: string;
        isDeleted: boolean;
        roleId: number;
        subOrgId: string;
        id: string;
        userAdminId: string;
        userAdmin: {
          id: string;
          email: string;
          name: string;
          phoneNumber: string;
        }
      }
    },
  ) {
    super();
  }
}

