import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by CogniK"
      links={[
        {
          key: 'CogniK',
          title: 'CogniK',
          href: 'https://cognik.syintelli.com',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/syintelli/cognik-web-app',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
