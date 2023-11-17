import React, { useEffect, useRef } from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import './EmployeesList.css'

export default function AddUpdateForm({ getForm, roles, employeeSelected }) {
    const [form] = Form.useForm();
    const formRef = useRef(form);

    const employee = employeeSelected || {}
    const { username, phone, email, role_id } = employee

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

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Select.Option value="61">+61</Select.Option>
            </Select>
        </Form.Item>
    );

    useEffect(() => {
        getForm(formRef.current);
    }, [getForm]);

    return (
        <Form
            form={form}
            {...formItemLayout}
            name="register"
            scrollToFirstError
            style={{
                margin: '40px',
                maxWidth: '500px',
            }}
            initialValues={{
                prefix: "61",
            }}
        >
            <Form.Item
                initialValue={username}
                name="username"
                label="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input item name!',
                        whitespace: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                initialValue={email}
                name="email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                initialValue={phone}
                name="phone"
                label="Phone Number"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                    {
                        pattern: /^[0-9]*$/,
                        message: 'Please enter only numbers',
                    }
                ]}
            >
                <Input
                    inputMode="numeric"
                    addonBefore={prefixSelector}
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item>
            <Form.Item
                initialValue={employee.role_id ? roles.find(role => role._id === role_id).name : ''}
                name="role_id"
                label="position"
                rules={[
                    {
                        required: true,
                        message: 'Please select role!',
                    },
                ]}
            >
                <Select placeholder="select your role">
                    {roles.map(role => (
                        <Select.Option value={role._id} key={role._id}>
                            {role.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    )
}
