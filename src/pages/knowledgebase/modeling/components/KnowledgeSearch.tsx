import TypeSelect from '@/pages/knowledgebase/modeling/components/TypeSelect';
import type { DataItem } from '@/pages/knowledgebase/modeling/data';
import { searchDatas } from '@/pages/knowledgebase/modeling/service';
import {
  ColumnHeightOutlined,
  LeftOutlined,
  MonitorOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { ProFormText, QueryFilter } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button, Dropdown, Flex, Select, Space, Table, TableProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const KnowledgeSearchView: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [tableSize, setTableSize] = useState<'small' | 'middle' | 'large'>('middle');
  const [total, setTotal] = useState<number | null>(0);
  const [search, setSearch] = useState<{
    label?: string;
    'fields.name'?: string;
  }>({ label: 'all' });
  const [dataSource, setDataSource] = useState<DataItem[]>([]);

  const columns: TableProps<DataItem>['columns'] = [
    {
      title: '类型',
      dataIndex: 'label',
    },
    {
      title: '名称(name)',
      dataIndex: 'fields.name',
      ellipsis: true,
      render: (_, record) => {
        return record.fields?.name;
      },
    },
    {
      title: '实体主键(id)',
      dataIndex: 'fields.id',
      ellipsis: true,
      render: (_, record) => {
        return record.fields?.id;
      },
    },
    {
      title: 'semanticType(semanticType)',
      dataIndex: 'fields.semanticType',
      render: (_, record) => {
        return record.fields?.semanticType;
      },
    },
    {
      title: 'desc(desc)',
      dataIndex: 'fields.desc',
      ellipsis: true,
      render: (_, record) => {
        return record.fields?.desc;
      },
    },
    {
      title: 'content(content)',
      dataIndex: 'fields.content',
      ellipsis: true,
      render: (_, record) => {
        return record.fields?.content;
      },
    },
  ];

  const loadData = () => {
    const body = {
      page: current,
      size: pageSize,
      // sort,
      // filter,
      matchExactOnly: false,
      label: search.label,
      queryStr: search['fields.name'],
      projectId: Number.parseInt(searchParams.get('projectId') || '0'),
    };
    if (body.queryStr) {
      searchDatas(body).then((res) => {
        if (res.success) {
          if (res.result.total > 0) {
            setDataSource(res.result?.results);
          } else {
            setHasNextPage(false);
            setTotal(current - 1);
            setCurrent((prevState) => prevState - 1);
          }
        }
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [pageSize, current, search]);

  return (
    <Flex vertical={true} gap={'small'}>
      <QueryFilter
        labelWidth={'auto'}
        initialValues={search}
        onFinish={(values) => {
          setSearch(values);
          setTotal(null);
          setCurrent(1);
          setHasNextPage(true);
        }}
      >
        <TypeSelect
          name={'label'}
          label={'类型'}
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
        />
        <ProFormText
          name={'fields.name'}
          label={'名称(name)'}
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
        />
      </QueryFilter>
      <Flex justify={'space-between'}>
        <Typography.Title level={4}>知识列表</Typography.Title>
        <Space>
          <Button type="primary" key={'graph_view'} disabled={true} icon={<MonitorOutlined />}>
            画布探查
          </Button>
          <Button icon={<ReloadOutlined />} onClick={loadData} type={'text'} />
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'small', label: 'Small' },
                { key: 'middle', label: 'middle' },
                { key: 'large', label: 'Large' },
              ],
              onClick: ({ key }) => {
                //@ts-ignore
                setTableSize(key);
              },
            }}
          >
            <Button
              icon={<ColumnHeightOutlined />}
              type={'text'}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        </Space>
      </Flex>
      <Table<DataItem>
        // actionRef={actionRef}
        size={tableSize}
        rowKey="docId"
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        rowSelection={undefined}
      />
      <Flex justify={'flex-end'}>
        <Space>
          <Space>
            <span>第</span>
            <span>{current}</span>/<span>{hasNextPage ? '...' : total}</span> <span>页</span>
          </Space>
          <Select
            value={pageSize.toString()}
            onSelect={(value) => setPageSize(Number.parseInt(value))}
            options={[
              {
                label: '5/页',
                value: '5',
              },
              {
                label: '10/页',
                value: '10',
              },
              {
                label: '20/页',
                value: '20',
              },
              {
                label: '50/页',
                value: '50',
              },
              {
                label: '100/页',
                value: '100',
              },
            ]}
          ></Select>
          <Button
            icon={<LeftOutlined />}
            disabled={current === 1}
            onClick={() => (current > 1 ? setCurrent(current - 1) : null)}
          ></Button>
          <Button
            icon={<RightOutlined />}
            disabled={total ? current >= total : !hasNextPage}
            onClick={() => setCurrent(current + 1)}
          ></Button>
        </Space>
      </Flex>
    </Flex>
  );
};

export default KnowledgeSearchView;
