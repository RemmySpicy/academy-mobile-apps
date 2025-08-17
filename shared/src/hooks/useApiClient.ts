import { useCallback } from 'react';
import apiClient from '../services/apiClient';
import { ApiResponse } from '../types';
import { AxiosResponse } from 'axios';

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

interface ApiClientHook {
  get: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>;
  post: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => Promise<T>;
  put: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => Promise<T>;
  patch: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => Promise<T>;
  del: <T = unknown>(url: string, config?: RequestConfig) => Promise<T>;
  setBaseURL: (url: string) => void;
  setProgramContext: (programId: string) => Promise<void>;
  getProgramContext: () => Promise<string | null>;
  client: typeof apiClient;
}

export default function useApiClient(): ApiClientHook {
  const get = useCallback(async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const response = await apiClient.get<AxiosResponse<T>>(url, config);
    return response.data;
  }, []);

  const post = useCallback(async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const response = await apiClient.post<AxiosResponse<T>>(url, data, config);
    return response.data;
  }, []);

  const put = useCallback(async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const response = await apiClient.put<AxiosResponse<T>>(url, data, config);
    return response.data;
  }, []);

  const patch = useCallback(async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const response = await apiClient.patch<AxiosResponse<T>>(url, data, config);
    return response.data;
  }, []);

  const del = useCallback(async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const response = await apiClient.delete<AxiosResponse<T>>(url, config);
    return response.data;
  }, []);

  const setBaseURL = useCallback((url: string): void => {
    apiClient.setBaseURL(url);
  }, []);

  const setProgramContext = useCallback(async (programId: string): Promise<void> => {
    await apiClient.setProgramContext(programId);
  }, []);

  const getProgramContext = useCallback(async (): Promise<string | null> => {
    return apiClient.getProgramContext();
  }, []);

  return {
    get,
    post,
    put,
    patch,
    del,
    setBaseURL,
    setProgramContext,
    getProgramContext,
    client: apiClient,
  };
}