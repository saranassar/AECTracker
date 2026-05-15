import axios from 'axios';
import { ProcessResponse } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000' });

export const uploadParts = async (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post<ProcessResponse>('/api/v1/process', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const exportXlsx = async (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/api/v1/process/export.xlsx', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  });
  return data as Blob;
};

export default api;
