import { queryConfig } from '@/pages/knowledgebase/create-kb-form/service';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProSkeleton,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import { deepParseJson } from 'deep-parse-json';
import { FC, useEffect, useState } from 'react';
import useStyles from './style.style';

const Basic: FC = () => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<API.Config>();
  const [currentRecord, setCurrentRecord] = useState<API.LlmConfig | null>(null);
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

  let modalForm = (
    <>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="type"
          label="模型类型"
          valueEnum={{
            vllm: 'vllm',
            maas: 'maas',
            ollama: 'ollama',
          }}
          rules={[
            {
              required: true,
              message: '请选择模型类型',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="model" label="模型名称" rules={[
          {
            required: true,
            message: '请输入模型名称',
          },
        ]} />
        <ProFormText width="md" name="base_url" label="Base URL" rules={[
          {
            required: true,
            message: '请输入Base URL',
          },
        ]} />
      </ProForm.Group>
      <ProFormDependency name={['type']}>
        {({ type }) => {
          return (
            type === 'maas' && (
              <ProForm.Group>
                <ProFormText.Password width="md" name="api_key" label="API KEY" rules={[
                  {
                    required: true,
                    message: '请输入API KEY',
                  },
                ]} />
                <ProFormDigit
                  width="md"
                  name="temperature"
                  label="Temperature"
                  min={0.1}
                  max={1}
                  fieldProps={{ precision: 2 }}
                  rules={[
                    {
                      required: true,
                      message: '请输入Temperature',
                    },
                  ]}
                />
                <ProFormSwitch width="md" name="stream" label="Stream" />
              </ProForm.Group>
            )
          );
        }}
      </ProFormDependency>
      <ProForm.Group>
        <ProFormText width="md" name="desc" label="备注" rules={[
          {
            required: true,
            message: '请输入备注',
          },
        ]} />
      </ProForm.Group>
      <Divider orientation={'left'} orientationMargin="0">
        Custom Fields
      </Divider>
      <ProFormList name="__customParamKeys" label="">
        <ProFormGroup key="group">
          <ProFormText name="name" label="名称" rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]} />
          <ProFormText name="value" label="值" rules={[
            {
              required: true,
              message: '请输入值',
            },
          ]} />
        </ProFormGroup>
      </ProFormList>
    </>
  );

  const columns: ProColumns<API.LlmConfig>[] = [
    {
      title: '模型ID',
      dataIndex: 'llm_id',
      hideInSearch: true,
    },
    {
      title: '模型类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        vllm: 'vllm',
        maas: 'maas',
        ollama: 'ollama',
      },
    },
    {
      title: '模型名称',
      dataIndex: 'model',
    },
    {
      title: '备注',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm<API.LlmConfig>
          key="edit_lll_config_form"
          title="编辑"
          trigger={
            <Button type="link" onClick={() => setCurrentRecord(record)}>
              编辑
            </Button>
          }
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('run'),
          }}
          initialValues={currentRecord || {}}
          submitTimeout={2000}
          onFinish={async (values) => {
            message.success('提交成功');
            return true;
          }}
        >
          {modalForm}
        </ModalForm>,
        <a
          key="delete"
          onClick={() => {
            setCurrentRecord(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      {loading ? (
        <ProSkeleton type={'descriptions'} />
      ) : (
        <ProTable<API.LlmConfig>
          columns={columns}
          dataSource={config?.llm_select}
          rowKey="llm_id"
          search={false}
          toolBarRender={() => [
            <ModalForm<API.LlmConfig>
              key="new_lll_config_form"
              title="新建配置"
              trigger={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCurrentRecord(null)}
                >
                  新建配置
                </Button>
              }
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              submitTimeout={2000}
              onFinish={async (values) => {
                message.success('提交成功');
                return true;
              }}
            >
              {modalForm}
            </ModalForm>,
          ]}
        />
      )}
    </PageContainer>
  );
};
export default Basic;
