import { createAsyncThunk } from '@reduxjs/toolkit';
import { API, routerLinks } from '@utils';
import { Message } from '@components';

export default class Action {
  name: string;
  get: any;
  getById: any;
  post: any;
  put: any;
  delete: any;
  constructor(name: string) {
    this.name = name;
    this.get = createAsyncThunk(name + '/get', async (params: any = {}) => API.get(routerLinks(name, 'api'), params));
    this.getById = createAsyncThunk(name + '/getById', async (id: string) =>
      API.get(`${routerLinks(name, 'api')}/${id}`),
    );
    this.post = createAsyncThunk(name + '/post', async (values: any) => {
      const data = await API.post(routerLinks(name, 'api'), values);
      if (data.message) await Message.success({ text: data.message });
      return data;
    });
    this.put = createAsyncThunk(name + '/put', async (values: any) => {
      const id = values.id;
      delete values.id;
      const data = await API.put(`${routerLinks(name, 'api')}/${id}`, values);
      if (data.message) await Message.success({ text: data.message });
      return data;
    });
    this.delete = createAsyncThunk(name + '/delete', async (id: string) => {
      const data = await API.delete(`${routerLinks(name, 'api')}/${id}`);
      if (data.message) await Message.success({ text: data.message });
      return data;
    });
  }
}
