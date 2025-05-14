import type { KnowledgeBaseItem } from '@/pages/list/kb-list/data';
import { queryKnowledgeBaseList } from '@/pages/list/kb-list/service';
import MessageList from '@/pages/profile/kb-chat/components/MessageList';
import SeededPrompts from '@/pages/profile/kb-chat/components/SeededPrompts';
import ChatWelcome from '@/pages/profile/kb-chat/components/Welcom';
import { ConversationItem, MessageContent } from '@/pages/profile/kb-chat/data';
import {
  fetchConversations,
  fetchMessages,
  postNewConversation,
} from '@/pages/profile/kb-chat/service';
import { useSearchParams } from '@@/exports';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Attachments, Conversations, Sender, useXAgent, useXChat } from '@ant-design/x';
import type { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import { BubbleContentType } from '@ant-design/x/es/bubble/interface';
import { Conversation } from '@ant-design/x/es/conversations';
import {
  Button,
  Divider,
  Flex,
  message,
  Select,
  Switch,
  Tooltip,
  Typography,
  type GetProp,
} from 'antd';
import dayjs from 'dayjs';
import { deepParseJson } from 'deep-parse-json';
import { find } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './style.style';
import './styles.css';

const KnowledgeBaseChat: React.FC = () => {
  const { styles } = useStyles();
  const [messageApi, contextHolder] = message.useMessage();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const abortController = useRef<AbortController>(null);

  // ==================== State ====================
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<KnowledgeBaseItem[]>([]);
  const [curProjectId, setCurProjectId] = useState<number>(Number.parseInt(searchParams.get('projectId') || '0'));

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [curConversation, setCurConversation] = useState<any>(Number.parseInt(searchParams.get('conversationId') || '0'));

  const [deepReasoning, setDeepReasoning] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);

  const [inputValue, setInputValue] = useState('');

  const [agent] = useXAgent<BubbleDataType>({
    baseURL: 'http://localhost:8887/v1/chat/completions',
    //baseURL: "https://api.siliconflow.cn/v1/chat/completions",
    //model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    //dangerouslyApiKey: 'Bearer sk-ravoadhrquyrkvaqsgyeufqdgphwxfheifujmaoscudjgldr',
  });
  const loading = agent.isRequesting();

  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: 'Request failed, please try again!',
        role: 'assistant',
      };
    },
    transformMessage: (info) => {
      console.log('transformMessage', info);
      const { originMessage, chunk } = info || {};
      let currentText: MessageContent | BubbleContentType | undefined;
      try {
        if (chunk?.data && !chunk?.data.includes('DONE')) {
          currentText = deepParseJson(chunk?.data);
        } else {
          currentText = originMessage?.content;
        }
      } catch (error) {
        console.error(error);
      }
      return {
        //@ts-ignore
        key: 'ai-' + currentText?.id,
        content: currentText,
        role: 'assistant',
      };
    },
    resolveAbortController: (controller) => {
      //@ts-ignore
      abortController.current = controller;
    },
  });

  // ==================== Event ====================
  const onSubmit = async (val: string) => {
    if (!val) return;

    if (loading) {
      message.error('Request is in progress, please wait for the request to complete.');
      return;
    }
    const projectId = curProjectId;
    if (projectId === 0) {
      messageApi.open({
        type: 'error',
        content: 'there is no project selected',
      });
      return;
    }

    let sessionId = find(conversations, { key: curConversation })?.id;
    if (!sessionId) {
      const res: { data: ConversationItem } = await postNewConversation({
        projectId: projectId,
        name: val,
        //TODO shunyun 2025/5/14: get user id from the user profile
        userId: 11111,
      });
      if (res.data) {
        if (curConversation) {
          setConversations((prevState) => {
            return prevState.map((item) => {
              if (item.key === curConversation) {
                return { ...item, ...item.data, label: res.data.name };
              } else {
                return item;
              }
            });
          });
        } else {
          setConversations([
            ...conversations,
            {
              key: res.data.id,
              ...res.data,
              label: res.data.name,
            },
          ]);
          setCurConversation(res.data.id);
        }
        sessionId = res.data.id;
      }
    }

    if (!sessionId) {
      messageApi.open({
        type: 'error',
        content: 'there is no conversation selected',
      });
      return;
    }

    const now = dayjs().valueOf().toString();
    onRequest({
      stream: true,
      message: {
        key: now,
        //for bubble list
        role: 'user',
        content: val,
        //for server side request
      },
      prompt: [{ type: 'text', content: val }],
      session_id: sessionId,
      project_id: projectId,
      thinking_enabled: deepReasoning,
      search_enabled: false,
    });
  };

  useEffect(() => {
    console.log('queryKnowledgeBaseList', curProjectId, curConversation);
    queryKnowledgeBaseList({ page: 1, size: 20 }).then((res) => {
      setKnowledgeBaseList(res.data.results);
    });
  }, []);

  useEffect(() => {
    console.log('update search params', curProjectId, curConversation);
    //@ts-ignore
    const currentParams = Object.fromEntries(searchParams.entries());
    if (curProjectId) {
      currentParams.projectId = curProjectId.toString();
    } else {
      delete currentParams['projectId'];
    }
    if (curConversation) {
      currentParams.conversationId= curConversation;
    } else {
      delete currentParams['conversationId'];
    }
    console.log('after delete', currentParams);
    setSearchParams({ ...currentParams});
  }, [curProjectId, curConversation]);

  useEffect(() => {
    console.log('before fetch conversations', curProjectId, curConversation);
    if (!curProjectId) {
      return;
    }
    fetchConversations({
      projectId: curProjectId,
      limit: 20,
    }).then((res) => {
      const newConversations = res.data?.map((item) => {
        return {
          key: item.id,
          id: item.id,
          label: item.name,
        };
      });
      setConversations(newConversations);
      //@ts-ignore
      if (!curConversation) {
        setCurConversation(res.data?.[0]?.id);
      } else {
        setCurConversation(curConversation);
      }
      console.log('after fetch conversations', curProjectId, curConversation);
    });
  }, [curProjectId]);

  useEffect(() => {
    console.log('fetch message', curProjectId, curConversation);
    if (!curConversation) {
      return;
    }
    fetchMessages({ sessionId: curConversation, limit: 20, start: 0 }).then((res) => {
      const msgs: any[] = [];
      let items = deepParseJson(res.data);
      items.reverse();
      items.forEach((item: any) => {
        msgs.push({
          id: 'user-' + item.id,
          message: {
            key: 'user-' + item.id,
            role: 'user',
            content: item.nl,
          },
          status: 'DONE',
        });
        msgs.push({
          id: 'ai-' + item.id,
          message: {
            key: 'ai-' + item.id,
            role: 'assistant',
            content: JSON.stringify(item),
          },
          status: 'DONE',
        });
      });
      setMessages(msgs);
    });
  }, [curConversation]);

  return (
    <div className={styles.layout}>
      {contextHolder}
      <div className={styles.sider}>
        <div>
          <Typography.Title level={4}>知识库</Typography.Title>
        </div>
        <Select
          size={'large'}
          style={{ marginBottom: '16px' }}
          showSearch
          value={curProjectId}
          placeholder="Select a knowledge base"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={knowledgeBaseList.map((item) => {
            return { key: item.id, value: item.id, label: item.name };
          })}
          onChange={(val) => {
            setCurProjectId(val);
            setCurConversation('');
          }}
        />
        <div>
          <Typography.Title level={4}>会话</Typography.Title>
        </div>
        <Button
          onClick={() => {
            const now = dayjs().valueOf().toString();
            setConversations([
              {
                key: now,
                label: `New Conversation ${conversations.length + 1}`,
                group: 'Today',
              },
              ...conversations,
            ]);
            //@ts-ignore
            setCurConversation(now);
            // setMessages([]);
          }}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button>

        <Conversations
          items={conversations}
          className={styles.conversations}
          activeKey={curConversation}
          onActiveChange={async (val) => {
            abortController.current?.abort();
            // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
            // In future versions, the sessionId capability will be added to resolve this problem.
            setTimeout(() => {
              //@ts-ignore
              setCurConversation(val);
            }, 100);
          }}
          groupable
          styles={{ item: { padding: '0 8px' } }}
          menu={(conversation) => ({
            items: [
              {
                label: 'Rename',
                key: 'rename',
                icon: <EditOutlined />,
              },
              {
                label: 'Delete',
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  const newList = conversations.filter((item) => item.key !== conversation.key);
                  const newKey = newList?.[0]?.key;
                  setConversations(newList);
                  // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                  // This feature will be fixed in a future version.
                  setTimeout(() => {
                    if (conversation.key === curConversation) {
                      //@ts-ignore
                      setCurConversation(newKey);
                    }
                  }, 200);
                },
              },
            ],
          })}
        />
      </div>
      <div className={styles.chat}>
        <div className={styles.chatList}>
          {messages?.length ? (
            <MessageList messages={messages} />
          ) : (
            <ChatWelcome onSubmit={onSubmit} />
          )}
        </div>
        <div style={{ padding: '0 40px' }}>
          <SeededPrompts onSubmit={onSubmit} />
          <Sender
            value={inputValue}
            header={
              <Sender.Header
                title="Upload File"
                open={attachmentsOpen}
                onOpenChange={setAttachmentsOpen}
                styles={{ content: { padding: 0 } }}
              >
                <Attachments
                  beforeUpload={() => false}
                  items={attachedFiles}
                  onChange={(info) => setAttachedFiles(info.fileList)}
                  placeholder={(type) =>
                    type === 'drop'
                      ? { title: 'Drop file here' }
                      : {
                          icon: <CloudUploadOutlined />,
                          title: 'Upload files',
                          description: 'Click or drag files to this area to upload',
                        }
                  }
                />
              </Sender.Header>
            }
            onSubmit={() => {
              onSubmit(inputValue);
              setInputValue('');
            }}
            onChange={setInputValue}
            onCancel={() => {
              abortController.current?.abort();
            }}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            loading={loading}
            className={styles.sender}
            allowSpeech
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } = info.components;
              return (
                <Flex gap={4}>
                  <SpeechButton className={styles.speechButton} />
                  {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
                </Flex>
              );
            }}
            placeholder="Ask or input / use skills"
            footer={({}) => {
              return (
                <Flex justify="space-between" align="center">
                  <Flex gap="small" align="center">
                    <Switch
                      checkedChildren="深度推理"
                      unCheckedChildren="深度推理"
                      value={deepReasoning}
                      onChange={setDeepReasoning}
                    />
                    <Divider type="vertical" />
                    <Tooltip title="敬请期待">
                      <Button disabled={true} icon={<SearchOutlined />}>
                        Global Search
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseChat;
