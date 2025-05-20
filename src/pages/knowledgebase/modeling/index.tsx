import ModelingTaskList from '@/pages/knowledgebase/modeling/components/modeling-task-list';
import { SmileOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Result } from 'antd';
import React, { useState } from 'react';
import KnowledgeSearchView from './components/KnowledgeSearch';
import KnowledgeModelView from './components/KnowledgeModel';
import useStyles from './style.style';

const Settings: React.FC = () => {
  const { styles } = useStyles();
  const menuMap: Record<string, React.ReactNode> = {
    ModelingTask: '构建任务',
    KnowledgeModel: '知识模型',
    ConceptModel: '概念模型',
    RuleList: '规则管理',
    KnowledgeSearch: '知识探查',
  };

  const [selectedTab, setSelectedTab] = useState<string>('ModelingTask');

  return (
    <PageContainer>
    <ProCard
      tabs={{
        tabPosition: 'top',
        activeKey: selectedTab,
        onChange: (key) => {
          setSelectedTab(key);
        },
        items: [
          { key: 'ModelingTask', label: menuMap['ModelingTask'], children: <ModelingTaskList /> },
          { key: 'KnowledgeModel', label: menuMap['KnowledgeModel'], children: <KnowledgeModelView /> },
          { key: 'KnowledgeSearch', label: menuMap['KnowledgeSearch'], children: <KnowledgeSearchView /> },
          {
            key: 'ConceptModel',
            label: menuMap['ConceptModel'],
            children: (
              <Result icon={<SmileOutlined />} title={menuMap['ConceptModel'] + ', 敬请期待'} />
            ),
          },
          {
            key: 'RuleList',
            label: menuMap['RuleList'],
            children: (
              <Result icon={<SmileOutlined />} title={menuMap['RuleList'] + ', 敬请期待'} />
            ),
          },
        ],
      }}
      headerBordered
    />
    </PageContainer>
  );
};
export default Settings;
