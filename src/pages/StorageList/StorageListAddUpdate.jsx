import React, { useState, useEffect, Suspense } from 'react';

// Lazy load Ant Design components
import Card from 'antd/es/card';
import Cascader from 'antd/es/cascader';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import InputNumber from 'antd/es/input-number';
import Input from 'antd/es/input';
import Form from 'antd/es/form';

import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { reqStorageCategory, reqAddOrUpdateStorageItem } from '../../api'

const PicturesWall = React.lazy(() => import('./PicturesWall'));

export default function StorageListAddUpdate() {
    const { Option } = Select
    const [form] = Form.useForm();
    const navigate = useNavigate();
    //get data from father
    const item = useLocation().state?.item;
    const product = item || {}
    const { name, category_id, price, imgs, buyer, supplier, supplier_phone } = product
    const [options, setOptions] = useState([]);
    const [imageNames, setImageNames] = useState([])

    const initOptions = async (categorys) => {
        const option = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: true,
        }))
        setOptions(option)
    }

    //send request
    const getCategorys = async () => {
        const result = await reqStorageCategory()
        const data = result.data
        if (data.status === 0) {
            //get data arr
            const categorys = data.data
            initOptions(categorys)
        } else {
            message.error('fail to get storage list!')
        }
    }

    const getImagName = (names) => {
        setImageNames(names)
    }

    useEffect(() => {
        getCategorys()
    }, [])

    const onFinish = async (values) => {
        let itemNew = {
            imgs: imageNames,
            name: values.name,
            price: values.price,
            buyer: values.buyer,
            supplier: values.supplier,
            supplier_phone: values.supplier_phone,
            create_time: Date.now(),
            category_id: values.category_id[0]
        }
        if (item) {
            itemNew._id = item._id
        }
        const result = await reqAddOrUpdateStorageItem(itemNew)
        const data = result.data
        if (data.status === 0) {
            message.success(`${data.data ? 'item add successfully' : 'item update successfully'}`)
            navigate('../', { replace: true })
            form.resetFields()
        } else {
            message.success(`${data.data ? 'item add failed' : 'item update failed'}`)
        }
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

    const suffixSelector = (
        <Form.Item name="suffix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="USD">$</Option>
                <Option value="CNY">¥</Option>
            </Select>
        </Form.Item>
    );

    const title = (
        <span>
            <LeftOutlined
                style={{
                    marginRight: '8px',
                    color: "#1890ff"
                }}
                onClick={() => navigate('../', { replace: true })}
            />
            <span>
                {item ? 'Update stock' : 'Add stock'}
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
                style={{
                    width: '600px',
                }}
                scrollToFirstError
            >
                <Form.Item

                    name="name"
                    label="name"
                    initialValue={name}
                    rules={[
                        {
                            required: true,
                            message: 'Please input stock name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input
                        style={{
                            minWidth: 600,
                        }} />
                </Form.Item>

                <Form.Item
                    initialValue={[category_id]}
                    name="category_id"
                    label="category"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select your stock category!',
                        },
                    ]}
                >
                    <Cascader
                        style={{
                            minWidth: 600,
                        }}
                        options={options}
                        changeOnSelect
                    />
                </Form.Item>

                <Form.Item
                    initialValue={price}
                    name="price"
                    label="price"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter item price!',
                        },
                    ]}
                >
                    <InputNumber
                        addonAfter={suffixSelector}
                        style={{
                            minWidth: 600,
                        }}
                    />
                </Form.Item>
                <Form.Item

                    name="supplier"
                    label="supplier"
                    initialValue={supplier}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter supplier name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input
                        style={{
                            minWidth: 600,
                        }} />
                </Form.Item>
                <Form.Item
                    initialValue={supplier_phone}
                    name="supplier_phone"
                    label="supplier phone number"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter phone number of supplier',
                        },
                    ]}
                >
                    <InputNumber
                        style={{
                            minWidth: 600,
                        }}
                    />
                </Form.Item>
                <Form.Item

                    name="buyer"
                    label="buyer name"
                    initialValue={buyer}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter buyer name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input
                        style={{
                            minWidth: 600,
                        }} />
                </Form.Item>
                <Form.Item
                    name="imgs"
                    label="&nbsp;&nbsp;&nbsp;images"
                >
                    <PicturesWall
                        getImagName={(names) => getImagName(names)}
                        imgs={imgs}
                    />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}
                    style={{
                        marginRight: -720,
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        confirm
                    </Button>
                </Form.Item>

            </Form>
        </Card>
        </Suspense>
    )
}
