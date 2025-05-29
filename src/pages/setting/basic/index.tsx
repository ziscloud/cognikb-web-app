import { queryConfig } from '@/pages/knowledgebase/create-kb-form/service';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProSkeleton,
} from '@ant-design/pro-components';
import { Button, Divider, Form, message, Space, Typography } from 'antd';
import { deepParseJson } from 'deep-parse-json';
import { FC, useEffect, useRef, useState } from 'react';
import useStyles from './style.style';

const Basic: FC = () => {
  const { styles } = useStyles();
  const [readonly, setReadonly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<API.Config>();
  const formRef = useRef<
    ProFormInstance<{
      name: string;
      company?: string;
      useMode?: string;
    }>
  >();
  useEffect(() => {
    queryConfig({
      configId: 'KAG_CONFIG',
      version: '1',
    }).then((res) => {
      if (res?.data?.config) {
        setConfig(deepParseJson(res?.data?.config));
      }
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer>
      {loading ? (
        <ProSkeleton type={'descriptions'} />
      ) : (
        <ProForm<{
          g_db?: string;
          g_password?: string;
          g_url?: string;
          g_username?: string;
          v_type?: string;
          v_model?: string;
          v_url?: string;
          v_api_key?: string;
          biz_scene?: string;
          language?: string;
        }>
          onFinish={async (values) => {
            console.log(values);
            const val1 = await formRef.current?.validateFields();
            console.log('validateFields:', val1);
            const val2 = await formRef.current?.validateFieldsReturnFormatValue?.();
            console.log('validateFieldsReturnFormatValue:', val2);
            message.success('提交成功');
          }}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          layout={'horizontal'}
          initialValues={{
            g_db: config?.graph_store?.database,
            g_password: config?.graph_store?.password,
            g_url: config?.graph_store?.uri,
            g_username: config?.graph_store?.user,
            v_type: config?.vectorizer?.type,
            v_model: config?.vectorizer?.model,
            v_url: config?.vectorizer?.base_url,
            v_api_key: config?.vectorizer?.api_key,
            biz_scene: config?.prompt?.biz_scene,
            language: config?.prompt?.language,
          }}
          formRef={formRef}
          formKey="base-form-use-demo"
          readonly={readonly}
          autoFocusFirstInput
          submitter={{ render: false }}
        >
          <Divider orientation={"left"} orientationMargin="0">图存储配置</Divider>
          <ProFormText label="Database" name="g_db" />
          <ProFormText.Password label="Password" name="g_password" />
          <ProFormText label="URL" name="g_url" />
          <ProFormText label="Username" name="g_username" />
          <Divider orientation={"left"} orientationMargin="0">向量模型配置</Divider>
          <ProFormText label="Type" name="v_type" />
          <ProFormText label="Model" name="v_model" />
          <ProFormText label="Base URL" name="v_url" />
          <ProFormText.Password label="API KEY" name="v_api_key" />
          <Divider orientation={"left"} orientationMargin="0">提示词中英文配置</Divider>
          <ProFormText label="Biz Scene" name="biz_scene" />
          <ProFormText label="Language" name="language" />
          <Form.Item
          // style={{
          //   display: 'flex',
          //   justifyContent: 'flex-end',
          //   marginTop: 24,
          // }}
          >
            <Space>
              {readonly && (
                <Button
                  type="primary"
                  onClick={() => {
                    setReadonly(false);
                  }}
                >
                  编辑
                </Button>
              )}
              {!readonly && (
                <>
                  <Button
                    type="default"
                    onClick={() => {
                      setReadonly(true);
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      formRef.current?.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      formRef.current?.submit();
                    }}
                  >
                    提交
                  </Button>
                </>
              )}
            </Space>
          </Form.Item>
        </ProForm>
      )}
    </PageContainer>
  );
};
export default Basic;
