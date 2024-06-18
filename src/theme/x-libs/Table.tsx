import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

export interface DataType {
  [key: string]: string | number;
}

type DataIndex = keyof DataType;

const XTabla: React.FC<{data: DataType[], columns:TableColumnsType<DataType>}> = ({data, columns}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex as string);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text
  });

  // getColumnSearchProps da ise name statikdi sen ise statik etmiyeceksen 
  /*/ 
  bunun iki yolu var birinci getColumnSearchProps bu componenti disariya ciqardib elece
  basket folderindeki data.ts de caqiracaqsan 
  ex: {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    ...getColumnSearchProps('name')
  },
  bu daha doqrudu chunki isdeye bilersenki ikinci sutunda searching olmasin
  ex: {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    ...getColumnSearchProps('name')
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  128 ci setirde artiq lazim olmuyacaq props kimi gelen columns si Table columsina vere bilersen
  ex: Table columns={columns} dataSource={data} />;
  /*/
  const tableColumns = columns?.map(column=>({...column, ...getColumnSearchProps('name')}))

  return <Table columns={tableColumns} dataSource={data} />;
};

export default XTabla;