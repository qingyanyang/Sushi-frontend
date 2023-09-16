import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { useLocation } from 'react-router-dom';
import { reqOrdersRank, reqOperationRecord, reqEmployeesRecords } from '../../api'

//0. I have to get start time and end time of the whole order-list,then divide then by 3 months, put them into selections
//1. accroding to the option, send request(reqOrdersRank)to get order sales, (3 different month)
//2. accroding to the option, send request to (history) match (operation:add storage) to get list: traverse to get total: amount * field(have to search its price)'price,(3 different month)
//3. accroding to the option,send request to (employee record)to get list,traverse to get working hours * roles(request to roles)'rate (3 different month)

//1. sales() 2. storage expenditure 3. salary expenditure

//get time period data from parent 
export default function MyChartComponent() {

    const location = useLocation();
    let selectedTime = location.state?.selectedTime
    selectedTime = selectedTime || ''

    const start = selectedTime.split('@@')[0]
    const end = selectedTime.split('@@')[1]
    const yearTemp = new Date(end).getFullYear()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthTemp = monthNames[(new Date(end)).getMonth()]

    const [sales, setSales] = useState(0)
    const [expenditures, setExpenditures] = useState(0)
    const [salarys, setSalarys] = useState(0)

    const [sharedIncome, setSharedIncome] = useState(0);


    const getSales = async () => {
        const res = await reqOrdersRank(start, end)
        const data = res.data
        if (data.status === 0) {
            setSales(data.total_sale)
        }
    }
    const getExpenditures = async () => {
        const res = await reqOperationRecord(start, end)
        const data = res.data
        if (data.status === 0) {
            setExpenditures(data.expenditure)
        }
    }
    const getSalarys = async () => {
        const res = await reqEmployeesRecords('*', '*', start, end)
        const data = res.data
        if (data.status === 0) {
            setSalarys(data.salary)
        }
    }
    const getOption = () => {
        return {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['sales', 'stocking', 'employees\'salary', 'net income']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: [`${yearTemp} ${monthTemp}`]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'sales',
                    type: 'bar',
                    data: [sales],
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            return '$' + params.value;
                        }
                    }
                },
                {
                    name: 'stocking',
                    type: 'bar',
                    data: [expenditures],
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            return '$' + params.value;
                        }
                    }
                },
                {
                    name: 'employees\'salary',
                    type: 'bar',
                    data: [salarys],
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            return '$' + params.value;
                        }
                    }
                },
                {
                    name: 'net income',
                    type: 'bar',
                    data: [sharedIncome],
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            return '$' + params.value;
                        }
                    }
                }
            ]
        };
    };
    useEffect(() => {
        setSharedIncome(sales - expenditures - salarys);
    }, [sales, expenditures, salarys]);
    useEffect(() => {
        getSales()
        getExpenditures()
        getSalarys()
    }, [selectedTime]);
    return (
        <div>
            <ReactEcharts option={getOption()} style={{ height: '350px', width: '100%' }} className='react_for_echarts' />
        </div>
    );
};

