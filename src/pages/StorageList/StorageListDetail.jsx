import { Card, List, Typography } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react'

export default function StorageListDetail() {
    const navigate = useNavigate()
    const itemSelect = useLocation().state?.item
    const categorysSelect = useLocation().state?.categorys

    const maps = {
        "name": "name",
        'stock': 'storage',
        'price': "price",
        'category': '',
        'supplier name': 'supplier',
        'supplier phone number': 'supplier_phone',
        'buyer name': 'buyer',
        'images': "imgs",
    }

    const keys = Object.keys(maps);

    const itemPic = (
        itemSelect.imgs.map((img, index) => {
            return <span key={index}>
                <img
                    src={'http://127.0.0.1:3000/images/' + img}
                    alt={img}
                    style={{
                        width: '250px'
                    }}
                >
                </img>
            </span>
        })
    )
    const itemBelong = (
        <span>
            {categorysSelect.find((category => category._id === itemSelect.category_id)).name}
        </span>
    )
    const title = (
        <span>
            <LeftOutlined
                style={{
                    marginRight: '8px',
                    color: "#b94537"
                }}
                onClick={() => navigate('../', { replace: true })}
            />
            <span>Stock Detail</span>
        </span>
    )

    return (
        <Card
            title={title}
        >
            <List
                style={{ marginTop: '-20px', marginLeft: '24px' }}
                dataSource={keys}
                renderItem={(key) => (
                    <List.Item style={{ justifyContent: 'flex-start' }}>
                        <Typography.Text style={{
                            fontWeight: 'bold',
                            fontSize: '15px',
                            marginRight: '10px'
                        }}>
                            {key + ':'}
                        </Typography.Text>
                        {
                            key !== 'images' ?
                                key !== 'category' ?
                                    key !== 'price' ?
                                        itemSelect[maps[key]]
                                        : `$${itemSelect[maps[key]]}`
                                    : itemBelong
                                : itemPic
                        }
                    </List.Item>
                )}
            />
        </Card>
    )
}
