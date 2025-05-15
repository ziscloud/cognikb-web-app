declare namespace API {
  type ProjectConfigRequestParams = {
    projectId: number;
  };

  type ProjectConfigResponse = {
    result: {
      id: number;
      name: string;
      description: string;
      namespace: string;
      config: string;
    };
    success: boolean;
    remote: string;
  };
}
