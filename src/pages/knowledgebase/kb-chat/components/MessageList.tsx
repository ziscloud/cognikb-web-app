import AssistantMessageRender from '@/pages/knowledgebase/kb-chat/components/AssistantMessageRender';
import useStyles from '@/pages/knowledgebase/kb-chat/style.style';
import { CopyOutlined, DislikeOutlined, LikeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { Button, Spin } from 'antd';
import React from 'react';

type MessageListProps = {
  messages: MessageInfo<BubbleDataType>[];
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { styles } = useStyles();

  return (
    <Bubble.List
      items={messages?.map((i) => ({
        content: i.message.content,
        role: i.message.role,
        classNames: {
          content: i.status === 'loading' ? styles.loadingMessage : '',
        },
        typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
        messageRender: (content) => {
          if (i.message.role === 'assistant') {
            return <AssistantMessageRender content={content} />;
          }
          return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
        },
      }))}
      style={{ height: '100%', paddingInline: '40px' }}
      roles={{
        assistant: {
          placement: 'start',
          footer: (
            <div style={{ display: 'flex' }}>
              <Button type="text" size="small" icon={<ReloadOutlined />} />
              <Button type="text" size="small" icon={<CopyOutlined />} />
              <Button type="text" size="small" icon={<LikeOutlined />} />
              <Button type="text" size="small" icon={<DislikeOutlined />} />
            </div>
          ),
          loadingRender: () => <Spin size="small" />,
        },
        user: { placement: 'end' },
      }}
    />
  );
};

export default React.memo(MessageList);
