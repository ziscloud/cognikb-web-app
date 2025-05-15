import type {
  ModelingTaskItem,
  TableListPagination,
} from '@/pages/knowledgebase/modeling/components/modeling-task-list/data';
import TypeSelect from '@/pages/knowledgebase/modeling/components/TypeSelect';
import { searchDatas } from '@/pages/knowledgebase/modeling/service';
import success from '@/pages/result/success';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const BindingView: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [total, setTotal] = useState(0);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ModelingTaskItem>[] = [
    {
      title: '类型',
      dataIndex: 'label',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return <TypeSelect {...rest} />;
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '名称(name)',
      dataIndex: 'fields.name',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (_, record) => {
        return record.fields?.name;
      },
    },
    {
      title: '实体主键(id)',
      dataIndex: 'fields.id',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return record.fields?.id;
      },
    },
    {
      title: 'semanticType(semanticType)',
      dataIndex: 'fields.semanticType',
      hideInSearch: true,
      render: (_, record) => {
        return record.fields?.semanticType;
      },
    },
    {
      title: 'desc(desc)',
      dataIndex: 'fields.desc',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return record.fields?.desc;
      },
    },
    {
      title: 'content(content)',
      dataIndex: 'fields.content',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return record.fields?.content;
      },
    },
  ];

  return (
    <ProTable<ModelingTaskItem, TableListPagination>
      headerTitle="知识列表"
      actionRef={actionRef}
      rowKey="docId"
      toolBarRender={() => [
        <Button type="primary" key={'graph_view'} disabled={true}>
          <PlusOutlined /> 画布探查
        </Button>,
      ]}
      pagination={{
        pageSize: 10,
      }}
      request={async ({ pageSize, current, ...search }, sort, filter) => {
        console.log(sort, filter, search);
        if (!hasNextPage && current >= total / pagesiz) {
          return {
            data: [],
            success: success,
            total: total,
          };
        }
        const body = {
          page: current,
          size: pageSize,
          sort,
          filter,
          matchExactOnly: false,
          label: search.label || 'all',
          queryStr: search['fields.name'],
          projectId: Number.parseInt(searchParams.get('projectId') || '0'),
        };
        console.log(body.queryStr);
        if (body.queryStr) {
          const res = await searchDatas(body);
          if (res.success && res.result.total < pageSize) {
            setHasNextPage(false);
          }

          const result = {
            data: res.result.results,
            success: res.success,
            total: total + +(hasNextPage ? res.result?.total + 1 : 0),
          };

          if (res.success && res.result.total) {
            setTotal((prevState) => prevState + res.result.total);
          }

          return result;
        }
      }}
      columns={columns}
      rowSelection={false}
    />
  );
};

export default BindingView;
