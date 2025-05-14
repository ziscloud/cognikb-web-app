import { MessageReferenceItem } from '@/pages/profile/kb-chat/data';
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  DotChartOutlined,
  ExclamationCircleFilled,
  FieldTimeOutlined,
  LoadingOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import { Collapse, Popover, Spin } from 'antd';
import { deepParseJson } from 'deep-parse-json';
import React from 'react';
import { PiHeadCircuit } from 'react-icons/pi';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

type AssistantMessageRenderProps = {
  content: string;
};

const statusInfo = (status: string, title: string) => {
  let statusIcon = null;

  if (status === 'loading') {
    statusIcon = (
      <>
        <LoadingOutlined />
        <b style={{ paddingLeft: '4px' }}>{title}</b>
      </>
    );
  } else if (status === 'success') {
    statusIcon = (
      <>
        <CheckCircleOutlined />
        <b style={{ paddingLeft: '4px' }}>{title}</b>
      </>
    );
  } else {
    statusIcon = (
      <>
        <QuestionCircleOutlined />
        <b style={{ paddingLeft: '4px' }}>{title}</b>
      </>
    );
  }

  return <>{statusIcon}</>;
};

const AssistantMessageRender: React.FC<AssistantMessageRenderProps> = ({ content }) => {
  const parseJson = deepParseJson(content);
  const result = parseJson.resultMessage || parseJson;
  console.log('content in the message render');
  return (
    <div>
      <Collapse
        items={[
          {
            key: '1',
            label: (
              <>
                {/*@ts-ignore*/}
                <PiHeadCircuit size={20} />
                基于知识库的深度推理过程 ({result?.metrics?.thinkCost?.toFixed(2)} sec)
              </>
            ),
            children: (
              <Markdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  //@ts-ignore
                  think: ({ children }) => {
                    return <div>{children}</div>;
                  },
                  //@ts-ignore
                  step: ({ status, title, children }) => {
                    return (
                      <div>
                        {statusInfo(status, title)}
                        <div className={'step'} style={{ paddingLeft: '14px' }}>
                          {children}
                        </div>
                      </div>
                    );
                  },
                  //@ts-ignore
                  pre: ({ children }) => {
                    return <div>{children}</div>;
                  },
                  //@ts-ignore
                  code: ({ className, children }) => {
                    return (
                      <Collapse
                        size="small"
                        items={[
                          {
                            key: '1',
                            label: className,
                            children: (
                              <span style={{ wordWrap: 'break-word', color: 'grey' }}>
                                {children}
                              </span>
                            ),
                          },
                        ]}
                      />
                    );
                  },
                  graph: () => {
                    return (
                      <a>
                        <DotChartOutlined />
                      </a>
                    );
                  },
                }}
              >
                {result?.think}
              </Markdown>
            ),
          },
        ]}
        expandIconPosition={'end'}
        size={'small'}
      />
      <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{
          //@ts-ignore
          reference: ({ id }) => {
            if (!result.reference || !id) return <></>;
            for (const item of result.reference) {
              if (item.type === id.split(':')[0]) {
                const ref = item.info.find((refItem: MessageReferenceItem) => refItem.id === id);
                if (ref) {
                  return (
                    <Popover
                      content={
                        <div style={{ maxHeight: 300, overflow: 'auto', width: 500 }}>
                          {ref.content}
                        </div>
                      }
                      trigger={'click'}
                    >
                      <a>[{id.split(':')[1].split('_')[1]}]</a>
                    </Popover>
                  );
                }
              }
            }
          },
        }}
      >
        {result?.answer}
      </Markdown>
      <div style={{ marginTop: '8px' }}>
        {parseJson.status === 'FINISH' && (
          <>
            <CheckCircleFilled style={{ fontSize: '16px', color: 'green' }} />
            <span style={{ marginLeft: '4px' }}>回答完毕</span>
          </>
        )}
        {parseJson.status === 'ERROR' && (
          <>
            <ExclamationCircleFilled style={{ fontSize: '16px', color: 'red' }} />
            <span style={{ marginLeft: '4px' }}>回答异常</span>
          </>
        )}
        {parseJson.status === 'RUNNING' && (
          <>
            <Spin size="small" />
            <span style={{ marginLeft: '4px' }}>回答中...</span>
          </>
        )}
        {parseJson.status === 'TIMEOUT' && (
          <>
            <FieldTimeOutlined style={{ fontSize: '16px', color: 'red' }} />
            <span style={{ marginLeft: '4px' }}>回答超时</span>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(AssistantMessageRender, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content;
});
