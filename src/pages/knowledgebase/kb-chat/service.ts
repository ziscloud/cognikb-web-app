import { request } from '@umijs/max';
import { ConversationItem, MessageItem } from './data.d';

export async function fetchConversations(
  params: {
    // query
    /** job id */
    projectId: number;
    limit: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: ConversationItem[];
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/public/v1/reasoner/session/list`, {
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

export async function postNewConversation(
  data: {
    projectId: number;
    name: string;
    userId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: ConversationItem;
    success?: boolean;
    remote?: string;
  }>('/api/public/v1/reasoner/session/create', {
    data,
    method: 'POST',
    ...(options || {}),
  }).then((res) => {
    return {
      data: res.result,
    };
  });
}

export async function fetchMessages(
  params: {
    // query
    sessionId: number;
    start: number;
    limit: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    result: MessageItem[];
    /** 列表的内容总数 */
    remote?: string;
    success?: boolean;
  }>(`/api/public/v1/reasoner/task/list`, {
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
