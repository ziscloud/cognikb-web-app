import { getSchema } from '@/pages/knowledgebase/modeling-task-detail/service';

export type SplitPreviewResponse = {
  success: boolean;
  remote: string;
  result: string[];
};

type Property = {
  id: number;
  name: string;
  nameZh: string;
  rangeId: number;
  rangeName: string;
  rangeNameZh: string;
  propertyCategoryEnum: string;
  spreadable: boolean;
  maskType: string;
  constraints: string[];
  extInfo: { valueType: string };
  defaultTime: boolean;
  subPropertyList: string[];
};

type Entity = {
  id: number;
  name: string;
  nameZh: string;
  description: string;
  inheritedPropertyList: Property[];
  propertyList: Property[];
  relations: [];
  parentId: number;
  parentName: string;
  belongToProject: number;
  entityCategory: string;
  extInfo: {
    commonIndex: boolean;
  };
};

type EntityRelation = {
  name: string;
  nameZh: string;
  startEntity: Entity;
  endEntity: Entity;
  propertyList: Property[];
  relationCategory: string;
  extInfo: string;
};

export type SchemaGraph = {
  success: boolean;
  remote: string;
  result: {
    entityTypeDTOList: Entity[];
    relationTypeDTOList: EntityRelation[];
  };
};
