import { getSchema } from '@/pages/knowledgebase/modeling-task-detail/service';
import { useRequest, useSearchParams } from '@@/exports';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

const TypeSelect: React.FC<ProFormSelectProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: schema } = useRequest(() => {
    return getSchema({ projectId: Number.parseInt(searchParams.get('projectId') || '0') });
  });
  const [innerOptions, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (schema) {
      let options = schema.entityTypeDTOList?.map((item) => {
        return {
          label: `${item.nameZh}(${item.name})`,
          value: item.name,
        };
      });
      if (options) {
        setOptions([{ label: '全部', value: 'all' }, ...options]);
      }
    }
  }, [schema]);

  return <ProFormSelect {...props} options={innerOptions} />;
};

export default TypeSelect;
