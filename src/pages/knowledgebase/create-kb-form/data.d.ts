declare namespace API {
  type ConfigRequestParams = {
    configId: string;
    version: string;
  };

  type ConfigResponse = {
    result: {
      id: number;
      configName: string;
      configId: string;
      config: string;
      resourceType: string;
      showProfilePicture: boolean;
      showUserConfig: boolean;
    };
    success: boolean;
    remote: string;
  };

  type GraphStore = {
    database: string;
    password: string;
    uri: string;
    user: string;
  };

  type LlmConfig = {
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
  };

  type PromptConfig = {
    biz_scene: string;
    language: string;
  };

  type VectorizerConfig = {
    api_key: string;
    base_url: string;
    model: string;
    type: string;
  };
  type Config = {
    vectorizer: VectorizerConfig;
    llm_select: Array<LlmConfig>;
    graph_store: GraphStore;
    llm: LlmConfig;
    prompt: PromptConfig;
  };
}
