import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import i18n from 'i18next';

import { API, keyRefreshToken, keyToken, keyUser, lang, routerLinks } from '@utils';
import { Message } from '@core/message';
import { useAppDispatch, useTypedSelector, UserRole } from '@store';
import { CommonEntity } from '@models';

const name = 'Auth';
const action = {
  name,
  set: createAsyncThunk(name + '/set', async (values: State) => values),
  logout: createAsyncThunk(name + '/logout', async () => {
    // if (localStorage.getItem(keyRefreshToken)) {
    //   return await API.get(`${routerLinks(name, 'api')}/logout`);
    // }
    return true;
  }),
  profile: createAsyncThunk(name + '/profile', async () => {
    const { data } = await API.get<User>(`${routerLinks(name, 'api')}/profile`);
    return data || {};
  }),
  putProfile: createAsyncThunk(name + '/putProfile', async (values: User) => {
    // if (values.avatar && typeof values.avatar === 'object') {
    //   values.avatar = values.avatar[0].url;
    // }
    const { data, message } = await API.put<User>(`${routerLinks(name, 'api')}/profile`, values);
    if (message) Message.success({ text: message });
    return data || {};
  }),
  login: createAsyncThunk(name + '/login', async (values: { password: string; email: string }) => {
    const { data, message } = await API.post<{ user: User; accessToken: string; refreshToken: string }>(
      `${routerLinks(name, 'api')}/login`,
      values,
    );
    if (data) {
      if (message) Message.success({ text: message });
      localStorage.setItem(keyToken, data?.accessToken);
      localStorage.setItem(keyRefreshToken, data?.refreshToken);
    }
    return data!.user;
  }),
  forgottenPassword: createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/forgotten-password`, values);
    if (message) Message.success({ text: message });
    return true;
  }),
  otpConfirmation: createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/otp-confirmation`, values);
    if (message) Message.success({ text: message });
    return true;
  }),
  resetPassword: createAsyncThunk(name + '/reset-password', async (values: resetPassword) => {
    const { message } = await API.post(`${routerLinks(name, 'api')}/reset-password`, values);
    if (message) Message.success({ text: message });
    return true;
  }),
};
interface resetPassword {
  password?: string;
  retypedPassword?: string;
  passwordOld?: string;
  email?: string;
  otp?: string;
}
interface Breadcrumb {
  title: string;
  link: string;
}

export class User extends CommonEntity {
  constructor(
    public name?: string,
    public avatar?: string,
    public password?: string,
    public email?: string,
    public phoneNumber?: string,
    public dob?: string,
    public description?: string,
    public positionCode?: string,
    public retypedPassword?: string,
    public roleCode?: string,
    public role?: UserRole,
    public createdAt?: string,
    public updatedAt?: string,
  ) {
    super();
  }
}
const checkLanguage = (language: TLanguage) => {
  const formatDate = language === 'vn' ? 'DD-MM-YYYY' : 'DD-MM-YYYY';
  const locale = language === 'vn' ? viVN : enUS;
  dayjs.locale(language === 'vn' ? 'vi' : language);
  localStorage.setItem('i18nextLng', language);
  return { language: language, formatDate, locale };
};
const initialState: State = {
  data: JSON.parse(localStorage.getItem(keyUser) || '{}'),
  routeLanguage: undefined,
  user: JSON.parse(localStorage.getItem(keyUser) || '{}'),
  isLoading: false,
  isVisible: false,
  status: 'idle',
  title: '',
  pathname: '',
  breadcrumbs: [],
  ...checkLanguage(lang),
};
export const globalSlice = createSlice({
  name: action.name,
  initialState,
  reducers: {
    setLanguage: (state: State, action: PayloadAction<TLanguage>) => {
      if (action.payload !== state.language) {
        const { language, formatDate, locale } = checkLanguage(action.payload);
        i18n.changeLanguage(language);
        state.formatDate = formatDate;
        state.locale = locale;
        if (state.routeLanguage) state.pathname = state.routeLanguage[language];
        else state.pathname = location.pathname.replace('/' + state.language + '/', '/' + action.payload + '/');
        state.language = language;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(action.set.fulfilled, (state, action: PayloadAction<State>) => {
        let key: keyof State;
        for (key in action.payload) {
          state[key] = action.payload[key];
        }
      })
      // .addCase(action.logout.pending, (state: State) => {
      //   state.isLoading = true;
      //   state.status = 'logout.pending';
      // })
      .addCase(action.logout.fulfilled, (state) => {
        state.user = {};
        state.data = {};
        localStorage.removeItem(keyUser);
        localStorage.removeItem(keyToken);
        localStorage.removeItem(keyRefreshToken);
        state.isLoading = false;
        state.status = 'logout.fulfilled';
      })

      .addCase(action.profile.pending, (state: State) => {
        state.isLoading = true;
        state.status = 'profile.pending';
      })
      .addCase(action.profile.fulfilled, (state: State, action: PayloadAction<User>) => {
        if (action.payload) {
          state.user = action.payload;
          state.data = action.payload;
          localStorage.setItem(keyUser, JSON.stringify(action.payload));
          state.status = 'profile.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.profile.rejected, (state: State) => {
        state.status = 'profile.rejected';
        state.isLoading = false;
      })

      .addCase(action.putProfile.pending, (state: State, action) => {
        state.data = { ...state.data, ...action.meta.arg };
        state.isLoading = true;
        state.status = 'putProfile.pending';
      })
      .addCase(action.putProfile.fulfilled, (state: State, action: PayloadAction<User>) => {
        if (action.payload) {
          state.user = action.payload;
          state.status = 'putProfile.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.putProfile.rejected, (state: State) => {
        state.status = 'putProfile.rejected';
        state.isLoading = false;
      })

      .addCase(
        action.login.pending,
        (
          state: State,
          action: PayloadAction<
            undefined,
            string,
            { arg: { password?: string; email?: string }; requestId: string; requestStatus: 'pending' }
          >,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'login.pending';
        },
      )
      .addCase(action.login.fulfilled, (state: State, action: PayloadAction<User>) => {
        if (action.payload) {
          localStorage.setItem(keyUser, JSON.stringify(action.payload));
          state.user = action.payload;
          state.data = {};
          state.status = 'login.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.login.rejected, (state: State) => {
        state.status = 'login.rejected';
        state.isLoading = false;
      })

      .addCase(
        action.forgottenPassword.pending,
        (
          state: State,
          action: PayloadAction<
            undefined,
            string,
            { arg: { email?: string }; requestId: string; requestStatus: 'pending' }
          >,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'forgottenPassword.pending';
        },
      )
      .addCase(action.forgottenPassword.fulfilled, (state: State, action: PayloadAction<boolean>) => {
        if (action.payload) {
          state.status = 'forgottenPassword.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.forgottenPassword.rejected, (state: State) => {
        state.status = 'forgottenPassword.rejected';
        state.isLoading = false;
      })

      .addCase(
        action.otpConfirmation.pending,
        (
          state: State,
          action: PayloadAction<
            undefined,
            string,
            { arg: { email?: string; otp?: string }; requestId: string; requestStatus: 'pending' }
          >,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'otpConfirmation.pending';
        },
      )
      .addCase(action.otpConfirmation.fulfilled, (state: State, action: PayloadAction<boolean>) => {
        if (action.payload) {
          state.status = 'otpConfirmation.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.otpConfirmation.rejected, (state: State) => {
        state.status = 'otpConfirmation.rejected';
        state.isLoading = false;
      })

      .addCase(
        action.resetPassword.pending,
        (
          state: State,
          action: PayloadAction<undefined, string, { arg: resetPassword; requestId: string; requestStatus: 'pending' }>,
        ) => {
          state.data = action.meta.arg;
          state.isLoading = true;
          state.status = 'resetPassword.pending';
        },
      )
      .addCase(action.resetPassword.fulfilled, (state: State, action: PayloadAction<boolean>) => {
        if (action.payload) {
          state.data = {};
          state.status = 'resetPassword.fulfilled';
        } else state.status = 'idle';
        state.isLoading = false;
      })
      .addCase(action.resetPassword.rejected, (state: State) => {
        state.status = 'resetPassword.rejected';
        state.isLoading = false;
      });
  },
});
export type TLanguage = 'vn' | 'en';
interface State {
  [selector: string]: any;
  user?: User;
  data?: resetPassword;
  routeLanguage?: Record<string, string>;
  isLoading?: boolean;
  isVisible?: boolean;
  status?: string;
  title?: string;
  titleOption?: Record<string, string>;
  pathname?: string;
  formatDate?: string;
  language?: TLanguage;
  breadcrumbs?: Breadcrumb[];
  locale?: typeof viVN | typeof enUS;
}
export const GlobalFacade = () => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector((state) => state[action.name]) as State),
    set: (values: State) => dispatch(action.set(values)),
    logout: () => dispatch(action.logout()),
    profile: () => dispatch(action.profile()),
    putProfile: (values: User) => dispatch(action.putProfile(values)),
    login: (values: { password: string; email: string }) => dispatch(action.login(values)),
    forgottenPassword: (values: { email: string }) => dispatch(action.forgottenPassword(values)),
    otpConfirmation: (values: { email: string; otp: string }) => dispatch(action.otpConfirmation(values)),
    resetPassword: (values: resetPassword) => dispatch(action.resetPassword(values)),
    setLanguage: (value: TLanguage) => dispatch(globalSlice.actions.setLanguage(value)),
  };
};
