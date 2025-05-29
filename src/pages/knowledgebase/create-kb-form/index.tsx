import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProSkeleton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Card, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { createProject, queryConfig } from './service';
import { useNavigate } from '@@/exports';

const BasicForm: FC<Record<string, any>> = () => {
  const [graphStore, setGraphStore] = useState<API.GraphStore>();
  const [vectorizer, setVectorizer] = useState<API.VectorizerConfig>();
  const [prompt, setPrompt] = useState<API.PromptConfig>();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { run } = useRequest(createProject, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      setSubmitting(false);
      navigate('/knowledgebase/kb-list');
    },
    onError: () => {
      message.error('提交失败，请重试');
      setSubmitting(false);
    },
  });

  const { data, loading } = useRequest(() => {
    return queryConfig({
      configId: 'KAG_CONFIG',
      version: '1',
    });
  });

  useEffect(() => {
    if (data?.config) {
      const config: API.Config = JSON.parse(data?.config);
      if (config?.graph_store) {
        setGraphStore(config.graph_store);
      }
      if (config.vectorizer) {
        setVectorizer(config.vectorizer);
      }
      if (config.prompt) {
        setPrompt(config.prompt);
      }
    }
  }, [data]);
  const onFinish = async (values: Record<string, any>) => {
    const oriConfig: API.Config = JSON.parse(data?.config || '{}');
    const config = {
      graph_store: {
        ...oriConfig?.graph_store,
        source_type: values.graph_store_source_type,
        database: values.graph_store_database,
        password: values.graph_store_password,
        uri: values.graph_store_uri,
        user: values.graph_store_user,
      },
      vectorizer: {
        ...oriConfig?.vectorizer,
        source_type: values.vectorizer_source_type,
        model: values.vectorizer_model,
        type: values.vectorizer_type,
        api_key: values.vectorizer_api_key,
        base_url: values.vectorizer_base_url,
      },
      prompt: {
        ...oriConfig?.prompt,
        source_type: values.prompt_source_type,
        biz_scene: values.prompt_biz_scene,
        language: values.prompt_language,
      },
      llm_select: oriConfig.llm_select,
      llm: oriConfig.llm,
    };
    const body = {
      name: values.name,
      description: values.description,
      namespace: values.namespace,
      config: JSON.stringify(config),
    };
    setSubmitting(true);
    run(body);
  };
  return loading || !graphStore || !vectorizer || !prompt ? (
    <ProSkeleton type={'descriptions'} />
  ) : (
    <PageContainer content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
      <Card variant={'outlined'}>
        <ProForm
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            graph_store_source_type: 'default',
            graph_store_database: graphStore?.database,
            graph_store_password: graphStore?.password,
            graph_store_uri: graphStore?.uri,
            graph_store_user: graphStore?.user,
            prompt_source_type: 'default',
            prompt_biz_scene: prompt?.biz_scene,
            prompt_language: prompt?.language,
            vectorizer_source_type: 'default',
            vectorizer_model: vectorizer?.model,
            vectorizer_type: vectorizer?.type,
            vectorizer_api_key: vectorizer?.api_key,
            vectorizer_base_url: vectorizer?.base_url,
          }}
          loading={submitting}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="知识库中文名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入知识库中文名称',
              },
            ]}
            placeholder="请输入知识库中文名称"
          />
          <ProFormText
            width="md"
            label="知识库英文名称"
            name="namespace"
            rules={[
              {
                required: true,
                message: '请输入知识库英文名称',
              },
              {
                pattern: /^[A-Z][A-Za-z0-9]{2,}$/,
                message: '必须以大写字母开头，且仅支持字母和数字组合，至少三个字符',
              },
            ]}
            placeholder="请输入知识库英文名称"
          />
          <ProFormTextArea
            label="知识库描述"
            width="xl"
            name="description"
            placeholder="请输入知识库描述，在知识抽取和知识问答时作为Prompt；例如：这是一个法学知识库，主要描述法律相关的知识。"
          />
          <ProFormRadio.Group
            name="graph_store_source_type"
            label="图储存配置"
            options={[
              {
                label: '默认配置',
                value: 'default',
              },
              {
                label: '自定义配置',
                value: 'custom',
              },
            ]}
          />
          <ProFormText
            width="md"
            label="database"
            name="graph_store_database"
            rules={[
              {
                required: true,
                message: '请输入database',
              },
            ]}
            placeholder="请输入database"
            disabled={true}
          />
          <ProFormDependency name={['graph_store_source_type']}>
            {({ graph_store_source_type }) => {
              return (
                <>
                  <ProFormText.Password
                    width="md"
                    label="password"
                    name="graph_store_password"
                    rules={[
                      {
                        required: true,
                        message: '请输入password',
                      },
                    ]}
                    placeholder="请输入password"
                    disabled={graph_store_source_type === 'default'}
                  />
                  <ProFormText
                    width="md"
                    label="uri"
                    name="graph_store_uri"
                    rules={[
                      {
                        required: true,
                        message: '请输入uri',
                      },
                    ]}
                    placeholder="请输入uri"
                    disabled={graph_store_source_type === 'default'}
                  />
                  <ProFormText
                    width="md"
                    label="user"
                    name="graph_store_user"
                    rules={[
                      {
                        required: true,
                        message: '请输入user',
                      },
                    ]}
                    placeholder="请输入user"
                    disabled={graph_store_source_type === 'default'}
                  />
                </>
              );
            }}
          </ProFormDependency>
          <ProFormRadio.Group
            name="vectorizer_source_type"
            label="向量配置"
            options={[
              {
                label: '默认配置',
                value: 'default',
              },
              {
                label: '自定义配置',
                value: 'custom',
              },
            ]}
          />
          <ProFormText
            width="md"
            label="type"
            name="vectorizer_type"
            rules={[
              {
                required: true,
                message: '请输入type',
              },
            ]}
            placeholder="请输入type"
            disabled={true}
          />
          <ProFormDependency name={['vectorizer_source_type']}>
            {({ vectorizer_source_type }) => {
              return (
                <>
                  <ProFormText.Password
                    width="md"
                    label="model"
                    name="vectorizer_model"
                    rules={[
                      {
                        required: true,
                        message: '请输入model',
                      },
                    ]}
                    placeholder="请输入model"
                    disabled={vectorizer_source_type === 'default'}
                  />
                  <ProFormText
                    width="md"
                    label="base_url"
                    name="vectorizer_base_url"
                    rules={[
                      {
                        required: true,
                        message: '请输入base_url',
                      },
                    ]}
                    placeholder="请输入base_url"
                    disabled={vectorizer_source_type === 'default'}
                  />
                  <ProFormText.Password
                    width="md"
                    label="api_key"
                    name="vectorizer_api_key"
                    rules={[
                      {
                        required: true,
                        message: '请输入api_key',
                      },
                    ]}
                    placeholder="请输入api_key"
                    disabled={vectorizer_source_type === 'default'}
                  />
                </>
              );
            }}
          </ProFormDependency>
          <ProFormRadio.Group
            name="prompt_source_type"
            label="提示词中英文配置"
            options={[
              {
                label: '默认配置',
                value: 'default',
              },
              {
                label: '自定义配置',
                value: 'custom',
              },
            ]}
          />
          <ProFormDependency name={['prompt_source_type']}>
            {({ prompt_source_type }) => {
              return (
                <>
                  <ProFormText
                    width="md"
                    label="biz_scene"
                    name="prompt_biz_scene"
                    rules={[
                      {
                        required: true,
                        message: '请输入biz_scene',
                      },
                    ]}
                    placeholder="请输入biz_scene"
                    disabled={prompt_source_type === 'default'}
                  />
                  <ProFormText
                    width="md"
                    label="language"
                    name="prompt_language"
                    rules={[
                      {
                        required: true,
                        message: '请输入language',
                      },
                    ]}
                    placeholder="请输入language"
                    disabled={prompt_source_type === 'default'}
                  />
                </>
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
