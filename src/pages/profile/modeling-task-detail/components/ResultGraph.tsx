import {
  ModelingTaskItem,
  TaskLogEdgeItem,
  TaskLogNodeItem,
} from '@/pages/account/modeling/components/modeling-task-list/data';
import { Graph } from '@antv/g6';
import React, { useEffect, useRef } from 'react';
import { uniq, uniqBy } from 'lodash';

type ResultGraphProps = {
  job?: ModelingTaskItem;
  subGraph: {
    resultNodes: TaskLogNodeItem[];
    resultEdges: TaskLogEdgeItem[];
  };
};

const ResultGraph: React.FC<ResultGraphProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  // const { data: schemaDif } = useRequest(() => {
  //   return getSchemaDiff({ ...props });
  // });
  // const { data: schema } = useRequest(() => {
  //   return getSchema({ projectId: Number.parseInt(searchParams.get('projectId') || '0') });
  // });
  console.log('schema graph init');
  useEffect(() => {
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
      ],
    });
    graph.addData({
      nodes: props?.subGraph?.resultNodes?.map((entity: TaskLogNodeItem) => {
        return {
          id: entity.id,
          type: 'circle',
          label: entity.name,
        };
      }),
      edges: uniqBy(props?.subGraph?.resultEdges, 'id').map((relation: TaskLogEdgeItem) => {
        return {
          id: relation.id,
          source: relation.from,
          target: relation.to,
          label: relation.label,
        };
      }),
    });
    graph.render();
  }, []);
  return (
    <div
      style={{ border: '1px solid #e8e8e8', backgroundColor: '#e8e8e8', height: '800px' }}
      ref={containerRef}
    />
  );
};

export default React.memo(ResultGraph);
