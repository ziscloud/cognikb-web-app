import { Prompts } from '@ant-design/x';
import React from 'react';
import type { GetProp } from 'antd';
import { AppstoreAddOutlined, FileSearchOutlined, ProductOutlined, ScheduleOutlined } from '@ant-design/icons';
import useStyles from '../style.style'

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: 'Upgrades',
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: 'Components',
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: 'RICH Guide',
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: 'Installation Introduction',
    icon: <AppstoreAddOutlined />,
  },
];

type SeededPromptsProps = { onSubmit: (val: string) => void };
const SeededPrompts: React.FC<SeededPromptsProps> = ({onSubmit}) => {
  const { styles } = useStyles();

  return (
    <Prompts
      items={SENDER_PROMPTS}
      onItemClick={(info) => {
        onSubmit(info.data.description as string);
      }}
      styles={{
        item: { padding: '6px 12px' }
      }}
      className={styles.senderPrompt}
    />
  );
}

export  default   SeededPrompts;
