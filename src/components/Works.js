  import React from 'react'
  import { Col, Row } from 'react-bootstrap'
  import { FiUpload } from 'react-icons/fi'
  import star from '../images/icons/navbar.svg'
  import { PiMagicWand } from 'react-icons/pi'
  import './mainhead.scss'
  import { useTranslation } from 'react-i18next'

  export default function Works() {
    const { t } = useTranslation()
    return (
      <div className='works'>
        <div className='works_box'>
          <h2>{t('works.title')}</h2>
          <p>{t('works.subtitle')}</p>
        </div>
      <div className='works_row'>
        <Row>
          <Col className='col' lg={4} xs={12} md={12} sm={12}>
          <div className='works_row_count'>1</div>
          <div>
            <span><FiUpload /></span>
            <h2 >{t('works.step1_title')} </h2>
            <p>{t('works.step1_desc')}</p>
          </div>
          </Col>
          <Col className='col' lg={4} md={12} xs={12} sm={12}>
          <div className='works_row_count'>2</div>
          <div>
            <span><img src={star}/></span>
            <h2>{t('works.step2_title')} </h2>
            <p>{t('works.step2_desc')}</p>
          </div>
          </Col>
          <Col className='col' lg={4} sm={12}>
          <div className='works_row_count'>3</div>
          <div>
            <span><PiMagicWand /></span>
            <h2>{t('works.step3_title')}</h2>
            <p>{t('works.step3_desc')}</p>
          </div>
          </Col>
        </Row>

      </div>
      </div>
    )
  }
