import Layout from "../pages/Layout"
import Login from "../pages/Login"
import Order from "../pages/Order"
import OrderListHome from "../pages/Order/OrderListHome"
import OrderListRank from "../pages/Order/OrderListRank"
//import Menus from "../pages/Menus"
import MenuList from "../pages/MenuList"
import MenuListHome from '../pages/MenuList/MenuListHome'
import MenuListDetail from "../pages/MenuList/MenuListDetail"
import MenuListAddUpdate from "../pages/MenuList/MenuListAddUpdate"
import MenuCategory from "../pages/MenuCategory"
//import Storage from "../pages/Storage"
import StorageCategory from "../pages/StorageCategory"
import StorageList from "../pages/StorageList"
import StorageListHome from '../pages/StorageList/StorageListHome'
import StorageListDetail from '../pages/StorageList/StorageListDetail'
import StorageListAddUpdate from '../pages/StorageList/StorageListAddUpdate'
import StorageListHistory from '../pages/StorageList/StorageListHistory'
//import Employees from "../pages/Employees"
import EmployeesList from "../pages/EmployeesList"
import EmployeesTimeRecords from "../pages/EmployeesTimeRecords"
import EmployeesRole from "../pages/EmployeesRole"
import Finance from "../pages/Finance"
import ChartCompare from '../pages/Finance/ChartCompare'
import { Navigate } from "react-router-dom"

const route = [
    {
        path: 'login',
        element: <Login />
    },
    {
        path: '/layout',
        element: <Layout />,
        children: [
            {
                index: true,//default
                element: <Navigate to="/layout/order" replace />,
            },
            {
                path: 'order',
                element: <Order />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/layout/order/home" replace />,
                    },
                    {
                        path: 'home',
                        element: <OrderListHome />
                    },
                    {
                        path: 'sale_rank',
                        element: <OrderListRank />
                    },
                    {
                        path: "*",
                        element: <Navigate to="/layout/order" replace />,
                    }
                ]
            },
            {
                path: 'menu_list',
                element: <MenuList />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/layout/menu_list/home" replace />,
                    },
                    {
                        path: 'home',
                        element: <MenuListHome />
                    },
                    {
                        path: 'detail',
                        element: <MenuListDetail />
                    },
                    {
                        path: 'add_update',
                        element: <MenuListAddUpdate />
                    },
                    {
                        path: "*",
                        element: <Navigate to="/layout/menu_list" replace />,
                    }
                ]
            },
            {
                path: 'menu_category',
                element: <MenuCategory />
            },
            {
                path: 'storage_list',
                element: <StorageList />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/layout/storage_list/home" replace />,
                    },
                    {
                        path: 'home',
                        element: <StorageListHome />
                    },
                    {
                        path: 'detail',
                        element: <StorageListDetail />
                    },
                    {
                        path: 'add_update',
                        element: <StorageListAddUpdate />
                    },
                    {
                        path: 'history',
                        element: <StorageListHistory />
                    },
                    {
                        path: "*",
                        element: <Navigate to="/layout/storage_list" replace />,
                    }
                ]
            },
            {
                path: 'storage_category',
                element: <StorageCategory />
            },
            {
                path: 'employees_list',
                element: <EmployeesList />
            },
            {
                path: 'employees_time_records',
                element: <EmployeesTimeRecords />
            },
            {
                path: 'employees_role',
                element: <EmployeesRole />
            },
            {
                path: 'finance',
                element: <Finance />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/layout/finance/compare" replace />,
                    },
                    {
                        path: 'compare',
                        element: <ChartCompare />
                    },
                    {
                        path: "*",
                        element: <Navigate to="/layout/finance" replace />,
                    }
                ]
            },
            {
                path: "*",
                element: <Navigate to="/layout" replace />,
            }
        ]
    },
    {
        path: '/',
        element: <Navigate to='/login' />
    }
]
export default route
