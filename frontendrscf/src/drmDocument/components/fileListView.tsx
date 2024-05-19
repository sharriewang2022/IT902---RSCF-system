import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { getDocumentList } from '../../api/fileApi';
import { GoodRSCFApiCall } from "../../product/services/hooksProduct";
import { DocumentType} from "../../util/variableTypes";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<DocumentType> = [
  {
    title: 'Document ID',
    dataIndex: 'documentId',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Document Name',
    dataIndex: 'documentName',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Document Path',
    dataIndex: 'documentPaths',
    width: '20%',
  },
  {
    title: 'Is File Changed',
    dataIndex: 'isFileChanged',
  },
  {
    title: 'IPFS Hashcode',
    dataIndex: 'fileIPFSHash',
  },
  {
    title: 'Blockchain HashCode',
    dataIndex: 'blockchainHash',
  },
];

const FileListView: React.FC = () => {
  const [fileData, setFileData] = useState<DocumentType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const {
    getFileIPFSHash,
  } = GoodRSCFApiCall();

  const getFileTableData = async () => {
    setLoading(true);
    
    var fileList = await getDocumentList(sessionStorage.getItem("userName")||"sa");
    var fileIPFSHashOnBlockchain = await getFileIPFSHash();
   
    var fileTableDataList:Array<DocumentType>= [];
 
    if(fileList.data.code == 200){
      fileList.data.data.map((item:any)=>{
        var obj : DocumentType = {
          documentId: '',
          documentName: '',
          documentPaths: '',
          fileIPFSHash:'',
          blockchainHash:'',
          isFileChanged:'No',
        };
        obj.documentId = item.DocumentID
        obj.documentName = item.DocumentName
        obj.documentPaths = item.RealPath
        obj.fileIPFSHash = item.fileIpfsHash
        if(fileIPFSHashOnBlockchain){
          fileIPFSHashOnBlockchain.map((fileHash:any)=>{
            if(obj.blockchainHash == '' && item.DocumentID == fileHash.documentId){
              obj.blockchainHash = fileHash.hashcodeIPFS
            }
          })          
        }
        if(obj.fileIPFSHash !=  obj.blockchainHash ){
          obj.isFileChanged = "Yes"
        }
        fileTableDataList.push(obj)        
      }) 
    }
    setFileData(fileTableDataList);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: fileTableDataList.length,
      },
    });
  }

  useEffect(() => {
    getFileTableData();
  }, [JSON.stringify(tableParams)]); 

  const handleTableChange = (
    // pagination: TablePaginationConfig,
    // filters: Record<string, FilterValue>,
    // sorter: SorterResult<DataType>,
    pagination: any,
    filters: any,
    sorter: any,
  ) => {     
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination && pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFileData([]);
    }
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.documentId}
      dataSource={fileData}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default FileListView;
