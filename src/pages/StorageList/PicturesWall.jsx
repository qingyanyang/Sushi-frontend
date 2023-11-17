import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';
// Lazy load Ant Design components
import Upload from 'antd/es/upload';
import message from 'antd/es/message';

import { reqDeleteImg } from '../../api'

PicturesWall.protoTypes = {
    getImagName: PropTypes.func.isRequired
}

export default function PicturesWall(props) {
    const { imgs } = props
    let fileListtemp = []
    if (imgs && imgs.length > 0) {
        fileListtemp = imgs.map((img, index) => ({
            uid: -index,
            name: img,
            status: 'done',
            url: process.env.REACT_APP_BASE_IMG_URL + img
        }))
    }
    const [fileList, setFileList] = useState(fileListtemp);

    const onChangeUpload = async ({ fileList: newFileList, file }) => {
        if (file.status === 'done') {
            const result = file.response;
            if (result.status === 0) {
                message.success('upload successfully!')
                const { name, url } = result.data
                newFileList[newFileList.length - 1].name = name
                newFileList[newFileList.length - 1].url = url
            } else {
                message.error('upload failed')
            }
        } else if (file.status === 'removed') {
            const res = await reqDeleteImg(file.name)
            if (res.data.status === 0) {
                message.success('delete successfully!')
            } else {
                message.error('delete failed!')
            }
        }
        setFileList(newFileList);
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

    const onsubmit = () => {
        const names = fileList.map(file => file.name)
        props.getImagName(names)
    }

    useEffect(() => {
        onsubmit()
    }, [fileList])

    return (
        <ImgCrop rotationSlider>
            <Upload
                action={`${process.env.REACT_APP_BASE_URL}/manage/img/upload`}
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
