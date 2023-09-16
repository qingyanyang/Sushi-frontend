import { useState, useEffect } from 'react'
import { reqOrdersRank } from '../../api'
import { useNavigate, Outlet } from 'react-router-dom';
import { Card, Select } from 'antd';

//do 0 to get time periods, then pass it to compare component

export default function Index() {
    const navigate = useNavigate()

    const [timeArr, setTimeArr] = useState([])
    const [selectedTime, setSelectedTime] = useState('');
    const [isLoading, setIsLoading] = useState(true)


    function divideIntoMonths(start, end) {
        // Parse the input dates
        let startDate = new Date(start);
        let endDate = new Date(end);

        let datePairs = [];

        while (startDate <= endDate) {
            // Calculate the end of the month
            let endOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // last day of the month

            // If the end of the month is after the end date, use the end date instead
            if (endOfMonth > endDate) {
                endOfMonth = endDate;
            }

            // Add the date pair to the array
            datePairs.push({
                start: new Date(startDate).toISOString(),
                end: new Date(endOfMonth).toISOString()
            });

            // Set the start of the next period to be the first day of the next month
            startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

            // Correct the time to match the original start time
            startDate.setHours(endOfMonth.getHours(), endOfMonth.getMinutes(), endOfMonth.getSeconds(), endOfMonth.getMilliseconds());
        }

        return datePairs;
    }

    const handleSelectChange = (value) => {
        setSelectedTime(value);
    }

    const getPeriod = async () => {
        const res = await reqOrdersRank()
        const data = res.data
        if (data.status === 0) {
            //get start time and end time
            const { start, end } = data
            const timeArrTemp = divideIntoMonths(start, end)
            //store in TimeArr
            setTimeArr(timeArrTemp)
            setSelectedTime(`${timeArrTemp[timeArrTemp.length - 1].start}@@${timeArrTemp[timeArrTemp.length - 1].end}`)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getPeriod()
    }, [])

    useEffect(() => {
        navigate('/layout/finance/compare', { state: { selectedTime } })
    }, [selectedTime])
    
    return (
        <Card title='Income and Expenditure'>
            {!isLoading && timeArr && timeArr.length > 0 ? (
                <>
                    <Select
                        style={{ margin: '30px 0 40px 23px', width: '300px' }}
                        value={selectedTime}
                        onChange={handleSelectChange}
                    >
                        {timeArr.map((period, index) => {
                            const { start, end } = period;
                            let startDate = new Date(start);

                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                            const startYear = startDate.getFullYear();
                            const startMonth = monthNames[startDate.getMonth()];

                            return (
                                <Select.Option key={index} value={`${start}@@${end}`}>{startYear}-{startMonth}</Select.Option>
                            );
                        })}
                    </Select>
                    <Outlet />
                </>
            ) : (
                <div>No data available.</div>
            )}
        </Card>

    )
}
