import { request } from '@umijs/max';
import type { KnowledgeBaseListItemDataType } from './data.d';

export async function queryFakeList(params: {
  page: number;
  size: number;
}): Promise<{ data: { pageIdx: number; pageSize:number; total: number; results: KnowledgeBaseListItemDataType[] } }> {
  return request('/api/v1/projects/list', {
    params,
  }).then(res => {
    return {
      data: {
        ...res.result
      },
    };
  });
}
