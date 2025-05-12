import {
  ModelingTaskItem,
  TaskLogEdgeItem,
  TaskLogNodeItem,
} from '@/pages/account/modeling/components/modeling-task-list/data';
import { Entity, EntityRelation } from '@/pages/profile/modeling-task-detail/data';
import { getSchema, getSchemaDiff } from '@/pages/profile/modeling-task-detail/service';
import { useSearchParams } from '@@/exports';
import { Graph } from '@antv/g6';
import { useRequest } from '@umijs/max';
import React, { useEffect, useRef } from 'react';

type SchemaGraphProps = {
  job?: ModelingTaskItem;
  subGraph: {
    resultNodes: TaskLogNodeItem[];
    resultEdges: TaskLogEdgeItem[];
  };
};

const SchemaGraph: React.FC<SchemaGraphProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: schemaDif } = useRequest(() => {
    return getSchemaDiff({ ...props });
  });
  const { data: schema } = useRequest(() => {
    return getSchema({ projectId: Number.parseInt(searchParams.get('projectId') || '0') });
  });
  console.log('schema graph init');
  useEffect(() => {
    if (schema && schemaDif) {
      const graph = new Graph({
        container: containerRef.current!,
        autoFit: 'view',
        node: {
          type: 'circle',
          style: {
            type: 'circle',
            labelText: (d) => d.label,
            fill: "#5CA5FF"
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
          'hover-activate'
        ],
      });
      graph.addData({
        nodes: schema?.entityTypeDTOList?.map((entity: Entity) => {
          return {
            id: 'node-' + entity.id,
            type: 'circle',
            label: entity.nameZh,
          };
        }),
        edges: schemaDif?.relationTypeDTOList?.map((relation: EntityRelation) => {
          return {
            id: 'edge-' +relation.startEntity.id + '-' + relation.endEntity.id,
            source: 'node-' +relation.startEntity.id,
            target: 'node-' +relation.endEntity.id,
            label: relation.nameZh,
          };
        }),
      });
      graph.render();
    }
  }, [schema, schemaDif]);
  return <div style={{border: '1px solid #e8e8e8', backgroundColor: '#e8e8e8', height: '800px'}} ref={containerRef} />;
};

export default React.memo(SchemaGraph);
