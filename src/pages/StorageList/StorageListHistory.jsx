import { Card, Modal, Table } from 'antd'
import { LeftOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { reqOperationRecord, reqOperationRecordDelete, reqStorageItems } from '../../api'
import LinkButton from '../../components/LinkButton'
import { PAGE_SIZE } from '../../utils/constants'
import { convertDate, convertTime } from '../../utils/dateUtils'

export default function StorageListDetail() {
  const navigate = useNavigate()
  const [columns, setColumns] = useState([])
  const [recordList, setRecordList] = useState([])
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  const initColumns = () => {
    setColumns([
      {
        title: 'date',
        align: 'center',
        width: '8%',
        dataIndex: 'date',
        render: (date) => (
          <span>
            {convertDate(date)}&nbsp;
            {convertTime(date)}
          </span>
        )
      },
      {
        title: 'user',
        width: '6%',
        dataIndex: 'name',
      },

      {
        title: 'operation',
        align: 'center',
        dataIndex: 'operation',
        width: '3%',
      },
      {
        title: 'amount',
        align: 'center',
        dataIndex: 'amount',
        width: '3%',
        render: (amount) => (
          amount !== -1 ? amount : null
        )
      },
      {
        title: 'field',
        align: 'center',
        dataIndex: 'item_id',
        width: '3%',
        render: (item_id) => {
          const item = items ? items.find(item => item._id === item_id) : NaN;
          return item ? item.name : 'Not found';
        }
      },
      {
        title: '',
        align: 'center',
        width: '5%',
        //category is the object of each row
        render: (item) => (
          <div>
            <LinkButton style={{ margin: '0 20px' }} onClick={() => showDeleteForm(item)}>delete</LinkButton>
          </div>

        )
      }
    ])
  }

  const showDeleteForm = (item) => {
    Modal.confirm({
      title: 'Do you Want to delete this record?',
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await reqOperationRecordDelete(item._id)
        const data = res.data
        if (data.status === 0) {
          getRecords()
        }
      }
    })
  }

  const getRecords = async () => {
    setLoading(true)
    const res = await reqOperationRecord()
    setLoading(false)
    const data = res.data
    if (data.status === 0) {
      setRecordList(data.data)
    } 
  }

  const getItems = async () => {
    setLoading(true)
    const res = await reqStorageItems(0, 0)
    setLoading(false)
    const data = res.data
    if (data.status === 0) {
      setItems(data.data.list)
    } 
  }

  useEffect(() => {
    initColumns()
  }, [items])

  useEffect(() => {
    getRecords()
    getItems()
  }, [])

  const title = (
    <span>
      <LeftOutlined
        style={{
          marginRight: '8px',
          color: "#b94537"
        }}
        onClick={() => navigate('../', { replace: true })}
      />
      <span>Stock List</span>
    </span>
  )

  return (
    <Card
      title={title}
    >
      <h1 style={{ fontWeight: 600, marginBottom: '20px', fontSize: '20px' }}>Check in / out record:</h1>
      <Table
        loading={loading}
        rowKey='_id'
        dataSource={recordList}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
        }} />
    </Card>
  )
}
