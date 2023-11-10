import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action } from './action';
import { Slice, State } from './slice';
const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
const useAppDispatch = () => useDispatch<ReturnType<typeof setupStore>['dispatch']>();
const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useSelector;
export { setupStore, useAppDispatch, useTypedSelector, Action, Slice };
export type { State };

export * from './global';
export * from './user';
export * from './user/role';
export * from './code';
export * from './code/type';
export * from './data';
export * from './data/type';
export * from './parameter';
export * from './post';
export * from './post/type';
export * from './user/team';
export * from './dayoff';
export * from './user/manager';
export * from './booking';
export * from './fakeapi';
import {
  globalSlice,
  userSlice,
  userRoleSlice,
  codeSlice,
  codeTypeSlice,
  dataSlice,
  dataTypeSlice,
  parameterSlice,
  postSlice,
  postTypeSlice,
  userTeamSlice,
  dayoffSlice,
  managerSlice,
  bookingSlice,
  timeSlice,
} from './';
const rootReducer = combineReducers({
  [globalSlice.name]: globalSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [userRoleSlice.name]: userRoleSlice.reducer,
  [codeSlice.name]: codeSlice.reducer,
  [codeTypeSlice.name]: codeTypeSlice.reducer,
  [dataSlice.name]: dataSlice.reducer,
  [dataTypeSlice.name]: dataTypeSlice.reducer,
  [parameterSlice.name]: parameterSlice.reducer,
  [postSlice.name]: postSlice.reducer,
  [postTypeSlice.name]: postTypeSlice.reducer,
  [userTeamSlice.name]: userTeamSlice.reducer,
  [dayoffSlice.name]: dayoffSlice.reducer,
  [managerSlice.name]: managerSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [timeSlice.name]: timeSlice.reducer,
});
