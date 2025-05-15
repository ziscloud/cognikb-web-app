import ModelingTaskList from '@/pages/account/modeling/components/modeling-task-list';
import { SmileOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Result } from 'antd';
import React, { useState } from 'react';
import BindingView from './components/binding';
import SecurityView from './components/security';
import useStyles from './style.style';

const Settings: React.FC = () => {
  const { styles } = useStyles();
  const menuMap: Record<string, React.ReactNode> = {
    base: '构建任务',
    security: '知识模型',
    notification: '概念模型',
    notification1: '规则管理',
    binding: '知识探查',
  };

  const [selectedTab, setSelectedTab] = useState<string>('base');

  return (
    <ProCard
      tabs={{
        tabPosition: 'top',
        activeKey: selectedTab,
        onChange: (key) => {
          setSelectedTab(key);
        },
        items: [
          { key: 'base', label: menuMap['base'], children: <ModelingTaskList /> },
          { key: 'security', label: menuMap['security'], children: <SecurityView /> },
          { key: 'binding', label: menuMap['binding'], children: <BindingView /> },
          {
            key: 'notification',
            label: menuMap['notification'],
            children: (
              <Result icon={<SmileOutlined />} title={menuMap['notification'] + ', 敬请期待'} />
            ),
          },
          {
            key: 'notification1',
            label: menuMap['notification1'],
            children: (
              <Result icon={<SmileOutlined />} title={menuMap['notification1'] + ', 敬请期待'} />
            ),
          },
        ],
      }}
      headerBordered
    />
  );
};
export default Settings;
