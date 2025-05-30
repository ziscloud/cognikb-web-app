import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link, useRequest } from '@umijs/max';
import { Button, Card, List, Typography } from 'antd';
import type { KnowledgeBaseItem } from './data.d';
import { queryKnowledgeBaseList } from './service';
import useStyles from './style.style';

const { Paragraph } = Typography;
const CardList = () => {
  const { styles } = useStyles();
  const { data, loading } = useRequest(() => {
    return queryKnowledgeBaseList({
      page: 1,
      size: 10,
    });
  });
  console.log(data);
  const list = data?.results || [];
  const pageHeaderContent = (
    <div className={styles.pageHeaderContent}>
      <p>
        段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
        提供跨越设计与开发的体验解决方案。
      </p>
      <div className={styles.contentLink}>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
          快速开始
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
          产品简介
        </a>
        <a>
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
          产品文档
        </a>
      </div>
    </div>
  );
  const pageHeaderExtraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  const nullData: Partial<KnowledgeBaseItem> = {};
  return (
    <PageContainer content={pageHeaderContent} extraContent={pageHeaderExtraContent}>
      <div className={styles.cardList}>
        <List<Partial<KnowledgeBaseItem>>
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[nullData, ...list]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Link key="option1" to={`/knowledgebase/kb-list/modeling?projectId=${item.id}`}>知识库构建</Link>,
                      <Link key="option2" to={`/knowledgebase/kb-list/kb-chat?projectId=${item.id}`}>知识问答</Link>,
                      <Link key="option3" to={`/knowledgebase/kb-list/edit-kb-form?projectId=${item.id}`}>知识库配置</Link>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.name}</a>}
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Link to="/knowledgebase/kb-list/create-kb-form">
                  <Button type="dashed" className={styles.newButton}>
                    <PlusOutlined /> 新建知识库
                  </Button>
                </Link>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};
export default CardList;
