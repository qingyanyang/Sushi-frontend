import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons'
import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Modal, Input } from 'antd'
import { convertDate, convertTime } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/LinkButton'
import { reqRoles, reqDeleteEmployeesRecord, reqEmployeesRecords } from '../../api'

export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [employeeSelected, setEmployeeSelected] = useState({});
    const [columns, setColumns] = useState([])
    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [searchType, setSearchType] = useState('*')
    const [searchName, setSearchName] = useState('*')

    const [selectTrigger, setSelectTrigger] = useState(true)
    const initColumns = () => {
        setColumns([
            {
                title: 'Date',
                dataIndex: 'date',
                render: (date) => (
                    convertDate(date)
                )
            },
            {
                title: 'Employee name',
                dataIndex: 'name',
            },
            {
                title: 'Role',
                dataIndex: 'role_id',
                render: (role_id) => {
                    const role = roles.find(role => role._id === role_id);
                    return role ? role.name : 'Not found';
                }
            },
            {
                title: 'Check in',
                dataIndex: 'on_time',
                render: (time) => (
                    convertTime(time)
                )
            },
            {
                title: 'Check out',
                dataIndex: 'off_time',
                render: (time) => (
                    convertTime(time)
                )
            },
            {
                title: 'Working hours',
                align: 'center',
                render: (employeeSelected) => {
                    const offTime = new Date(employeeSelected.off_time);
                    const onTime = new Date(employeeSelected.on_time);
                    const workingHours = Math.round((offTime - onTime) / 1000 / 60 / 60);
                    return <span>{workingHours}hrs</span>
                }
            },
            {
                title: 'Operation',
                align: 'center',
                width: '12%',
                //category is the object of each row
                render: (employeeSelected) => (
                    <span >
                        <LinkButton style={{ margin: '0 5px' }} onClick={() => handleDeleteEmployee(employeeSelected)}>delete</LinkButton>
                    </span>
                )
            }
        ])
    }

    const handleOk = async () =>{
        setIsModalVisible(false)
        const res = await reqDeleteEmployeesRecord(employeeSelected._id)
        const data = res.data
        if (data.status === 0) {
            getEmployeeRecords()
            message.success('delete record successfully!')
        } else {
            message.error('delete record failed!')
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleDeleteEmployee = (employeeSelected) => {
        setIsModalVisible(true)
        setEmployeeSelected(employeeSelected)
    }

    const handleInputChange = (e) => {
        setSearchType('name')
        setSearchName(e.target.value)
    }

    const getEmployeeRecords = async () => {
        setLoading(true)
        const result = await reqEmployeesRecords(searchType, searchName)
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            //get data arr
            setEmployees(data.data)
        } else {
            message.error('fail to get category list!')
        }
    }
    const getRoles = async () => {
        setLoading(true)
        const result = await reqRoles()
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            //get data arr
            setRoles(data.data)
        } else {
            message.error('fail to get list')
        }
    }
    //only once
    useEffect(() => {
        getRoles()
    }, [])

    useEffect(() => {
        initColumns()
    }, [roles])

    useEffect(() => {
        getEmployeeRecords()
    }, [selectTrigger])

    const title = (
        <span>

            <Input placeholder="search employee name"
                style={{ marginRight: '10px', width: '200px' }}
                onChange={handleInputChange}
            />
            <Button type="primary"
                style={{ width: '120px' }}
                onClick={() => {
                    selectTrigger ?
                        setSelectTrigger(false)
                        : setSelectTrigger(true)
                }}
            >
                <SearchOutlined />
                search
            </Button>
        </span>
    )

    return (
        <>
            <Card
                title={title}
                style={{
                    width: '100%'
                }}
            >
                <Table
                    rowKey='_id'
                    loading={loading}
                    dataSource={employees}
                    columns={columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }} />
            </Card>
            <Modal
                title="Do you Want to delete this employee?"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                icon={<ExclamationCircleFilled />}
                width="370px"
            />
        </>
    )
}
