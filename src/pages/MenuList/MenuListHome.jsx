import React, { useEffect, useState } from 'react'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate, Outlet } from 'react-router-dom';
import { Card, Table, Button, Select, message, Input, Tooltip } from 'antd'
import LinkButton from '../../components/LinkButton'
import { reqItems, reqSearchItems, reqUpdateItemsStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

let pageNumGlobal = 1
export default function MenuListHome() {
    const [columns, setColumns] = useState([])
    const [itemList, setItemList] = useState([])
    const [total, setTotal] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchType, setSearchType] = useState('name')
    const [searchName, setSearchName] = useState('')
    const [forSearch, setForSearch] = useState(false)
    const [pageNum, setPageNum] = useState(pageNumGlobal)

    const navigate = useNavigate()

    const initColumns = () => {
        setColumns([
            {
                title: 'Dishes',
                width: '20%',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                width: '40%',
                dataIndex: 'desc',
                render: (desc) => (
                    <Tooltip
                        title={desc}
                        color='white'
                        overlayInnerStyle={{ color: 'black' }}
                    >
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '350px' }}>
                            {desc}
                        </div>
                    </Tooltip>
                )
            },
            {
                title: 'Price',
                align: 'center',
                dataIndex: 'price',
                width: '8%',
                render: (price) => '$' + price
            },
            {
                title: 'Status',
                align: 'center',
                render: (item) => {
                    const { _id, status } = item
                    return (
                        <div>
                            <Button
                                type='primary'
                                onClick={() => { updateItemsStatus(_id, status === 1 ? 0 : 1) }}
                                style={{ backgroundColor: (status === 1 ? 'gray' : '#1890ff') }}
                            >
                                {status === 1 ? 'off shelves' : 'on shelves'}
                            </Button>
                            <div style={{ textAlign: 'center', color: (status === 1 ? 'green' : 'red') }}>{status === 1 ? 'onSale' : 'soldOut'}</div>
                        </div>
                    )
                }
            },
            {
                title: 'Operations',
                align: 'center',
                width: '10%',
                //category is the object of each row
                render: (category) => (
                    <div>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showDetail(category)}>Detail</LinkButton>
                        <LinkButton style={{ margin: '0 20px' }} onClick={() => showUpdateDetail(category)}>Update</LinkButton>
                    </div>

                )
            }
        ])
    }

    const updateItemsStatus = async (_id, status) => {
        const res = await reqUpdateItemsStatus(_id, status)
        const data = res.data
        if (data.status === 0) {
            message.success('operation successfully!')
            getItems(pageNumGlobal)
        }
    }

    const showAddCategory = () => {
        navigate('/layout/menu_list/add_update/', { replace: true })
    }

    const showUpdateDetail = (category) => {
        navigate('/layout/menu_list/add_update/', { replace: true, state: { category } })
    }

    const showDetail = (category) => {
        navigate('/layout/menu_list/detail/', { replace: true, state: { category } })
    }

    //send request
    const getItems = async (pageNumber) => {
        pageNumGlobal = pageNumber
        setLoading(true)
        let result = {}
        if (!forSearch) {
            result = await reqItems(pageNumber, PAGE_SIZE)
        } else {
            result = await reqSearchItems({ searchName, searchType })
        }
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            const { list, total } = data.data
            setItemList(list)
            setTotal(total)
        }
    }

    //get onchange value under contral
    const handleSelectChange = (value) => {
        setSearchType(value)
    }

    const handleInputChange = (e) => {
        setSearchName(e.target.value)
    }

    useEffect(() => {
        initColumns()
    }, [])
    
    useEffect(() => {
        getItems(pageNum)
    }, [pageNum, forSearch])

    const title = (
        <span>
            <Select
                style={{ marginRight: '10px', width: '150px' }}
                value={searchType}
                onChange={handleSelectChange}
            >
                <Select.Option key='0' value='name'> on name</Select.Option>
                <Select.Option key='1' value='desc'>on desc</Select.Option>
            </Select>
            <Input placeholder="key words"
                style={{ marginRight: '10px', width: '150px' }}
                onChange={handleInputChange}
            />
            <Button type="primary"
                style={{ width: '120px' }}
                onClick={() => {
                    if (forSearch) {
                        getItems(1)
                        pageNumGlobal = 1
                    } else {
                        setForSearch(true)
                        pageNumGlobal = 1
                    }
                }}
            >
                <SearchOutlined />
                search
            </Button>
        </span>
    )
    const extra = (

        <Button type='primary' onClick={showAddCategory}>
            <PlusOutlined />
            add
        </Button>
    )
    return (
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
                    current: pageNumGlobal,
                    onChange: page => setPageNum(page)
                }} />
            <Outlet />
        </Card>
    )
}