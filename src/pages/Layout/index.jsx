import React, { useState, useEffect, Suspense } from 'react';

import Layout from 'antd/es/layout';
import Breadcrumb from 'antd/es/breadcrumb';
import Menu from 'antd/es/menu';
import theme from 'antd/es/theme';

import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import './Layout.css';

const HeaderContent = React.lazy(() => import('../../components/HeaderContent'));

const { Header, Content, Footer, Sider } = Layout;

export default function LayoutPage() {
  const location = useLocation();
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //get login user's role, then give him/her coresponding authority
  const user = storageUtils.getUser()
  const { role } = user

  //function to get new menulist for this role
  //role has menus, which includes the menus it can access, but menus is a array of keys
  // the keys are corresponded to the key in menulist
  const menuItems = menuList.filter(menuItem => {
    // Check if the current menu item is in the role array
    const isMenuItemAllowed = role&&role.includes(menuItem.key);
    // If the menu item has children, filter them based on the role array
    if (menuItem.children) {
      menuItem.children = menuItem.children.filter(child => role &&role.includes(child.key));
    }
    return isMenuItemAllowed || (menuItem.children && menuItem.children.length > 0);
  });

  // function to get titles(first class and subclass)
  const getTitle = () => {
    //get title from browser url->display label
    const { pathname } = location;
    let names = pathname.split('/')
    let titles = []
    menuList.forEach(item => {
      if (item.key.substring(1) === names[2]) {
        titles[0] = item.label
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key.substring(1) === names[2])
        if (cItem) {
          titles[0] = item.label
          //its child
          titles[1] = cItem.label
        }
      }
    })
    return titles
  }

  //if no user login, navigate to login page
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Layout  style={{ minHeight: '100vh' }}>
      <Sider 
        style={{
          background: '#1d1d1c',
        }}
        // collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}>
        <div className='title'></div>
        <Menu theme="dark" defaultSelectedKeys={['order']} mode="inline" items={menuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <HeaderContent />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '8px 0' }}
            separator=''
            items={[
              {
                title: getTitle()[0],
              },
              {
                title: getTitle()[1] ? '\xa0/\xa0' : ''
              },
              {
                title: getTitle()[1]
              }
            ]}
          />

          <div
            style={{
              padding: 24,
              minHeight: 360,
              backgroundColor: "#ffffff",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
    </Suspense>
  );
};
