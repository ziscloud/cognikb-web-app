// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { ModelingTaskItem, TableListItem, TaskLog, TaskLogEdgeItem, type TaskLogItem, TaskLogNodeItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    start: number | undefined;
    limit: number | undefined;
    sort: Record<string, 'descend' | 'ascend' | null>;
    filter: Record<string, (string | number)[] | null>;
    projectId: number;
  },
  options?: { [p: string]: any },
) {
  return request<{
    result: {
      total: number;
      pageSize: number;
      pageNo: number;
      data: ModelingTaskItem[];
    };
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>('/api/public/v1/builder/job/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function fetchTaskLog(
  params: {
    // query
    /** job id */
    id: number;
    /** task id */
    jobId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: TaskLog;
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/public/v1/reasoner/task/builder/query`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function deleteTask(
  params: {
    // query
    /** job id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: boolean;
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/public/v1/builder/job/delete`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
