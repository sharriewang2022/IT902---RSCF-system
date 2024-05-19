import React, { useState, useRef, useMemo,CSSProperties }  from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Layout, Input,Button } from 'antd';
import { SERVER_BASE_URL, FILE_SIZE_LIMIT } from "../../config/sysConfig";
import { FileHashRSCF } from "../../product/services/interfaceTypes";
// import 'antd/dist/antd.css';
import 'antd/dist/reset.css';
import { Label } from 'reactstrap';
import type { ConfigProviderProps } from 'antd';
import { GoodRSCFApiCall } from "../../product/services/hooksProduct";


type SizeType = ConfigProviderProps['componentSize'];

const { TextArea } = Input;
const { Dragger } = Upload;
const { Header, Content, Footer } = Layout;

const UploadFileView = () => {
    const { addSomeGoodRSCF } = GoodRSCFApiCall();
    const [size, setSize] = useState<SizeType>('large');
    const [showupload, setShowupload] = useState(false);
    //file description
    const [specValue, setSpecValue] = useState('');
    const specRef = useRef<HTMLTextAreaElement>(null);
    const textAreaStyle: CSSProperties = useMemo(() => ({
        // resize: "none" ,
        // innerWidth: '300px'
    }), []);
    const {
        addFileIPFSHash,
    } = GoodRSCFApiCall();

    function getFilesList(){
        window.open("./#/fileListView", "_blank")
    }
 
    const props = {
        name: 'file',
        multiple: true,
        action: SERVER_BASE_URL +'/file/upload/'+ sessionStorage.getItem("userName"),
        // accept:'.xls, .xlsx, .csv, .zip',
        // headers: {
        //    "content-type": 'application/json'
        // },        
        data:{"userName": sessionStorage.getItem("userName"), "description":'upload file to IPFS'},
        onChange(info:any) {
            setShowupload(true);
            const isLimit = info.file.size / 1024 / 1024 < FILE_SIZE_LIMIT;
            if (!isLimit) {
                message.error(`Limited to ${FILE_SIZE_LIMIT}MB or less`);
                return false;
            }
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                var fileInfo : FileHashRSCF = {
                    documentId: info.file.response.documentId,
                    hashcodeIPFS: info.file.response.fileIPFSHash,
                    fileName: info.file.name,
                    filePath: info.file.response.realPath,
                }
                addFileIPFSHash(fileInfo)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setShowupload(false);
            }
        },

        onDrop(e:React.DragEvent<HTMLDivElement>) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        FileList,
        beforeUpload: (file:any) => {
            const isLimit = file.size / 1024 / 1024 < FILE_SIZE_LIMIT;
            if (!isLimit) {
                return false;
            }            
            return true;
        },            
    };

    return (
       <>
       <Button className="btn btn-primary" style={{ left:200, top:70 }}
            size={size} onClick={getFilesList}>
            File List
        </Button>
        <Layout className="body" style={{ 
            width:500, 
            height:400,
            background: 'none', 
            padding: 0, 
            // margin: 100,
            position:'relative',
            left:200,
            top:100, 
            }}
            >
            <Header style={{ background: '#fff', padding: 0 }}>                 
                <Label>
                    <h3>Choose File:</h3>
                </Label>                
            </Header>
            <Content style={{        
                margin: 10 
                }} >
                <Dragger {...props} showUploadList={showupload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        {`Support for a single upload. Limited to ${FILE_SIZE_LIMIT}MB or less`}
                    </p>
                </Dragger>
            </Content>       
            <Footer style={{ background: '#fff', padding: 0 }}>
            {/* <TextArea placeholder="file description"
                 style = {textAreaStyle}
                maxLength={100}  
                 autoSize={{ minRows: 2, maxRows: 6 }}
                 ref={specRef}
                 value={specValue}
                 onChange={(e) => setSpecValue(e.target.value)}
             />  */}
            </Footer>           
        </Layout>
        </> 
    )
};
export default UploadFileView;