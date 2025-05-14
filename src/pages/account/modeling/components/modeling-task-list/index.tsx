import useStyles from '@/pages/account/modeling/components/modeling-task-list/index.style';
import { useSearchParams } from '@@/exports';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ActionType, ProColumns, ProSkeleton, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, Drawer, Input, Modal, Space, Timeline } from 'antd';
import { sortBy } from 'lodash';
import React, { useRef, useState } from 'react';
import type { ModelingTaskItem, TableListPagination, TaskLogItem } from './data';
import { deleteTask, fetchTaskLog, rule } from './service';

/**
 * 添加节点
 *
 * @param fields
 */

const ModelingTaskList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isFetchingTaskLog, setIsFetchingTaskLog] = useState<boolean>(false);
  const [taskLogs, setTaskLogs] = useState<TaskLogItem[]>([]);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ModelingTaskItem>();

  const { styles } = useStyles();

  const columns: ProColumns<ModelingTaskItem>[] = [
    {
      title: '知识名称',
      dataIndex: 'jobName',
      tip: '知识名称是唯一的 key',
    },
    {
      title: '文件类型',
      dataIndex: 'dataSourceType',
    },
    {
      title: '导入类型',
      dataIndex: 'lifeCycle',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '创建Owner',
      dataIndex: 'createUser',
      valueType: 'text',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已完成',
          status: 'FINISH',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link
          key="task_detail"
          to={`/profile/modeling-task-detail?projectId=${searchParams.get('projectId')}&taskId=${record.id}`}
        >
          详情
        </Link>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
            setIsFetchingTaskLog(true);
            fetchTaskLog({ id: record.taskId, jobId: record.id }).then((res) => {
              if (res.success) {
                if (res.result.resultMessage) {
                  //@ts-ignore
                  const taskLog: TaskLogItem[] = JSON.parse(res.result.resultMessage);
                  let sortedTaskLogItems = sortBy(taskLog, (item: TaskLogItem) => item.index);
                  setTaskLogs(sortedTaskLogItems);
                  setIsFetchingTaskLog(false);
                }
              }
            });
          }}
        >
          日志
        </a>,
        <a
          key="delete_task"
          onClick={() => {
            Modal.confirm({
              title: '删除任务',
              content: '删除文档同时将删除已抽取的知识，确定删除吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () =>
                deleteTask({ id: record.id }).then(() => {
                  actionRef.current?.reload();
                }),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <ProTable<ModelingTaskItem, TableListPagination>
        headerTitle="构建任务列表"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        options={{
          search: true,
        }}
        toolBarRender={() => [
          <Link key="new_modeling_task" to={''}>
            <Button type="primary" key="primary">
              <PlusOutlined /> 新建任务
            </Button>
          </Link>,
        ]}

        request={async ({ pageSize, current }, sort, filter) => {
          const res = await rule({
            start: current,
            limit: pageSize,
            sort,
            filter,
            projectId: Number.parseInt(searchParams.get('projectId') || '0'),
          });
          return {
            data: res.result.data,
            success: res.success,
            total: res.result.total,
          };
        }}
        columns={columns}
        rowSelection={false}
      />
      <Drawer
        title={`${currentRow?.jobName}的任务日志`}
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </Space>
        }
      >
        {isFetchingTaskLog || taskLogs.length === 0 ? (
          <ProSkeleton type={'list'} />
        ) : (
          <Timeline
            items={taskLogs.map((log) => {
              return {
                dot:
                  log.status === 'WAITING' ? (
                    <ClockCircleOutlined className={styles.timeline_clock_icon} />
                  ) : log.status === 'RUNNING' ? (
                    <LoadingOutlined className={styles.timeline_clock_icon} />
                  ) : log.status === 'ERROR' ? (
                    <ExclamationCircleOutlined className={styles.timeline_clock_icon} />
                  ) : (
                    <CheckCircleOutlined className={styles.timeline_clock_icon} />
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
      </Drawer>
    </>
  );
};

export default ModelingTaskList;
