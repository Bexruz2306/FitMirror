import React, { useEffect, useState } from 'react';
import './profile.scss';
import { httpDeleteRequisets, httpGetRequisets } from '../../host/Requiests';
import { Col, Row, Container } from 'react-bootstrap';
import { FaClock, FaTrashCan } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { LuImageOff } from 'react-icons/lu';
import { BiSolidDownload } from 'react-icons/bi';
import axios from 'axios';
import { Button, message, Popconfirm } from 'antd';
import Cookies from 'js-cookie';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [downloade, setDownloade] = useState(false);  
    const {setUserMe,userme}=useStore()
    const navigate=useNavigate()
    const token = Cookies.get("fitmirror_token");


    const handlePricing=()=>{
        navigate('/pricing')
    }

   const changeDownloade = async (url) => {

    
    setDownloade(true);
    try {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            window.location.href = url;
            return;
        }
        
        const response = await axios.get(url, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `fitmirror-${Date.now()}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
    } catch (err) {
        alert(t('upload.download_error'));
    } finally {
        setDownloade(false);
    }
}
    const [deleting, setDeleting] = useState(null);

    const changeDelete = async(id) => {
        if (deleting) return; // oldingisi tugamagan bo'lsa kutish
        setDeleting(id);
        try {
            await httpDeleteRequisets(`/users/images/${id}`);
            // ✅ UI dan ham o'chirib tashlash
            setProfile(prev => prev.filter(item => item.result.id !== id));
            message.success(t('profile.delete_success'));
        } catch(err) {
            console.error('Delete error:', err);
            message.error(t('profile.delete_error'));
        } finally {
            setDeleting(null);
        }
    }
const uploadePage = () => {
    navigate('/uploade');
}
    useEffect(() => {

        const getME=async()=>{
            if (!token) return;
            try{
                const resdata=await httpGetRequisets("/users/me");
                setUserMe(resdata.data.data);
                console.log(resdata.data.data);
                
            }
            catch(err){
                console.log(err);
            }

        }

        const getSession = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await httpGetRequisets("/users/sessions");
                // Faqat result mavjud bo'lgan ma'lumotlarni saqlaymiz
                const validData = res.data.data.filter(item => item && item.result);
                
                setProfile(validData);
            } catch (err) {
                console.error("Xatolik yuz berdi:", err);
            } finally {
                setLoading(false);
            }
        };

        getME();
        getSession();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <div className="profile_box">
                <h2 style={{color: 'white'}}>{t('profile.loading')}</h2>
            </div>
        );
    }

    return (
        <div className='profile_box'>
            <button class="back-btn" onClick={()=>{navigate('/')}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
  <span>{t('back_button')}</span>
</button>
            <Container fluid>
                <div className='profile_box_top'>
                    <h1>{t('profile.title')}</h1>
                    <p>{t('profile.description')}</p>
                </div>
                { (
  <div className='plan_info_bar'>
    
  {/* 1. Tarif rejasi */}
  <div className="status-item">
    <span className="label">{t('profile.plan_label')}</span>
    <span className="value plan-text">{userme?.plan ? t(`pricing.plans.${userme.plan}`) : t('pricing.plans.FREE')}</span>
  </div>

  {/* 2. Generatsiyalar (Progress bilan) */}
  <div className="status-item">
    <span className="label">{t('profile.generations_label')}</span>
    <div className="usage-wrapper">
      <span className="value">{userme?.remainingGenerations} / {userme?.monthlyGenerationLimit}</span>
      <div className="mini-progress-bg">
        <div 
          className="mini-progress-fill" 
          style={{ width: `${(userme?.remainingGenerations / userme?.monthlyGenerationLimit) * 100}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* 3. Qurilmalar */}
  <div className="status-item">
    <span className="label">{t('profile.devices_label')}</span>
    <span className="value">{userme?.deviceCount} / {userme?.maxDevices}</span>
  </div>

  {/* 4. Tugash sanasi */}
  <div className="status-item">
    <span className="label">{t('profile.expiry_label')}</span>
    <span className="value">{userme?.planExpiresAt || t('profile.unlimited')}</span>
  </div>

  {/* 5. Upgrade tugmasi (Sizda bor) */}
  <div className="status-action">
    <Button onClick={handlePricing} className="upgrade-btn">{t('profile.upgrade_btn')} →</Button>
  </div>
</div>
  
)}

                <div className='profile_box_menu'>
                    <Row>
                        {profile.length > 0 ? (
                            profile.map((item, index) => (
                                <Col lg={4} md={6} sm={12} key={index}>
                                    <div className='img_box'>
                                        <div className='img_col'>
                                            <img 
                                                src={item.result.fileUrl} 
                                                alt={t('profile.alt_result')} 
                                            />
                                            {/* Gradient overlay aynan img_col ichida bo'lishi shart */}
                                            <div className='overly'></div>
                                        </div>

                                        <div className='img_bottom'>
                                            <div className='img_time'>
                                            <span>
                                                <FaClock /> 
                                                {t('profile.time')}:
                                            </span>
                                            <p>
                                                {item.result.createdAt ? item.result.createdAt.split('T')[0] : t('profile.not_available')}
                                            </p>
                                            </div>
                                            <div  className='img_downloand'>
                                                <button loading={downloade} onClick={()=>{changeDownloade(item.result.fileUrl)}} className='img_downloand_first'><BiSolidDownload /><p>{t('profile.download')}</p></button>
                                                <Popconfirm
      title={t('profile.delete_confirm_title')}
      description={t('profile.delete_confirm_desc')}
      onConfirm={()=>{changeDelete(item.result.id)}}
      okText={t('common.yes')}
      cancelText={t('common.no')}
      overlayClassName="custom-popconfirm" // Shuni qo'shing
  okButtonProps={{ danger: true, className: "pop-ok-btn" }}
  cancelButtonProps={{ className: "pop-cancel-btn" }}
    >
       <button disabled={deleting === item.result.id} className='img_downloand_second'>
          <FaTrashCan />
          <p>{deleting === item.result.id ? t('common.loading_dots') : t('profile.delete')}</p>
       </button>
  </Popconfirm>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        ) : (<div className='notfount_img'>
                            <Col className='notfount_img_col' lg={12} md={12} sm={12}>
                                <span className='img_icon'><LuImageOff /></span>

                                <p style={{color: 'white'}}>{t('profile.no_data')}</p>
                                <button onClick={uploadePage}>{t('profile.data_button')}</button>
                            </Col>
                        </div>
                            
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    );
}