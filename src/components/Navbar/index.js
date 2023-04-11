import React, { useState } from 'react'
import styled from 'styled-components'
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons'
import { Menu } from 'antd'

const NavbarContainer = styled.nav`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fefefe;
  padding: 16px 10px;
  box-sizing: border-box;
`
const LogoWrapper = styled.div`
  font-size: 36px;
  margin-right: 24px;
`

const MENU_LIST = [
  {
    label: '招生專區',
    key: 'recruitStudent',
    icon: <MailOutlined />,
  },
  {
    label: '考題專區',
    key: 'exam',
    icon: <AppstoreOutlined />,
  },
]

function Navbar(props) {
  const [currentNav, setCurrentNav] = useState('')
  const onClick = (e) => {
    console.log('click ', e)
    setCurrentNav(e.key)
  }
  return (
    <NavbarContainer>
      <LogoWrapper>考題網</LogoWrapper>
      <div>
        <Menu onClick={onClick} selectedKeys={[currentNav]} mode='horizontal' items={MENU_LIST} />
      </div>
    </NavbarContainer>
  )
}

export default Navbar
