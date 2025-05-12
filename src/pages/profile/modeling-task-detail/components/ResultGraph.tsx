import {
  ModelingTaskItem,
  TaskLogEdgeItem,
  TaskLogNodeItem,
} from '@/pages/account/modeling/components/modeling-task-list/data';
import { Entity } from '@/pages/profile/modeling-task-detail/data';
import { Graph } from '@antv/g6';
import { useRequest, useSearchParams } from '@umijs/max';
import { find, uniqBy } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { getSchema } from '../service';

type ResultGraphProps = {
  job?: ModelingTaskItem;
  subGraph: {
    resultNodes: TaskLogNodeItem[];
    resultEdges: TaskLogEdgeItem[];
  };
};

const ResultGraph: React.FC<ResultGraphProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  // const { data: schemaDif } = useRequest(() => {
  //   return getSchemaDiff({ ...props });
  // });
  const { data: schema } = useRequest(() => {
    return getSchema({ projectId: Number.parseInt(searchParams.get('projectId') || '0') });
  });
  console.log('schema graph init');
  useEffect(() => {
    if (!schema || !containerRef.current) {
      return;
    }
    const graph = new Graph({
      container: containerRef.current!,
      autoFit: 'view',
      node: {
        type: 'circle',
        style: {
          type: 'circle',
          labelText: (d) => d.label,
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
        'hover-activate',
      ],
    });
    const entityTypes = props?.subGraph?.resultNodes?.map((entity: TaskLogNodeItem) => {
      return entity.label;
    });
    const nodesFromSchema = [];
    schema.entityTypeDTOList.forEach((entity: Entity) => {
      if (entityTypes?.includes(entity.name)) {
        nodesFromSchema.push({
          id: 'node-' + entity.id,
          type: 'circle',
          label: entity.nameZh,
          name: entity.name,
          style: { size: 60, fill: '#7FFFD4' },
        });
      }
    });
    console.log(nodesFromSchema);
    const edgesFromSchema = [];
    let nodes = props?.subGraph?.resultNodes?.map((entity: TaskLogNodeItem) => {
      if (nodesFromSchema.length > 0) {
        let node = find(nodesFromSchema, (node) => node.name === entity.label);
        if (node) {
          edgesFromSchema.push({
            id: 'edge-' + entity.id + '-' + node.id,
            source:  node.id,
            target: entity.id,
            label: 'typeOf',
            style: { stroke: '#5CACEE' },
          });
        }
      }
      return {
        id: entity.id,
        type: 'circle',
        label: entity.name,
      };
    });
    let edges = uniqBy(props?.subGraph?.resultEdges, 'id').map((relation: TaskLogEdgeItem) => {
      return {
        id: relation.id,
        source: relation.from,
        target: relation.to,
        label: relation.label,
      };
    });
    graph.addData({
      nodes: [...nodes, ...nodesFromSchema],
      edges: [...edges, ...edgesFromSchema],
    });
    graph.render();
  }, [schema]);
  return (
    <div
      style={{ border: '1px solid #e8e8e8', backgroundColor: '#e8e8e8', height: '800px' }}
      ref={containerRef}
    />
  );
};

export default React.memo(ResultGraph);
