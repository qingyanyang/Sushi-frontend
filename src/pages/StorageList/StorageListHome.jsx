import React, { useEffect, useState, Suspense } from 'react'
import { PlusOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import { useNavigate, Outlet } from 'react-router-dom';

// Lazy load Ant Design components
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Row from 'antd/es/row';
import Col from 'antd/es/col';

import { reqStorageItems, reqStorageCategory, reqSearchStorageItems, reqUpdateStorageItemStorage, reqStorageItemsSort, reqOperationRecordAdd } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import { convertDate, convertTime } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

// Lazy load custom components
const LinkButton = React.lazy(() => import('../../components/LinkButton'));

let amountFinal = 0
let pageNumGlobal = 1
export default function StorageListHome() {
    const [form] = Form.useForm();
    const [columns, setColumns] = useState([])
    const [itemList, setItemList] = useState([])
    const [total, setTotal] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchType, setSearchType] = useState('name')
    const [searchName, setSearchName] = useState('')
    const [forSearch, setForSearch] = useState(false)
    const [pageNum, setPageNum] = useState(pageNumGlobal)
    const [categorys, setCategorys] = useState([])
    const [showModal, setModalshow] = useState('0')
    const [recordSelect, setRecordSelect] = useState({})
    const [isAdd, setIsAdd] = useState(null)
    const [isAsend, setIsAsend] = useState(null)
    const [operation, setOperation] = useState('')

    const navigate = useNavigate()

    const initColumns = () => {
        setColumns([
            {
                title: 'Stock name',
                width: '6%',
                dataIndex: 'name',
            },
            {
                title: 'Category',
                align: 'center',
                width: '6%',
                dataIndex: 'category_id',
                render: (category_id) => {
                    const category = categorys.find(category => category._id === category_id);
                    return category ? category.name : 'Not found';
                }
            },
            {
                title: 'Create time',
                align: 'center',
                width: '8%',
                dataIndex: 'create_time',
                render: (date) => (
                    <span>
                        {convertDate(date)}&nbsp;
                        {convertTime(date)}
                    </span>
                )
            },
            {
                title: (
                    <div>
                        Stock
                        <ArrowUpOutlined onClick={sortAsending} style={{ marginLeft: '20px', color: '#b94537' }} />
                        <ArrowDownOutlined onClick={sortDesending} style={{ marginLeft: '5px', color: '#b94537' }} />
                    </div>
                ),
                align: 'center',
                dataIndex: 'storage',
                width: '13%',
                render: (amount, record) => (
                    <Row style={{ float: 'right' }}>
                        <Col style={{ fontSize: '13px', marginRight: '25px', lineHeight: '25px', color: `${amount < 5 ? 'red' : 'gray'}` }}>surplus: {amount}</Col>
                        <Col>
                            <Button
                                type='primary'
                                onClick={() => { showAddStorage(amount, record) }}
                                style={{ backgroundColor: '#CE7675', height: '25px', width: '40px', fontSize: '11px', marginRight: '5px' }}
                            >
                                <PlusOutlined />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type='primary'
                                disabled={amount <= 0 ? true : false}
                                onClick={() => { showMinStorage(amount, record) }}
                                style={{ backgroundColor: `${amount <= 0 ? 'lightGrey' : '#E1DCCF'}`, height: '25px', width: '40px', fontSize: '11px', marginRight: '5px' }}
                            >
                                <MinusOutlined />
                            </Button>
                        </Col>
                    </Row>

                )
            },
            {
                title: 'Buyer',
                align: 'center',
                dataIndex: 'buyer',
                width: '3%',
            },
            {
                title: 'Price',
                align: 'center',
                dataIndex: 'price',
                width: '3%',
                render: (price) => '$' + price
            },
            {
                title: 'Operation',
                align: 'center',
                width: '5%',
                //category is the object of each row
                render: (item) => (
                    <div>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showDetail(item)}>detail</LinkButton>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showUpdateDetail(item)}>update</LinkButton>
                    </div>

                )
            }
        ])
    }
    
    const sortAsending = async () => {
        setIsAsend(true)
    }

    const sortDesending = () => {
        setIsAsend(false)
    }
    const showAddStorage = (amount, record) => {
        setOperation('add storage')
        setIsAdd(true)
        setRecordSelect(record)
        setModalshow('1')

    }
    const showMinStorage = (amount, record) => {
        setOperation('minus storage')
        setIsAdd(false)
        setRecordSelect(record)
        setModalshow('1')
    }

    //onOK
    const updateStorage = async () => {
        //get input value from form
        let { storage_update } = form.getFieldValue()
        amountFinal = +storage_update
        let storage_update_temp = +storage_update
        
        //get the item id
        const itemId = recordSelect._id
        //check is add or min
        if (!isAdd) {
            storage_update_temp = -storage_update_temp
        }

        let amount = recordSelect.storage + storage_update_temp
        amount = amount > 0 ? amount : 0
        //send update request
        const res = await reqUpdateStorageItemStorage(itemId, amount)
        const data = res.data
        if (data.status === 0) {
            getItems(pageNum)
            addRecord()
            message.success(`${isAdd ? 'add' : 'reduce'} storage successfully!`)
        } else {
            message.error(`${isAdd ? 'add' : 'reduce'} storage failed!`)
        }
        //off the modal
        setModalshow('0')
        form.resetFields()
    }

    //oncancel
    const handleCancel = () => {
        setModalshow('0')
        form.resetFields()
    }
    const showHistory = () => {
        navigate('/layout/storage_list/history/', { replace: true })
    }
    const showAddItem = () => {
        setOperation('addItem')
        navigate('/layout/storage_list/add_update/', { replace: true })
    }
    const showUpdateDetail = (item) => {
        setOperation('update')
        navigate('/layout/storage_list/add_update/', { replace: true, state: { item } })
    }
    const showDetail = (item) => {
        navigate('/layout/storage_list/detail/', { replace: true, state: { item, categorys } })
    }
    const getCategorys = async () => {
        const res = await reqStorageCategory()
        const data = res.data
        if (data.status === 0) {
            setCategorys(data.data)
        } 
    }
    //send request
    const getItems = async (pageNumber, isAsend) => {
        pageNumGlobal = pageNumber;
        setLoading(true);
        let result = {};
        if (!forSearch) {
            if (isAsend != null) {
                result = await reqStorageItemsSort(pageNumber, PAGE_SIZE, isAsend)
            } else {
                result = await reqStorageItems(pageNumber, PAGE_SIZE);
            }

        } else {
            result = await reqSearchStorageItems({
                pageNumber,
                pageSize: PAGE_SIZE,
                searchName,
                searchType,
                isAsend,
            });
        }
        setLoading(false);
        const data = result.data;
        if (data.status === 0) {
            const { list, total } = data.data;
            setItemList(list);
            setTotal(total);
        }
    };

    const addRecord = async () => {
       await reqOperationRecordAdd(operation, storageUtils.getUser().username, Date.now(), amountFinal, recordSelect._id)
    }

    //get onchange value under contral
    const handleSelectChange = (value) => {
        setSearchType(value)
    }

    const handleInputChange = (e) => {
        setSearchName(e.target.value)
    }

    //only render once
    useEffect(() => {
        getCategorys()
    }, [])

    useEffect(() => {
        initColumns()
    }, [categorys])

    useEffect(() => {
        getItems(pageNum, isAsend)
    }, [pageNum, forSearch, isAsend])

    const title = (
        <span>
            <Select
                style={{ marginRight: '10px', width: '150px' }}
                value={searchType}
                onChange={handleSelectChange}
            >
                <Select.Option key='0' value='name'>on name</Select.Option>
                <Select.Option key='1' value='buyer'>on buyer</Select.Option>
            </Select>
            <Input placeholder="search all"
                style={{ marginRight: '10px', width: '150px' }}
                onChange={handleInputChange}
            />
            <Button type="primary"
                style={{ width: '120px' }}
                onClick={() => {
                    if (forSearch) {
                        getItems(1)
                    } else {
                        setForSearch(true)
                    }
                }}
            >
                <SearchOutlined />
                search
            </Button>
        </span>
    )
    const extra = (
        <span>
            <LinkButton style={{ margin: '0 20px' }} onClick={() => showHistory()}>check in / out record</LinkButton>
            <Button type='primary' onClick={showAddItem}>
                <PlusOutlined />
                add
            </Button>
        </span>

    )
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Card
            title={title}
            extra={extra}
            style={{
                width: '100%'
            }}
        >
            <Table
                loading={loading}
                rowKey='_id'
                dataSource={itemList}
                columns={columns}
                pagination={{
                    total: total,
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    onChange: page => setPageNum(page)
                }} />
            <Modal title="Please enter the amount:"
                open={showModal === '1'}
                onOk={updateStorage}
                onCancel={handleCancel}
                width='350px'
            >
                <Form form={form}
                    initialValues={{
                        remember: true,
                    }}
                >
                    <Form.Item
                        name="storage_update"
                        rules={[
                            {
                                pattern: /^[0-9]+$/,
                                message: 'Please enter a valid number',
                            },
                            {
                                min: 0,
                                max: 5,
                                message: "The length must greater than 0 and less than 5"
                            }
                        ]}
                    >
                        <Input
                            style={{
                                minWidth: 300,
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Outlet />
        </Card>
        </Suspense>
    )
}