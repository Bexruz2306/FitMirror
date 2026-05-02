import React, { useEffect } from 'react'
import './navbar.scss'
import star from '../../images/icons/navbar.svg'
import { Container, Nav, NavDropdown,Navbar as NavbarBoot } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store.js'
import { useTranslation } from 'react-i18next'
import { Dropdown, message, Space } from 'antd'
import {  SettingOutlined } from '@ant-design/icons'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { IoExitOutline } from 'react-icons/io5'
import Cookies from 'js-cookie'
export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const location=useLocation();
  const { t, i18n } = useTranslation();
  const {user}=useStore();
  const navigate=useNavigate();
  const {clearUser}=useStore() ;
  const {userme}=useStore() ;
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');

    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase()+""+names[1][0].toUpperCase();

  }
 
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const items = [
    {
      key: 'user_info',
      label: (<div className='user-header-container' style={{ padding: '8px 4px', minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dumaloq Initial Icon */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#00d1ff',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px' 
            }}>
              {getInitials(user.fullName)}
            </div>
            {/* Ism va Xira Email */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>
                {user?.fullName || t('navbar.default_user')}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                {user?.email || t('navbar.no_email')}
              </span>
              <span style={{
  display: 'inline-block',
  width: 'fit-content',
  marginTop: '0.5rem',
  background: 'transparent',
  border: '0.5px solid #5DCAA5',
  color: '#9FE1CB',
  fontSize: '12px',
  padding: '4px 10px',
  borderRadius: '10px'
}}>
  {userme?.plan ? t(`pricing.plans.${userme.plan}`) : t('pricing.plans.FREE')}
</span>
            </div>
          </div>
        </div>
      ),
      disabled: true

    },
  {
    key: '1',
    label: t('navbar.my_account'),
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: t('navbar.profile'),
    icon: <HiOutlineUserCircle />
    
,
  },
 
  {
    key: '4',
    label: t('navbar.settings'),
    icon: <SettingOutlined />,
    extra: '',
  },
   {
    key: '3',
    label: t('navbar.logout'),
    icon:<IoExitOutline />,
    danger: true
  }
];
const handleMenuClick = ({ key }) => {
    if (key === '2') {
      // Profile bosilganda
      navigate('/profile');
    } else if (key === '3') {
      // Chiqish bosilganda
      clearUser(); 
      message.success(t('navbar.logout_success'));
      Cookies.remove("fitmirror_token"); // Tokenni o'chirish
      window.location.href = '/login2'; // To'liq refresh bilan login sahifasiga
    } 
    else if(key==='4'){
      navigate('/settings');
    }
  };
   var token=Cookies.get("fitmirror_token")

 
  return (
    <div className='navbar1'>
           <NavbarBoot expand="lg" className="bg-body-tertiary">
      <Container className='navbar_container'>
        <NavbarBoot.Brand as={Link} to="/" className='star_box'>
            <span className='star'><img src={star}/></span>
           <span className='fitmirror'>FitMirror</span>
        </NavbarBoot.Brand>
        
        
        <div className='navbar_container_box'>
          {token &&location.pathname!='/pricing'?<Link className='navbar_container_box_pricing' to="/pricing" style={{ color: 'var(--text-main)', fontSize: '14px', textDecoration: 'none' }}>
  {t('navbar.pricing')}
</Link>:<></>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <NavDropdown title={(i18n.language || 'EN').substring(0, 2).toUpperCase()} id="language-dropdown" className="nav-link">
              <NavDropdown.Item onClick={() => changeLanguage('en')}>EN</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('ru')}>RU</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('uz')}>UZ</NavDropdown.Item>
            </NavDropdown>

            <div className="theme-toggle" onClick={toggleTheme} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', fontSize: '20px'}}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </div>

            {token?<div className='profile'>
              <Dropdown menu={{ items , onClick: handleMenuClick }} trigger={['click'] }>
              <a onClick={(e)=>(e.preventDefault())}>
              <Space>
                <div className='profile_initials_circle'>
                  {getInitials(user?.fullName)}
                </div>
              </Space>
              </a>
            </Dropdown>
            </div>:<div className='login_profile'>
              <Link to={'/login2'}>{t('navbar.login')}</Link>
            </div>}
          </div>
        </div>
        
        <NavbarBoot.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Additional nav items can go here */}
          </Nav>
        </NavbarBoot.Collapse>
      </Container>
    </NavbarBoot>
    </div>
  )
}
