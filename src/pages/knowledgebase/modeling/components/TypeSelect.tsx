import { getSchema } from '@/pages/knowledgebase/modeling-task-detail/service';
import { useRequest, useSearchParams } from '@@/exports';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

const TypeSelect: React.FC<{
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
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
        setOptions([{label: '全部', value: 'all'},...options]);
      }
    }
  }, [schema]);

  return <Select options={innerOptions} value={props.value} defaultValue={'all'} onChange={props.onChange} />;
};

export  default TypeSelect;
