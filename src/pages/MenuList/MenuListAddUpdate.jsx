import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

// Lazy load Ant Design components
import Card from 'antd/es/card';
import Cascader from 'antd/es/cascader';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import InputNumber from 'antd/es/input-number';
import Input from 'antd/es/input';
import Form from 'antd/es/form';

import { reqCategorys } from '../../api'
import { reqAddOrUpdateItem } from '../../api'
import './index.css'

// Lazy load custom components
const RichTextEditor = React.lazy(() => import('./RichTextEditor'));
const PicturesWall = React.lazy(() => import('./PicturesWall'));


let parentID = '0'
export default function MenuListAddUpdate() {
    const editor = useRef(null)
    const navigate = useNavigate();
    const category = useLocation().state?.category;
    const product = category || {}
    const { name, desc, detail, pCategoryId, categoryId, price, imgs } = product
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [imageNames, setImageNames] = useState([])

    let cateBelong = []
    if (category) {
        if (pCategoryId === '0') {
            cateBelong.push(categoryId)
        } else {
            cateBelong.push(pCategoryId)
            cateBelong.push(categoryId)
        }
    }

    const initOptions = async (categorys) => {
        const option = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))
        if (pCategoryId !== '0') {
            const childrenOptions = await getCategorys(pCategoryId)
            const subOption = childrenOptions.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            if (targetOption) {
                targetOption.children = subOption
            }
        }

        setOptions(option)
    }
    const getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)

        const data = result.data
        if (data.status === 0) {
            //get data arr
            const categorys = data.data
            if (parentId === '0') {
                initOptions(categorys)
            } else {
                return categorys
            }
        } else {
            message.error('fail to get item list!')
        }
    }

    const getImagName = (names) => {
        setImageNames(names)
    }

    useEffect(() => {
        getCategorys(parentID)
    }, [parentID])

    const onFinish = async (values) => {
        const richTextValue = editor.current.getDetail()
        let item = {
            imgs: imageNames,
            name: values.name,
            price: values.price,
            desc: values.desc,
            pCategoryId: values.category.length > 1 ? values.category[0] : '0',
            categoryId: values.category.length > 1 ? values.category[1] : values.category[0],
            detail: richTextValue
        }
        if (category) {
            item._id = category._id
        }
        const result = await reqAddOrUpdateItem(item)
        const data = result.data
        if (data.status === 0) {
            message.success(`${data.data ? 'item add successfully' : 'item update successfully'}`)
            navigate('../', { replace: true })
        } else {
            message.success(`${data.data ? 'item add failed' : 'item update failed'}`)
        }
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        parentID = targetOption.value
        const categorys = await getCategorys(parentID)
        if (categorys && categorys.length > 0) {
            const subOption = categorys.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))
            targetOption.children = subOption;
        } else {
            targetOption.isLeaf = true
        }
        setOptions([...options])
    };

    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };


    const title = (
        <span>
            <LeftOutlined
                style={{
                    marginRight: '8px',
                    color: "#b94537"
                }}
                onClick={() => navigate('../', { replace: true })}
            />
            <span>
                {category ? 'Update item' : 'Add item'}
            </span>
        </span>
    )
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Card
            title={title}
        >
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    style={{
                        width: '600px',
                    }}
                    name="name"
                    label="item name"
                    initialValue={name}
                    rules={[
                        {
                            required: true,
                            message: 'Please input item name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{
                        width: '600px',
                    }}
                    initialValue={cateBelong}
                    name="category"
                    label="item category"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select your item category!',
                        },
                    ]}
                >
                    <Cascader options={options} loadData={loadData} changeOnSelect />
                </Form.Item>

                <Form.Item
                    style={{
                        width: '600px',
                    }}
                    initialValue={price}
                    name="price"
                    label="item price"
                    rules={[
                        {
                            required: true,
                            message: 'Please input item price!',
                        },
                    ]}
                >
                    <InputNumber
                        style={{
                            width: '100%',
                        }}
                    />
                </Form.Item>

                <Form.Item
                    style={{
                        width: '600px',
                    }}
                    initialValue={desc}
                    name="desc"
                    label="item description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input describtion of item',
                        },
                    ]}
                >
                    <Input.TextArea showCount maxLength={100} />
                </Form.Item>

                <Form.Item
                    style={{
                        width: '600px',
                    }}
                    name="imgs"
                    label="&nbsp;&nbsp;&nbsp;item images"
                >
                    <PicturesWall
                        getImagName={(names) => getImagName(names)}
                        imgs={imgs}
                    />
                </Form.Item>

                <Form.Item
                    style={{
                        maxWidth: '900px',
                    }}
                    name="detail"
                    label="&nbsp;&nbsp;&nbsp;item detail"
                >
                    <RichTextEditor
                        ref={editor}
                        detail={detail}
                    />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}
                    style={{
                        maxWidth: '240px',
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        {'confirm'}
                    </Button>
                </Form.Item>

            </Form>
        </Card>
        </Suspense>
    )
}
