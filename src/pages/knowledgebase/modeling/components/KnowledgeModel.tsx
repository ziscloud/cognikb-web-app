import { fetchSchemaScript, postSchemaScript } from '@/pages/knowledgebase/modeling/service';
import { Entity } from '@/pages/knowledgebase/modeling-task-detail/data';
import { getSchema } from '@/pages/knowledgebase/modeling-task-detail/service';
import { useSearchParams } from '@@/exports';
import { ProCard } from '@ant-design/pro-components';
import { Graph } from '@antv/g6';
import { Editor } from '@monaco-editor/react';
import { useRequest } from '@umijs/max';
import { Button, message, Space } from 'antd';
import { uniqBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const KnowledgeModelView: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [schemaScript, setSchemaScript] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: schema } = useRequest(() => {
    return getSchema({ projectId: Number.parseInt(searchParams.get('projectId') || '0') });
  });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (schema) {
      const graph = new Graph({
        container: containerRef.current!,
        autoFit: 'view',
        node: {
          type: 'circle',
          style: {
            type: 'circle',
            //@ts-ignore
            labelText: (d) => d.label,
            fill: '#5CA5FF',
          },
        },
        edge: {
          type: 'cubic-horizontal',
          animation: {
            enter: false,
          },
          style: {
            stroke: '#ccc',
            endArrow: true,
            //@ts-ignore
            labelText: (d) => d.label,
          },
        },
        layout: {
          type: 'radial',
          nodeSize: 32,
          unitRadius: 200,
          linkDistance: 500,
          preventOverlap: true,
          maxPreventOverlapIteration: 100,
          strictRadial: false,
        },
        behaviors: [
          {
            type: 'click-select',
            degree: 1,
            state: 'active',
            unselectedState: 'inactive',
            multiple: true,
            trigger: ['shift'],
          },
          'drag-canvas',
          'zoom-canvas',
          'drag-element',
          'hover-activate',
        ],
      });
      graph.addData({
        nodes: uniqBy(
          schema?.entityTypeDTOList?.map((entity: Entity) => {
            return {
              id: 'node-' + entity.id,
              type: 'circle',
              label: entity.nameZh,
            };
          }),
          'id',
        ),
      });
      graph.render();
    }
  }, [schema, isEditing]);

  useEffect(() => {
    fetchSchemaScript({ projectId: Number.parseInt(searchParams.get('projectId') || '0') }).then(
      (res) => {
        setSchemaScript(res.data);
      },
    );
  }, []);

  return (
    <>
      {contextHolder}
      <ProCard
        title="知识模型"
        headerBordered
        extra={
          <>
            {isEditing && (
              <Space>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  loading={isSaving}
                  type={'primary'}
                  onClick={async (event) => {
                    setIsSaving(true);
                    const res = await postSchemaScript({ data: schemaScript });
                    setIsSaving(false);
                    if (res.success) {
                      setIsEditing(false);
                      messageApi.success('保存成功');
                    } else {
                      messageApi.error('保存失败');
                      event.preventDefault();
                    }
                  }}
                >
                  保存
                </Button>
              </Space>
            )}
            {!isEditing && (
              <Button
                size="small"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                编辑Schema
              </Button>
            )}
          </>
        }
      >
        {!isEditing && (
          <div
            style={{ border: '1px solid #e8e8e8', backgroundColor: '#e8e8e8', height: '800px' }}
            ref={containerRef}
          />
        )}
        {isEditing && (
          <div>
            <Editor
              height="80vh"
              defaultLanguage="yaml"
              defaultValue={schemaScript}
              onChange={(content) => {
                setSchemaScript(content || '');
              }}
            />
          </div>
        )}
      </ProCard>
    </>
  );
};

export default React.memo(KnowledgeModelView);
