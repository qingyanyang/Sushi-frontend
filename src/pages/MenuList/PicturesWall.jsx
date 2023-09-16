import React, { useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';
import { Upload, message } from 'antd'
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
PicturesWall.protoTypes = {
    getImagName: PropTypes.func.isRequired
}
export default function PicturesWall(props) {
    const {imgs} = props
    console.log('imgs:',imgs)
    let fileListtemp = []
    if(imgs&&imgs.length>0){
        fileListtemp=imgs.map((img,index)=>({
            uid:-index,
            name:img,
            status:'done',
            url: BASE_IMG_URL+img
        }))
    }
    const [fileList, setFileList] = useState(fileListtemp);

    const onChangeUpload = async ({ fileList: newFileList,file }) => {
        console.log('file', file)
        if(file.status==='done'){
            const result = file.response;
            if(result.status===0){
                message.success('upload successfully!')
                const{name,url}=result.data
                newFileList[newFileList.length-1].name =name
                newFileList[newFileList.length - 1].url=url
            }else{
                message.error('upload failed')
            }
        }else if(file.status==='removed'){
            const res = await reqDeleteImg(file.name)
            if(res.data.status===0){
                message.success('delete successfully!')
            }else{
                message.error('delete failed!')
            }
        }
        console.log('newfile',newFileList);
        setFileList(newFileList);
        console.log('filelist:',fileList)
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const onsubmit=()=>{
        const names = fileList.map(file=>file.name)
        props.getImagName(names)
    }
    useEffect(()=>{
        onsubmit()
    }, [fileList])
    return (
        <ImgCrop rotationSlider>
            <Upload
                action="/manage/img/upload"
                listType="picture-card"
                accept='image/*'
                name='image'
                fileList={fileList}
                onChange={onChangeUpload}
                onPreview={onPreview}
            >
                {fileList.length < 3 && '+ Upload'}
            </Upload>
        </ImgCrop>
    )
}
