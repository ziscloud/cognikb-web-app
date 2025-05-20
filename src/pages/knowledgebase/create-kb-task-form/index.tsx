import {
  getLlmSelect,
  postKnowledgeBuildingJob,
} from '@/pages/knowledgebase/create-kb-task-form/service';
import { LlmItem } from '@/pages/knowledgebase/modeling/components/modeling-task-list/data';
import { useSearchParams } from '@@/exports';
import {
  PageContainer,
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  StepsForm,
} from '@ant-design/pro-components';
import { ShowMore } from '@re-dev/react-truncate';
import { Button, Card, Collapse, Flex, FormInstance, List, message, theme, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import type { StepDataType } from './data.d';
import useStyles from './style.style';
import { getSplitPreview } from '@/pages/knowledgebase/modeling-task-detail/service';
import { CaretRightOutlined } from '@ant-design/icons';



const StepForm: React.FC<Record<string, any>> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { styles } = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [splitPreviews, setSplitPreviews] = useState<{id: number, content: string}[]>([]);
  const [splitPreviewLoading, setSplitPreviewLoading ] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stepData, setStepData] = useState<StepDataType>({
    dataSourceConfig_structure: 'unstructuredContent',
    type: 'FILE_EXTRACT',
    splitConfig_splitLength: 2000,
    receiverMode: 'alipay',
    jobName: '',
  });
  const [current, setCurrent] = useState(0);
  const [llmOptions, setLlmOptions] = useState<LlmItem[]>([]);
  const formRef = useRef<FormInstance>();
  const {
    token: {colorBgContainer, colorFillAlter, borderRadiusLG},
  } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    background: colorFillAlter,
    borderRadius: borderRadiusLG,
    border: 'none',
  };

  return (
    <PageContainer content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。">
      {contextHolder}
      <Card variant={'outlined'}>
        <StepsForm
          formRef={formRef}
          current={current}
          onCurrentChange={setCurrent}
          submitter={{
            render: (props, dom) => {
              if (props.step === 1) {
                return [
                  <Button
                    loading={splitPreviewLoading}
                    type="primary"
                    key="preview"
                    onClick={() => {
                      const data = {
                        projectId: Number.parseInt(searchParams.get('projectId') || '0'),
                        jobName: stepData.jobName,
                        type: stepData.type,
                        createUser: 'openspg',
                        lifeCycle: 'ONCE',
                        action: 'UPSERT',
                        computingConf: '',
                        dependence: 'INDEPENDENT',
                        cron: '0 0 0 * * ?',
                        fileUrl: stepData.fileUrl[0]?.response?.result,
                        dataSourceType: stepData.fileUrl[0]?.name?.split('.')?.pop()?.toUpperCase(),
                        extension: JSON.stringify({
                          splitConfig: {
                            splitLength: stepData.splitConfig_splitLength,
                            semanticSplit: !!stepData.splitConfig_semanticSplit,
                          },
                        }),
                      };
                      setSplitPreviewLoading(true);
                      getSplitPreview(data).then((res) => {
                        if (res.success) {
                          setSplitPreviews(res.result.map((item, index) => ({id: index, content: item})));
                          setSplitPreviewLoading(false);
                        }
                      });
                    }}
                  >
                    预览抽取结果
                  </Button>,
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    上一步
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    下一步
                  </Button>,
                ];
              }
              return dom;
            },
          }}
          onFinish={async (values) => {
            const body = {
              jobName: values.jobName,
              type: values.type,
              lifeCycle: 'ONCE',
              action: 'UPSERT',
              projectId: Number.parseInt(searchParams.get('projectId') || '0'),
              createUser: 'openspg', //TODO shunyun 2025/5/15: get current user from server side
              dataSourceType: values.fileUrl[0]?.name?.split('.')?.pop()?.toUpperCase(),
              fileUrl: values.fileUrl[0]?.response?.result,
              extension: JSON.stringify({
                dataSourceConfig: {
                  columns: [], //TODO shunyun 2025/5/15: 结构化数据源
                  type: 'UPLOAD',
                  fileName: values.fileUrl[0]?.name,
                  fileUrl: values.fileUrl[0]?.response?.result,
                  ignoreHeader: true,
                  structure: false,
                },
                splitConfig: {
                  splitLength: values.splitConfig_splitLength,
                  semanticSplit: !!values.splitConfig_semanticSplit,
                },
                extractConfig: {
                  llm: JSON.stringify(
                    llmOptions.find((item) => item.llm_id === values.extractConfig_llm) || '',
                  ),
                  llmPrompt: '',
                  autoSchema: true,
                  autoWrite: true,
                },
              }),
            };
            const response = await postKnowledgeBuildingJob(body);
            if (response.success) {
              formRef.current?.resetFields();
              messageApi.success('创建成功');
            } else {
              messageApi.error(
                <div style={{ maxWidth: '300px' }}>
                  <Typography.Title level={3}>{response.errorCode}</Typography.Title>
                  <Typography.Paragraph copyable={true} ellipsis={{ rows: 5 }}>
                    {response.errorMessage}
                  </Typography.Paragraph>
                </div>,
              );
            }
            return response.success;
          }}
        >
          <StepsForm.StepForm<StepDataType>
            title="基础配置"
            initialValues={stepData}
            onFinish={async (values) => {
              setStepData((prevState) => {
                return { ...prevState, ...values };
              });
              return true;
            }}
          >
            <ProFormText
              label="知识名称"
              name="jobName"
              rules={[
                {
                  required: true,
                  message: '请输入知识名称',
                },
              ]}
              placeholder="请输入知识名称"
            />
            <ProFormRadio.Group
              name="type"
              label="数据源"
              rules={[
                {
                  required: true,
                  message: '请选择数据源',
                },
              ]}
              options={[
                {
                  label: '本地文件',
                  value: 'FILE_EXTRACT',
                },
                {
                  label: '语雀文档/知识库',
                  value: 'YUQUE_EXTRACT',
                },
                {
                  label: '批量数据',
                  value: 'BATCH',
                },
                {
                  label: '实时数据',
                  value: 'STREAM',
                },
              ]}
            />
            <ProFormRadio.Group
              fieldProps={{
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                },
              }}
              name="dataSourceConfig_structure"
              label="内容类型"
              rules={[
                {
                  required: true,
                  message: '请选择内容类型',
                },
              ]}
              options={[
                {
                  label: (
                    <>
                      <b>结构化内容</b>-表格形式内容， 无需抽取， 可直接与知识模型映射并导入数据
                    </>
                  ),
                  value: 'structuredContent',
                },
                {
                  label: (
                    <>
                      <b>非结构化内容</b>-内容无明确结构， 需大模型抽取
                    </>
                  ),
                  value: 'unstructuredContent',
                },
              ]}
            />
            <ProFormUploadButton
              label="上传文件"
              name="fileUrl"
              action="/api/public/v1/reasoner/dialog/uploadFile"
              fieldProps={{
                maxCount: 1,
                showUploadList: {
                  extra: ({ size = 0 }) => (
                    <span style={{ color: '#cccccc' }}>({(size / 1024 / 1024).toFixed(2)}MB)</span>
                  ),
                  showDownloadIcon: true,
                  showRemoveIcon: true,
                },
              }}
              rules={[
                {
                  required: true,
                  message: '请上传文件',
                },
              ]}
            />
            {
              <Typography.Text type={'secondary'}>
                支持拓展名:.txt，.csv，.pdf，.md，.json，.doc，.docx
                <br /> 注意: 单次仅支持上传1个文件，单个文件大小在200MB以内
              </Typography.Text>
            }
          </StepsForm.StepForm>

          <StepsForm.StepForm<StepDataType>
            initialValues={stepData}
            title="分段配置/映射配置"
            onFinish={async (values) => {
              setStepData((prevState) => {
                return { ...prevState, ...values };
              });
              return true;
            }}
          >
            <Flex>
              <Flex vertical={true}>
                <ProFormDigit
                  label="分段最大长度"
                  name="splitConfig_splitLength"
                  min={100}
                  fieldProps={{ precision: 0 }}
                  rules={[
                    {
                      required: true,
                      message: '请输入分段最大长度',
                    },
                  ]}
                />
                <ProFormCheckbox.Group
                  name="splitConfig_semanticSplit"
                  layout="vertical"
                  label="分段处理"
                  options={[
                    {
                      label:
                        '根据文档语义切分文档（按语义切分可能耗时较长，段落长度可能小于分段最大长度）',
                      value: '1',
                    },
                  ]}
                />
              </Flex>
              {splitPreviews && splitPreviews.length > 0 && (
                <List
                  style={{maxWidth: '50%'}}
                  pagination={{pageSize: 5}}
                  size="small"
                  header={false}
                  footer={false}
                  bordered
                  dataSource={splitPreviews}
                  renderItem={(item) => (
                    <List.Item>
                      <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{ background: colorBgContainer, width:'100%' }}
                        items={[
                          {
                            key: 'item-' + item.id,
                            label: '分段' + item.id,
                            children: <p>{item.content}</p>,
                            style: panelStyle,
                          }
                        ]}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Flex>
          </StepsForm.StepForm>
          <StepsForm.StepForm<StepDataType>
            initialValues={stepData}
            title="抽取配置/导入配置"
            onFinish={async (values) => {
              setStepData((prevState) => {
                return { ...prevState, ...values };
              });
              return true;
            }}
          >
            <ProFormSelect
              name="extractConfig_llm"
              label="抽取模型"
              request={async () => {
                let projectId = searchParams.get('projectId');
                if (!projectId) {
                  return [];
                }
                const res = await getLlmSelect({ projectId: Number.parseInt(projectId) });
                setLlmOptions(res.data);
                return res.data.map((item: LlmItem) => {
                  return { label: item.model + ' (' + item.desc + ')', value: item.llm_id };
                });
              }}
              placeholder="请选择抽取模型"
              rules={[{ required: true, message: 'Please select your country!' }]}
            />
            <ProFormTextArea name="computingConf" label="脚本配置" placeholder="请输入脚本配置" />
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </PageContainer>
  );
};
export default StepForm;
