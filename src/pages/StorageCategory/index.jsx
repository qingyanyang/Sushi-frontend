import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/LinkButton'
import { reqStorageCategory, reqAddStorageCategory, reqUpdateStorageCategory, reqDeleteStorageCategory } from '../../api'
import AddRoleForm from './AddRoleForm'

export default function Index() {
    const [columns, setColumns] = useState([])
    const [loading, setLoading] = useState(false)
    const [categorys, setCategorys] = useState([])
    const [category, setCategory] = useState({})
    const [showModal, setModalshow] = useState('0')//0: all close 1:1 open 2:2open
    const [form, setForm] = useState({})
    const [auth_name] = useState(storageUtils.getUser().username)
    //initialize
    const initColumns = () => {
        setColumns([
            {
                title: 'Category',
                dataIndex: 'name',
            },
            {
                title: 'Create time',
                dataIndex: 'create_time',
            },
            {
                title: 'Operator',
                dataIndex: 'auth_name',
            },
            {
                title: 'Operation',
                width: '20%',
                //category is the object of each row
                render: (category) => (
                    <span style={{ marginLeft: '-20px' }}>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showUpdateCategoryName(category)}>update</LinkButton>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => handleDeleteCategory(category)}>delete</LinkButton>
                    </span>
                )
            }
        ])
    }

    const showAddCategory = () => {
        setModalshow('1')
    }

    const showUpdateCategoryName = (category) => {
        setCategory(category)
        setModalshow('3')
    }

    //onOk
    const updateCategoryName = async () => {
        const name = form.getFieldsValue().input
        setModalshow('0')
        form.resetFields()
        const res = await reqUpdateStorageCategory(category._id, { name,auth_name})
        const data = res.data
        if (data.status === 0) {
            message.success('update category name successfully!')
            getCategorys()
            setCategory({})
        } else {
            message.error('update category name failed!')
        }
    }

    const handleCancelDelete = () => {
        setModalshow('0')
    }

    const handleOk = async () => {
        setModalshow('0')
        const res = await reqDeleteStorageCategory(category._id)
        const data = res.data
        if (data.status === 0) {
            message.success('delete category successfully!')
            getCategorys()
            setCategory({})
        } else {
            message.error('delete category failed!')
        }
    }

    const handleDeleteCategory = (category) => {
        setModalshow('4')
        setCategory(category)
    }
    const addCategory = async () => {
        const name = form.getFieldsValue().input
        setModalshow('0')
        form.resetFields()
        const res = await reqAddStorageCategory({ name, create_time: formateDate(Date.now()), auth_name})
        const data = res.data
        if (data.status === 0) {
            setCategorys((prevRoles) => [...prevRoles, data.data])
            getCategorys()
            message.success('add role successfully!')
        } else {
            message.error('add role failed!')
        }
    }

    const handleCancel = () => {
        setModalshow('0')
        setCategory({})
        form.resetFields()
    }

    const getCategorys = async () => {
        setLoading(true)
        const result = await reqStorageCategory()
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            //get data arr
            setCategorys(data.data)
        } else {
            message.error('fail to get category list!')
        }
    }

    const getForm = (form) => {
        setForm(form);
    };

    useEffect(() => {
        initColumns()
    }, [])

    useEffect(() => {
        getCategorys()
    }, [])

    const title = (
        <span>
            <Button
                type='primary'
                onClick={showAddCategory}
                style={{ marginRight: '10px' }}>
                <PlusOutlined />
                add category
            </Button>
            
        </span>

    )
    return (
        <Card
            title={title}
            style={{
                width: '100%'
            }}
        >
            <Table
                rowKey='_id'
                loading={loading}
                dataSource={categorys}
                columns={columns}
                pagination={{ defaultPageSize: 3, showQuickJumper: true }} />
            <Modal title="add category"
                open={showModal === '1'}
                onOk={addCategory}
                onCancel={handleCancel}>
                <AddRoleForm
                    getForm={getForm}
                />
            </Modal>
            <Modal title="update category name"
                open={showModal === '3'}
                onOk={updateCategoryName}
                onCancel={handleCancel}>
                <AddRoleForm
                    getForm={getForm}
                    category={category}
                />
            </Modal>
            <Modal
                title="Do you Want to delete this category?"
                open={showModal === '4'}
                onOk={handleOk}
                onCancel={handleCancelDelete}
                icon={<ExclamationCircleFilled />}
                width="370px"
            />
        </Card>
    )
}