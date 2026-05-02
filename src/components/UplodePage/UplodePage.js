import React, { useEffect, useRef, useState, useCallback } from 'react'
import { FiUpload } from 'react-icons/fi'
import star from '../../images/icons/navbar.svg'
import './UplodaPage1.scss'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { httpPostRequisets } from '../../host/Requiests'
import { useStore } from '../../store/store'
import { Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

// ─── Ad API base ───────────────────────────────────────────────────────────────
const AD_BASE = 'https://fitmirror-backend.onrender.com'

function getSessionId() {
    const key = 'fitmirror_session_id'
    let sid = localStorage.getItem(key)
    if (!sid) {
        sid = crypto.randomUUID()
        localStorage.setItem(key, sid)
    }
    return sid
}

// ─── Generate Waiting Modal ────────────────────────────────────────────────────
function GenerateWaitingModal({ isOpen, adData, onAdClick }) {
    const [progress, setProgress] = useState(20)

    useEffect(() => {
        if (!isOpen) {
            setProgress(20)
            return
        }
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + Math.random() * 7))
        }, 600)
        return () => clearInterval(interval)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                {/* Header */}
                <div style={modalStyles.header}>
                    <SpinnerSvg />
                    <div>
                        <p style={modalStyles.headerTitle}>Generating your outfit...</p>
                        <p style={modalStyles.headerSub}>AI sizga mos kiyimni tayyorlayapti</p>
                    </div>
                </div>

                {/* Progress */}
                <div style={modalStyles.progressTrack}>
                    <div style={{ ...modalStyles.progressFill, width: `${progress}%` }} />
                </div>

                {/* Ad card — faqat adData bo'lsa */}
                {adData && <AdCard ad={adData} onAdClick={onAdClick} />}
            </div>
        </div>
    )
}

function SpinnerSvg() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="9" stroke="#E5E7EB" strokeWidth="2.5" />
            <path d="M11 2 A9 9 0 0 1 20 11" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 11 11"
                    to="360 11 11"
                    dur="0.9s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    )
}

function AdCard({ ad, onAdClick }) {
    return (
        <div style={modalStyles.adCard}>
            {ad.imageUrl && (
                <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    style={modalStyles.adImage}
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            )}
            <div style={modalStyles.adBody}>
                {ad.store && (
                    <div style={modalStyles.storeRow}>
                        {ad.store.logoUrl && (
                            <img
                                src={ad.store.logoUrl}
                                alt={ad.store.name}
                                style={modalStyles.storeLogo}
                            />
                        )}
                        <span style={modalStyles.storeName}>{ad.store.name}</span>
                        <span style={modalStyles.partnerBadge}>Hamkor</span>
                    </div>
                )}
                {ad.title && <p style={modalStyles.adTitle}>{ad.title}</p>}
                {ad.description && <p style={modalStyles.adDesc}>{ad.description}</p>}
                <button style={modalStyles.adBtn} onClick={() => onAdClick(ad)} type="button">
                    Ko&apos;rish →
                </button>
            </div>
        </div>
    )
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
    },
    modal: {
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
    },
    headerTitle: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
        lineHeight: 1.3,
    },
    headerSub: {
        fontSize: '12px',
        color: '#6B7280',
        margin: 0,
        marginTop: '2px',
    },
    progressTrack: {
        height: '3px',
        background: '#F3F4F6',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '14px',
    },
    progressFill: {
        height: '100%',
        background: '#1D9E75',
        borderRadius: '2px',
        transition: 'width 0.5s ease',
    },
    adCard: {
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#FAFAFA',
    },
    adImage: {
        width: '100%',
        height: '140px',
        objectFit: 'cover',
        display: 'block',
    },
    adBody: {
        padding: '12px',
    },
    storeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '6px',
    },
    storeLogo: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        objectFit: 'cover',
    },
    storeName: {
        fontSize: '12px',
        color: '#6B7280',
        fontWeight: '500',
    },
    partnerBadge: {
        marginLeft: 'auto',
        fontSize: '10px',
        color: '#0F6E56',
        background: '#E1F5EE',
        padding: '2px 7px',
        borderRadius: '20px',
        fontWeight: '500',
    },
    adTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
        margin: '0 0 4px',
        lineHeight: 1.3,
    },
    adDesc: {
        fontSize: '12px',
        color: '#6B7280',
        margin: '0 0 10px',
        lineHeight: 1.5,
    },
    adBtn: {
        width: '100%',
        padding: '8px',
        background: '#E1F5EE',
        color: '#085041',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        textAlign: 'center',
    },
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UplodePage() {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(null)

    // Ad state
    const [adData, setAdData] = useState(null)
    const impressionSentRef = useRef(false)
    const sessionId = getSessionId()

    const setImg = useStore((state) => state.setImges)
    const resultUrl = useStore((state) => state.resultUrl)

    const [personfile, setPersonfile] = useState(null)
    const [personImage, setPersonImage] = useState(null)
    const [clothfile, setClothfile] = useState(null)
    const [clothImage, setClothImage] = useState(null)
    const [clothSize, setClothSize] = useState('M')
    const [fitPreference, setFitPreference] = useState('regular')

    const navigate = useNavigate()
    const personfileInputRef = useRef(null)
    const clothesfileInputRef = useRef(null)

    const handlePersonClick = () => personfileInputRef.current.click()
    const handleclothesClick = () => clothesfileInputRef.current.click()

    const onPersonFileChange = (e) => {
        if (e.target.files[0]) {
            setPersonfile(e.target.files[0])
            setPersonImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const onClothesFileChange = (e) => {
        if (e.target.files[0]) {
            setClothfile(e.target.files[0])
            setClothImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    // Ad olish
    const fetchAd = useCallback(async () => {
        try {
            const res = await axios.get(`${AD_BASE}/api/ads/generate-waiting`)
            if (res.data.success && res.data.data) return res.data.data
            return null
        } catch {
            return null
        }
    }, [])

    // Impression yuborish
    const sendImpression = useCallback(async (adId) => {
        if (impressionSentRef.current) return
        impressionSentRef.current = true
        try {
            await axios.post(`${AD_BASE}/api/ads/${adId}/impression`, {
                userId: null,
                sessionId,
            })
        } catch { /* generate to'xtamaydi */ }
    }, [sessionId])

    // Ad click
    const handleAdClick = useCallback(async (ad) => {
        try {
            await axios.post(`${AD_BASE}/api/ads/${ad.id}/click`, {
                userId: null,
                sessionId,
            })
        } catch { /* targetUrl baribir ochiladi */ }
        if (ad.targetUrl) window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
    }, [sessionId])

    const apirequest = async () => {
        const formdata = new FormData()
        formdata.append('personImage', personfile)
        formdata.append('clothImage', clothfile)
        formdata.append('clothSize', clothSize)
        formdata.append('fitPreference', fitPreference)

        setLoading(true)
        setError(null)
        setAdData(null)
        impressionSentRef.current = false

        // Ad alohida — generate ni kutmaydi, kelishi bilan ko'rsatiladi
        fetchAd().then((ad) => {
            if (ad) {
                setAdData(ad)
                sendImpression(ad.id)
            }
        })

        // Generate — tugagach modal yopiladi
        try {
            const res = await httpPostRequisets('/generate', formdata)
            setImg(res.data.data.resultUrl, personImage, clothImage)
            navigate('/uploade/result')
        } catch {
            setError(t('upload.error'))
        } finally {
            setLoading(false)
        }
    }

    const downloadImage = async (url) => {
        try {
            setDownloading(true)
            const response = await axios.get(url, { responseType: 'blob' })
            const blobUrl = URL.createObjectURL(response.data)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = 'fitmirror-result.png'
            a.click()
            URL.revokeObjectURL(blobUrl)
        } catch {
            setError(t('upload.download_error'))
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className='uploade'>
            {/* Generate jarayonida modal */}
            <GenerateWaitingModal
                isOpen={loading}
                adData={adData}
                onAdClick={handleAdClick}
            />

            <div className='uploade_box'>
                <h1>{t('upload.title')}</h1>
                <p>{t('upload.description')}</p>

                <div className='uploade_box_cards'>
                    <div className='uploade_box_cards_people' onClick={handlePersonClick}>
                        <input
                            type='file'
                            accept='image/*'
                            ref={personfileInputRef}
                            onChange={onPersonFileChange}
                            style={{ display: 'none' }}
                        />
                        {personImage ? (
                            <img className='preview_img' src={personImage} alt="person" />
                        ) : (
                            <>
                                <span className='icons'><FiUpload /></span>
                                <h2>{t('upload.upload_photo')}</h2>
                                <p>{t('upload.drag_drop')}</p>
                                <span>{t('upload.png_jpg')}</span>
                            </>
                        )}
                    </div>

                    <div className='uploade_box_cards_people uploade_box_cards_clothes' onClick={handleclothesClick}>
                        <input
                            type='file'
                            accept='image/*'
                            ref={clothesfileInputRef}
                            onChange={onClothesFileChange}
                            style={{ display: 'none' }}
                        />
                        {clothImage ? (
                            <img className='preview_img' src={clothImage} alt="cloth" />
                        ) : (
                            <>
                                <span className='icons'><img src={star} alt="star" /></span>
                                <h2>{t('upload.upload_clothing')}</h2>
                                <p>{t('upload.drag_drop')}</p>
                                <span>{t('upload.png_jpg')}</span>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
                        {error}
                    </p>
                )}

                {/* Parametrlar */}
                <div className="options_section">
                    <div className="option_item">
                        <label>{t('upload.cloth_size')}</label>
                        <div className="select_wrapper">
                            <select value={clothSize} onChange={(e) => setClothSize(e.target.value)}>
                                <option value="S">{t('upload.cloth_size_s')}</option>
                                <option value="M">{t('upload.cloth_size_m')}</option>
                                <option value="L">{t('upload.cloth_size_l')}</option>
                                <option value="XL">{t('upload.cloth_size_xl')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="option_item">
                        <label>{t('upload.fit_preference')}</label>
                        <div className="select_wrapper">
                            <select value={fitPreference} onChange={(e) => setFitPreference(e.target.value)}>
                                <option value="slim">{t('upload.fit_slim')}</option>
                                <option value="regular">{t('upload.fit_regular')}</option>
                                <option value="oversize">{t('upload.fit_oversize')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='uploade_box_btn'>
                    <Button
                        onClick={apirequest}
                        disabled={!personImage || !clothImage || loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ marginRight: '8px' }}
                                />
                                {t('upload.generating')}
                            </>
                        ) : (
                            <>{t('upload.generate')} <span className='hover1'><FaArrowRightLong /></span></>
                        )}
                    </Button>
                </div>

                {resultUrl && (
                    <div className='uploade_box_btn' style={{ marginTop: '12px' }}>
                        <Button
                            variant="outline-primary"
                            onClick={() => downloadImage(resultUrl)}
                            disabled={downloading}
                        >
                            {downloading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        style={{ marginRight: '8px' }}
                                    />
                                    {t('upload.downloading')}
                                </>
                            ) : (
                                <>{t('result.download')}</>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}