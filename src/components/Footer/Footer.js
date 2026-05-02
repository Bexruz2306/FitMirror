import React, { useState } from 'react'
import './footer.scss'
import star from '../../images/icons/navbar.svg'
import { useTranslation } from 'react-i18next'
import FeedbackModal from './FeedbackModal'
import { FaInstagram, FaTelegram, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
  const { t } = useTranslation()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  return (
    <>
      <div className='footer'>
        <div className='footer_box'>
            <img src={star}/>
            <p>FitMirror © 2026</p>
        </div>
        <div className='footer_ul'>
          <div className='batafsil'>
            <a 
            target='_blank' 
            rel='noopener noreferrer'
             className='telegram' href='https://t.me/fitm1ror'><FaTelegram /></a>

            <a
              target='_blank'
              rel='noopener noreferrer' 
             className='instagramm' href='https://www.instagram.com/fitm1rror?igsh=MWwzZnljOXZrdHVmaQ=='><FaInstagram /></a>
            <a 
            
             className='yotoube' href='#'><FaYoutube/></a>
          </div>
          <div>
          <a href="tel:+998200220673">{t('footer.contact')}</a>
          <span 
            onClick={() => setIsFeedbackOpen(true)}
            style={{ cursor: 'pointer', color: 'inherit' }}
          >
            {t('footer.feedback')}
          </span>
          </div>
        </div>
      </div>
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </>
  )
}
