import { request } from '@umijs/max';
import type { DataItem, GeographicItemType } from './data';
import { ConversationItem } from '@/pages/knowledgebase/kb-chat/data';

export async function fetchSchemaScript(
  params: {
    // query
    /** job id */
    projectId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: string;
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/v1/schemas/getSchemaScript`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return {
      data: res.result,
    };
  });
}

export async function searchDatas(
  params: {
    projectId: number;
    queryStr?: string;
    label?: string;
    page: number;
    size: number;
    //sort: Record<string, 'descend' | 'ascend' | null>;
    //filter: Record<string, (string | number)[] | null>;
    matchExactOnly: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: {
      results: DataItem[];
      total: number;
    };
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/v1/datas/search`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function postSchemaScript(
  data: {
    data: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: any;
    success?: boolean;
    remote?: string;
  }>('/api/v1/schemas', {
    data,
    method: 'POST',
    ...(options || {}),
  }).then((res) => {
    return {
      data: res.result,
      success: res.success,
    };
  });
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
