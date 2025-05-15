import { request } from '@umijs/max';
import {
  ModelingTaskItem, TaskLogEdgeItem, TaskLogNodeItem,
} from '@/pages/knowledgebase/modeling/components/modeling-task-list/data';
import { SchemaGraph, SplitPreviewResponse } from '@/pages/knowledgebase/modeling-task-detail/data';

export async function fetchTaskDetail(
  params: {
    // query
    /** job id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result:  ModelingTaskItem;
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/public/v1/builder/job/get`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then(res => {
    return {
      data: res.result,
    }
  });
}

export async function getSplitPreview(data: ModelingTaskItem, options?: { [key: string]: any }) {
  return request<SplitPreviewResponse>('/api/public/v1/builder/job/split/preview', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function getSchemaDiff(data: {
  job?:ModelingTaskItem,
  subGraph:{
    resultNodes: TaskLogNodeItem[];
    resultEdges: TaskLogEdgeItem[];
  }}, options?: { [key: string]: any }) {
  return request<SchemaGraph>('/api/public/v1/builder/job/schema/diff', {
    data,
    method: 'POST',
    ...(options || {}),
  }).then(res => {
    return {
      data: res.result,
    }
  });
}

export async function getSchema(
  params: {
    projectId: number;
  },
  options?: { [key: string]: any },
) {
  return request<SchemaGraph>(`/api/v1/schemas/graph/${params.projectId}`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then(res => {
    return {
      data: res.result,
    }
  });
}
