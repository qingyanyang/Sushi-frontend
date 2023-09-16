import { CaretRightOutlined, AppstoreAddOutlined, MoneyCollectOutlined, UnorderedListOutlined, UserOutlined, MenuUnfoldOutlined, TeamOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
const menuList = [
    {
        label: "Order list",
        key: "/order",
        icon: <NavLink to="order"><UnorderedListOutlined /></NavLink>
    },
    {
        label: "Menu",
        key: "/menu",
        icon: <MenuUnfoldOutlined />,
        children: [
            {
                label: "Menu list",
                key: "/menu_list",
                icon: <NavLink to="menu_list"><CaretRightOutlined /></NavLink>
            },
            {
                label: "Menu category",
                key: "/menu_category",
                icon: <NavLink to="menu_category"><CaretRightOutlined /></NavLink >
            }
        ]
    },
    {
        label: "Storage",
        key: "/storage",
        icon: <AppstoreAddOutlined />,
        children: [
            {
                label: "Storage list",
                key: "/storage_list",
                icon: <NavLink to="storage_list"><CaretRightOutlined /></NavLink >
            },
            {
                label: "Storage category",
                key: "/storage_category",
                icon: <NavLink to="storage_category"><CaretRightOutlined /></NavLink >
            }
        ]
    },
    {
        label: "Employees",
        key: "/employees",
        icon: <TeamOutlined />,
        children: [
            {
                label: "Employee list",
                key: "/employees_list",
                icon: <NavLink to="employees_list"><CaretRightOutlined /></NavLink >
            },
            {
                label: "Shifts record",
                key: "/employees_time_records",
                icon: <NavLink to="employees_time_records"><CaretRightOutlined /></NavLink >
            },
            {
                label: "Role authority",
                key: "/employees_role",
                icon: <NavLink to="employees_role"><CaretRightOutlined /></NavLink >,
            },
        ]
    },
    {
        label: "Finance",
        key: "/finance",
        icon: <NavLink to="finance"><MoneyCollectOutlined /></NavLink >,
    }
]
export default menuList
