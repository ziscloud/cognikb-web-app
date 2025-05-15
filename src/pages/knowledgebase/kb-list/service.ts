import { request } from '@umijs/max';
import type { KnowledgeBaseItem } from './data.d';

export async function queryKnowledgeBaseList(params: {
  page: number;
  size: number;
}): Promise<{ data: { pageIdx: number; pageSize:number; total: number; results: KnowledgeBaseItem[] } }> {
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
