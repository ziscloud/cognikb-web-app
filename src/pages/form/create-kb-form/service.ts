import { request } from '@umijs/max';

export async function createProject(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/projects', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function queryConfig(params: API.ConfigRequestParams, options?: { [key: string]: any },) {
  const { configId, version } = params;
  return request<API.ConfigResponse>(`/api/v1/configs/${configId}/version/${version}`, {
    method: 'GET',
    ...(options || {}),
  }).then(res => {
    return {
      data: {
        ...res.result
      },
    };
  });;
}
