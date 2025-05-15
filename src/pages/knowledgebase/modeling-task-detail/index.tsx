import {
  ModelingTaskExtension,
  TaskLog,
  TaskLogEdgeItem,
  TaskLogNodeItem,
  type TaskLogItem,
} from '@/pages/knowledgebase/modeling/components/modeling-task-list/data';
import { fetchTaskLog } from '@/pages/knowledgebase/modeling/components/modeling-task-list/service';
import SchemaGraph from '@/pages/knowledgebase/modeling-task-detail/components/SchemaGraph';
import { useSearchParams } from '@@/exports';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { ShowMore } from '@re-dev/react-truncate';
import { useRequest } from '@umijs/max';
import { Descriptions, List, Statistic, Timeline } from 'antd';
import { deepParseJson } from 'deep-parse-json';
import { sortBy } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { fetchTaskDetail, getSplitPreview } from './service';
import useStyles from './style.style';
import ResultGraph from '@/pages/knowledgebase/modeling-task-detail/components/ResultGraph';

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3';
  tabActiveKey: string;
};
const ModelingTaskDetail: FC = () => {
  const { styles } = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [splitPreviews, setSplitPreviews] = useState<string[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLogItem[]>([]);
  const [resultNodes, setResultNodes] = useState<TaskLogNodeItem[]>([]);
  const [resultEdges, setResultEdges] = useState<TaskLogEdgeItem[]>([]);
  const { data: taskDetail } = useRequest(() => {
    return fetchTaskDetail({
      id: Number.parseInt(searchParams.get('taskId') || '0'),
    });
  });

  useEffect(() => {
    if (taskDetail) {
      getSplitPreview(taskDetail).then((res) => {
        if (res.success) {
          setSplitPreviews(res.result);
        }
      });
      fetchTaskLog({ id: taskDetail.taskId, jobId: taskDetail.id }).then((res) => {
        if (res.success) {
          if (res.result.resultMessage) {
            const taskLog: TaskLog = deepParseJson(res.result);
            let sortedTaskLogItems = sortBy(
              taskLog.resultMessage,
              (item: TaskLogItem) => item.index,
            );
            setTaskLogs(sortedTaskLogItems);
            setResultNodes(taskLog.resultNodes);
            setResultEdges(taskLog.resultEdges);
          }
        }
      });
    }
  }, [taskDetail]);

  const taskExtension: ModelingTaskExtension = deepParseJson(taskDetail?.extension || '{}');

  const extra = (
    <div className={styles.moreInfo}>
      <Statistic
        title="状态"
        value={
          taskDetail?.status === 'WAITING'
            ? '等待'
            : taskDetail?.status === 'RUNNING'
              ? '运行中'
              : taskDetail?.status === 'ERROR'
                ? '异常'
                : '已完成'
        }
        prefix={
          taskDetail?.status === 'WAITING' ? (
            <ClockCircleOutlined style={{ color: 'grey' }} />
          ) : taskDetail?.status === 'RUNNING' ? (
            <LoadingOutlined style={{ color: 'blue' }} />
          ) : taskDetail?.status === 'ERROR' ? (
            <ExclamationCircleOutlined style={{ color: 'red' }} />
          ) : (
            <CheckCircleOutlined style={{ color: 'green' }} />
          )
        }
      />
    </div>
  );
  const description = (
    <>
      <Descriptions className={styles.headerList} size="small" title={'基础信息'}>
        <Descriptions.Item label="知识名称">{taskDetail?.jobName}</Descriptions.Item>
        <Descriptions.Item label="创建人">{taskDetail?.createUser}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{taskDetail?.gmtCreate}</Descriptions.Item>
        <Descriptions.Item label="上传文档">
          <a href={taskDetail?.fileUrl}>{taskDetail?.fileUrl.split('/').at(-1)}</a>
        </Descriptions.Item>
      </Descriptions>
      <Descriptions className={styles.headerList} size="small" title={'分段配置'}>
        <Descriptions.Item label="分段方式">
          {taskExtension?.splitConfig?.semanticSplit ? '语义切分' : '不使用语义切分'}
        </Descriptions.Item>
        <Descriptions.Item label="分段长度">
          {taskExtension?.splitConfig?.splitLength}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions className={styles.headerList} size="small" title={'抽取配置'}>
        <Descriptions.Item label="抽取模型">
          {taskExtension?.extractConfig?.llm?.model}({taskExtension?.extractConfig?.llm?.desc})
        </Descriptions.Item>
        <Descriptions.Item label="高级配置">
          {taskExtension?.extractConfig?.llmPrompt || '{}'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );

  const [tabStatus, seTabStatus] = useState<AdvancedState>({
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  });

  const onTabChange = (tabActiveKey: string) => {
    seTabStatus({
      ...tabStatus,
      tabActiveKey,
    });
  };

  return (
    <PageContainer
      title={taskDetail?.jobName}
      className={styles.pageHeader}
      content={description}
      extraContent={extra}
      tabActiveKey={tabStatus.tabActiveKey}
      onTabChange={onTabChange}
      tabList={[
        {
          key: 'detail',
          tab: '分段结果',
        },
        {
          key: 'log',
          tab: '执行日志',
        },
        {
          key: 'extract_result',
          tab: '抽取效果[抽样]',
        },
        {
          key: 'extract_model',
          tab: '抽取知识模型',
        },
      ]}
    >
      <div className={styles.main}>
        {tabStatus.tabActiveKey === 'detail' && (
          <List
            size="large"
            header={false}
            footer={false}
            bordered
            dataSource={splitPreviews}
            renderItem={(item, index) => (
              <List.Item>
                <ShowMore lines={3} key={index}>
                  {item}
                </ShowMore>
              </List.Item>
            )}
          />
        )}
        {tabStatus.tabActiveKey === 'log' && (
          <Timeline
            items={taskLogs.map((log) => {
              return {
                dot:
                  log.status === 'WAITING' ? (
                    <ClockCircleOutlined />
                  ) : log.status === 'RUNNING' ? (
                    <LoadingOutlined />
                  ) : log.status === 'ERROR' ? (
                    <ExclamationCircleOutlined />
                  ) : (
                    <CheckCircleOutlined />
                  ),
                color:
                  log.status === 'WAITING'
                    ? 'gray'
                    : log.status === 'RUNNING'
                      ? 'blue'
                      : log.status === 'ERROR'
                        ? 'red'
                        : 'green',
                children: (
                  <>
                    <p>{log.name}</p>
                    {log.traceLog.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </>
                ),
              };
            })}
          />
        )}
        {tabStatus.tabActiveKey === 'extract_result' && (
          <ResultGraph job={taskDetail} subGraph={{ resultEdges, resultNodes }} />
        )}
        {tabStatus.tabActiveKey === 'extract_model' && (
          <SchemaGraph job={taskDetail} subGraph={{ resultEdges, resultNodes }} />
        )}
      </div>
    </PageContainer>
  );
};
export default ModelingTaskDetail;
