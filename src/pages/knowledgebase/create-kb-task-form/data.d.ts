export interface StepDataType {
  dataSourceConfig_structure: string;
  type: string;
  splitConfig_splitLength: number;
  receiverMode: string;
  jobName: string;
  splitConfig_semanticSplit?: number
  fileUrl?:any
}

export type CurrentTypes = 'base' | 'confirm' | 'result';
