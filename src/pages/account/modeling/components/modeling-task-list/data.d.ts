export type TableListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
};

export type TaskLogItem = {
  id: number;
  index: number;
  name: string;
  status: 'WAITING'|'RUNNING'|'FINISH'|'ERROR';
  traceLog: string;
  type: string;
};

export type TaskLogNodeItem = {
  id: number;
  name: string;
  label: string;
  properties:{
    name: string;
    id: string;
    content?:string;
    semanticType?: string;
    desc?:string;
  }
}

export type TaskLogEdgeItem = {
  id: string;
  from: string;
  fromType: string;
  to: string;
  toType: string;
  label: string;
  properties:{
    name: string;
    id: string;
    content?:string;
    semanticType?: string;
    desc?:string;
  }
}

export type ModelingTaskItem = {
  id: number;
  projectId: number;
  gmtCreate: string;
  gmtModified: string;
  modifyUser: string;
  createUser: string;
  taskId: number;
  jobName: string;
  fileUrl: string;
  status: string;
  dataSourceType: string;
  type: string;
  extension: string;
  version: string;
  computingConf: string;
  lifeCycle: string;
  action: string;
}

export type ModelingTaskExtension = {
  dataSourceConfig: DataSourceConfig;
  splitConfig: SplitConfig;
  extractConfig: ExtractConfig;
}

interface DataSourceConfig {
  columns: any[];
  type: string;
  fileName: string;
  fileUrl: string;
  ignoreHeader: boolean;
  structure: boolean;
}

interface SplitConfig {
  splitLength: number;
  semanticSplit: boolean;
}

interface LLMConfig {
  __customParamKeys: any[];
  creator: string;
  default: boolean;
  createTime: string;
  api_key: string;
  stream: string;
  base_url: string;
  temperature: number;
  model: string;
  type: string;
  llm_id: string;
  desc: string;
}

interface ExtractConfig {
  llm: LLMConfig;
  llmPrompt: string;
  autoSchema: boolean;
  autoWrite: boolean;
}

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TaskLog = {
  id: number;
  projectId: number;
  resultMessage: TaskLogItem[];
  resultNodes: TaskLogNodeItem[];
  resultEdges: TaskLogEdgeItem[];
}

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
