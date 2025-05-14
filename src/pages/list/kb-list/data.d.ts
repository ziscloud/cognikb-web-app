export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type KnowledgeBaseItem = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  namespace: string;
  config:string;
};
