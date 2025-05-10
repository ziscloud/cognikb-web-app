import { request } from '@umijs/max';

export async function updateProjectConfig(projectId:number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteProjectConfig(projectId:number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}`, {
    method: 'DELETE',
    ...(options || {}),
  }).then(res => {
    if (!res.result) {
      throw new Error('delete project failed');
    }
  });
}

export async function queryProjectConfig(params: API.ProjectConfigRequestParams, options?: { [key: string]: any },) {
  const { projectId } = params;
  return request<API.ProjectConfigResponse>(`/api/v1/projects/${projectId}`, {
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
