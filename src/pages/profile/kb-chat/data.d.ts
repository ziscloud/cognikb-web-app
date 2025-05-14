export type BasicGood = {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
};

export type BasicProgress = {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
};

export type ConversationItem = {
  id: string;
  projectId: number;
  userId: number;
  name: string;
  description: string;
};

export type MessageReferenceItem = {
  id: string;
  type: string;
  info: { id: string; content: string; document_id: string; document_name: string }[];
};

export type MessageSubGraph = {
  className: string;
  resultNodes: {
    id: string;
    label: string;
    name: string;
    properties: { name: string; content: string };
  }[];
  resultEdges: {
    id: string;
    from: string;
    to: string;
    fromType: string;
    toType: string;
    label: string;
    properties: { score: number };
  }[];
};

export type MessageContent = {
  id:string;
  answer: string;
  metrics: {
    thinkCost: number;
  };
  reference: MessageReferenceItem[];
  subgraph: MessageSubGraph[];
  think: string;
};

export type MessageItem = {
  id: number;
  projectId: number;
  userId: number;
  sessionId: number;
  dsl: string;
  nl: string;
  params: {
    usePipeline: string;
  };
  mark: string;
  status: string;
  resultMessage: MessageContent;
};
