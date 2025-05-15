import { LlmItem, TableListItem } from '@/pages/account/modeling/components/modeling-task-list/data';
import { request } from '@umijs/max';


export async function postKnowledgeBuildingJob(data: any, options?: { [key: string]: any }) {
  return request<{
    result: any;
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>('/api/public/v1/builder/job/submit', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function getLlmSelect(
  params: {
    // query
    /** job id */
    projectId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: LlmItem[];
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/v1/datas/getLlmSelect`, {
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
