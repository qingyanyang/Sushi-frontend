import { PlusOutlined, RightOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Modal} from 'antd'

import LinkButton from '../../components/LinkButton'
import { reqCategorys, reqAddCategory, reqUpdateCategory, reqDeleteCategory } from '../../api'
import CategoryForm from './CategoryForm'
import CategoryName from './CategoryName'

let columns = []
let selectCategory = {}
let selectParentId = ''

export default function Index() {
    const [loading, setLoading] = useState(false)
    const [categorys, setCategorys] = useState([])
    const [subCategorys, setSubCategorys] = useState([])
    const [parentId, setParentId] = useState('0')
    const [parentName, setParentName] = useState('')
    const [showModal, setModalshow]=useState('0')//0: all close 1:1 open 2:2open
    const [form, setForm] = useState({})

    const initColumns = () => {
        columns = [
            {
                title: 'Category name',
                dataIndex: 'name',
            },
            {
                title: 'Operation',
                width: '50%',
                align:"center",
                //category is the object of each row
                render: (category) => (
                    <span style={{ marginLeft: '-20px' }}>
                        <LinkButton style={{ margin: '0 20px' }} onClick={()=>showUpdateCategory(category)}>update name</LinkButton>
                        {
                            parentId==='0'?
                            <LinkButton onClick={() => showSubCategorys(category)}>subcategory</LinkButton>
                            :null
                        }
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showDeleteCategory(category)}>delete</LinkButton>
                    </span>
                )
            }
        ]
    }
    //show modal
    const showAddCategory = () => {
        setModalshow('1')
    }
    const showUpdateCategory=(category)=>{
        selectCategory = category
        setModalshow('2')
    }

    const handleOk = () => {
        deleteCategory()
        setModalshow('0')
    }

    const showDeleteCategory = (category)=>{
        selectCategory = category
        setModalshow('4')
    }

    //onOK method
    const addCategory = async ()=>{
        let receivedData = form.getFieldsValue()
        let input = receivedData.input || '';
        setModalshow('0')
        const categoryName = input
        form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        const data = result.data
        if (data.status === 0) {
            getCategory()
            message.success('add category successfully!')
        }else{
            message.error('add category failed!')
        }
    }

    const handleCancelDelete = () => {
        setModalshow('0')
    }

    const updateCategory = async () => {
        let receivedData = form.getFieldsValue()
        let input = receivedData.input || '';
        setModalshow('0')
        const categoryId = selectCategory._id
        const categoryName = input
        form.resetFields()
        const result = await reqUpdateCategory(categoryId, categoryName)
        const data = result.data
        if (data.status===0){
            getCategory()
            message.success('update category successfully!')
        }else{
            message.error('update category failed!')
        }
    }

    const deleteCategory = async ()=>{
        const categoryId = selectCategory._id
        const result = await reqDeleteCategory(categoryId)
        const data = result.data
        if (data.status === 0) {
            message.success('delete category successfully!')
            getCategory()
        }else{
            message.error('delete category failed!')
        }
    }

    //onCancel method
    const handleCancel = () => {
        form.resetFields()
        setModalshow('0');
    }

    const getForm = (form) => {
        setForm(form);
    };

    const showSubCategorys=(category)=>{
        //update state
        setParentId(category._id)
        setParentName(category.name)
    }

    const showCategorys = () => {
        setParentId('0');
        setParentName('');
        setSubCategorys([]);
    };

    const getCategory = async () => {
        setLoading(true)
        const result = await reqCategorys(parentId)
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            //get data arr
            const cate = data.data
            if (parentId ==='0'){
                //update first class list
                setCategorys(cate)
            }else{
                //update second class list
                setSubCategorys(cate)
            }
        } else {
            message.error('fail to get category list!')
        }
    }

    useEffect(() => {
        initColumns()
    }, [parentId])

    useEffect(() => {
        getCategory()
    }, [parentId])

    const title = parentId === '0' ? 'Category' : (
        <span>
            <LinkButton onClick={showCategorys} style={{ fontSize: '16px', fontWeight: 'bold' }}>Category</LinkButton>
            <RightOutlined style={{ marginRight: 3 }} />
            <span>{parentName}</span>
        </span>
    )
    const extra = (
        <Button type='primary' onClick={showAddCategory}>
            <PlusOutlined />
            add
        </Button>
    )
    selectParentId=parentId
    return (
        <Card
            title={title}
            extra={extra}
            style={{
                width: '100%'
            }}
        >
            <Table
                rowKey='_id'
                loading={loading}
                dataSource={parentId === '0' ? categorys:subCategorys}
                columns={columns}
                pagination={{defaultPageSize:5, showQuickJumper:true}} />
            <Modal title="add category" 
                open={showModal === '1'} 
                onOk={addCategory} 
                onCancel={handleCancel}>
                <CategoryForm 
                    categorys={categorys}
                    parentId={selectParentId}
                    getForm={getForm}
                    />
            </Modal>
            <Modal title="update category name"
                open={showModal ==='2'}
                onOk={updateCategory}
                onCancel={handleCancel}>
                <CategoryName 
                selectCategory={selectCategory.name} 
                getForm={getForm}
                />
            </Modal>
            <Modal
                title="Do you want to delete this category?"
                open={showModal === '4'}
                onOk={handleOk}
                onCancel={handleCancelDelete}
                icon={<ExclamationCircleFilled />}
                width="370px"
            />
        </Card>
    )
}