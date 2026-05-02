import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './result.scss'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { SlRefresh } from 'react-icons/sl'
import { AiOutlineDownload } from 'react-icons/ai'
import { useStore } from '../store/store'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { httpGetRequisets, httpPostRequisets } from '../host/Requiests'
import Cookies from 'js-cookie'
import OutfitRecommendation from './Outfit'

export default function Result() {
    const { t } = useTranslation()
    const { resultImg, originalImg, clotehsImg,imageId } = useStore()
    const [downloading, setDownloading] = useState(false)
    const token = Cookies.get('fitmirror_token')
    const [outfitdata,setoutfitdata]=useState(null)

    useEffect(()=>{
        getsession()
        getAIresponse()

    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    const getsession=async()=>{
        if (!token) return;
        try{
 await httpGetRequisets("/users/sessions")

        }
        catch(err){

        }
    }
    const getAIresponse=async()=>{
        try{
            var result=await httpPostRequisets('/users/outfit/recommendation', {imageId:imageId})
            console.log(result)
            setoutfitdata(result.data)

        }
        catch(err){
            console.log(err)

        }

    }

    const downloadMyImage = async (url) => {
        try {
            setDownloading(true)
            const response = await axios.get(url, { responseType: 'blob' })
            const blobUrl = URL.createObjectURL(response.data)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = 'fitmirror-result.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(blobUrl)
        } catch (err) {
            alert(t('upload.download_error'))
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className='result uploade '>
            <div className='result_box '>
                <Link to={'/uploade'}><p><FaArrowLeftLong /></p> <span> {t('result.back')}</span></Link>
                <div className='result_box_head uploade_box'>
                    <div className='checked'> <span>{t('result.complete')}</span></div>
                    <h1>{t('result.title')}</h1>
                    <p>{t('result.description')}</p>
                    <div className='box_images'>
                        <div className='result_box_head_orginaal'>
                            <ul><li>{t('result.original')}</li></ul>
                            <img src={originalImg} alt="Original" />
                        </div>
                        <div className='result_box_head_orginaal result_box_head_result'>
                            <ul><li>{t('result.ai_result')}</li></ul>
                            <img src={resultImg} alt="AI result" />
                        </div>
                    </div>
                    <h3>{t('result.clothing_ref')}</h3>
                    <div className='result_box_head_clothes result_box_head_originaal'>
                        <img src={clotehsImg} alt="Clothing" />
                    </div>
                </div>

                <div className='submit'>
                    <div
                        onClick={() => !downloading && downloadMyImage(resultImg)}
                        className='yuklash'
                        style={{ cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.6 : 1 }}
                    >
                        <p><AiOutlineDownload /></p>
                        <span>{downloading ? t('upload.downloading') : t('result.download')}</span>
                    </div>
                    <Link to={'/uploade'} className='yuklash refresh'>
                        <p><SlRefresh /></p> <span>{t('result.try_another')}</span>
                    </Link>
                </div>
                <OutfitRecommendation result={outfitdata}/>
            </div>
        </div>
    )
}