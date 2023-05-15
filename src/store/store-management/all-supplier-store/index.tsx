import { createSlice } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector, Action, Slice, State } from '@store';
import { CommonEntity, PaginationQuery } from '@models';

const name = 'SupplierStore';

export const action = new Action<SupplierStore>(name);

export const supplierStoreSlice = createSlice(new Slice<SupplierStore>(action));

export const SupplierStoreFacade = () => {
    const dispatch = useAppDispatch();
    return {
        ...(useTypedSelector((state) => state[action.name]) as State<SupplierStore>),
        set: (values: State<SupplierStore>) => dispatch(action.set(values)),
        get: (params: PaginationQuery<SupplierStore>) => dispatch(action.get(params)),
    };
};

export class SupplierStore extends CommonEntity {
    constructor(
        public id?: string,
        public name?: string,
        public type?: string
    ) {
        super();
    }
}

