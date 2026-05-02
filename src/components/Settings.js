import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next' // Tarjimalar uchun
import './settings.scss'
import { httpDeleteRequisets, httpGetRequisets } from '../host/Requiests'

// ─── Device icon — browser/OS ga qarab ────────────────────────────────────────
function DeviceIcon({ deviceName = '' }) {
    const name = deviceName.toLowerCase()
    const isMobile = /mobile|android|iphone|ipad/.test(name)
    const isTablet = /tablet|ipad/.test(name)

    if (isMobile || isTablet) {
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
            </svg>
        )
    }
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="14" rx="2" />
            <path d="M8 20h8M12 18v2" />
        </svg>
    )
}

// ─── Bitta qurilma satri ───────────────────────────────────────────────────────
function DeviceRow({ device, onLogout, isLoggingOut }) {
    const { t } = useTranslation() // Tarjima funksiyasi
    const isCurrentDevice = device.isCurrent || device.current

    return (
        <div className={`device-row ${isCurrentDevice ? 'device-row--current' : ''}`}>
            <div className="device-row__icon">
                <DeviceIcon deviceName={device.deviceName || device.name || ''} />
            </div>

            <div className="device-row__info">
                <div className="device-row__top">
                    <span className="device-row__name">
                        {device.deviceName || device.name || t('settings.device.unknown')}
                    </span>
                    {isCurrentDevice && (
                        <span className="device-row__badge">{t('settings.device.current_badge')}</span>
                    )}
                </div>
                <div className="device-row__meta">
                    {device.browser && <span>{device.browser}</span>}
                    {device.browser && device.location && <span className="device-row__dot" />}
                    {device.location && <span>{device.location}</span>}
                    {device.lastActive && (
                        <>
                            <span className="device-row__dot" />
                            <span>{device.lastActive}</span>
                        </>
                    )}
                </div>
            </div>

            {!isCurrentDevice && (
                <button
                    className="device-row__logout"
                    onClick={() => onLogout(device.deviceId)} 
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    )}
                    <span>{isLoggingOut ? t('settings.device.logging_out') : t('settings.device.logout_btn')}</span>
                </button>
            )}
        </div>
    )
}

// ─── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, onConfirm, onCancel }) {
    const { t } = useTranslation()
    if (!isOpen) return null
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </div>
                <h3 className="confirm-modal__title">{t('settings.confirm_modal.title')}</h3>
                <p className="confirm-modal__desc">{t('settings.confirm_modal.description')}</p>
                <div className="confirm-modal__actions">
                    <button className="confirm-modal__cancel" onClick={onCancel}>{t('settings.confirm_modal.cancel')}</button>
                    <button className="confirm-modal__confirm" onClick={onConfirm}>{t('settings.confirm_modal.confirm')}</button>
                </div>
            </div>
        </div>
    )
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div className="device-row device-row--skeleton">
            <div className="skeleton skeleton--icon" />
            <div className="device-row__info">
                <div className="skeleton skeleton--name" />
                <div className="skeleton skeleton--meta" />
            </div>
        </div>
    )
}

// ─── Main Settings component ───────────────────────────────────────────────────
export default function Settings() {
    const { t } = useTranslation()
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [loggingOutId, setLoggingOutId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

    const fetchDevices = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await httpGetRequisets(`/users/devices`)
            setDevices(res.data.data || res.data.devices || res.data || [])
        } catch {
            setError(t('settings.error'))
        } finally {
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        fetchDevices()
    }, [fetchDevices])

    const handleLogout = useCallback(async () => {
        if (!confirmId) return
        
        const isAll = confirmId === 'all'
        setLoggingOutId(confirmId)
        setConfirmId(null)

        try {
            if (isAll) {
                await httpDeleteRequisets(`/users/devices/all`)
                setDevices(prev => prev.filter(d => d.isCurrent || d.current))
            } else {
                await httpDeleteRequisets(`/users/devices/${confirmId}`)
                setDevices(prev => prev.filter(d => d.deviceId !== confirmId))
            }
        } catch {
            setError(t('settings.errors.logout_fail'))
        } finally {
            setLoggingOutId(null)
        }
    }, [confirmId, t])

    const currentDevice = devices.find(d => d.isCurrent || d.current)
    const otherDevices = devices.filter(d => !d.isCurrent && !d.current)

    return (
        <div className="settings">
            <ConfirmModal
                isOpen={!!confirmId}
                onConfirm={handleLogout}
                onCancel={() => setConfirmId(null)}
            />

            <div className="settings__section">
                <div className="settings__section-header">
                    <h2 className="settings__section-title">{t('settings.title')}</h2>
                    <span className="settings__section-count">
                        {!loading && t('settings.count', { count: devices.length })}
                    </span>
                </div>

                {error && (
                    <div className="settings__error">
                        <span>{error}</span>
                        <button onClick={fetchDevices}>{t('settings.retry')}</button>
                    </div>
                )}

                <div className="settings__device-list">
                    {loading ? (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    ) : devices.length === 0 ? (
                        <div className="settings__empty">
                            <p>{t('settings.empty')}</p>
                        </div>
                    ) : (
                        <>
                            {currentDevice && (
                                <DeviceRow
                                    device={currentDevice}
                                    onLogout={setConfirmId}
                                    isLoggingOut={loggingOutId === currentDevice.deviceId}
                                />
                            )}
                            {otherDevices.map(device => (
                                <DeviceRow
                                    key={device.deviceId} 
                                    device={device}
                                    onLogout={setConfirmId}
                                    isLoggingOut={loggingOutId === device.deviceId}
                                />
                            ))}
                        </>
                    )}
                </div>

                {!loading && otherDevices.length > 0 && (
                    <button
                        className="settings__logout-all"
                        onClick={() => setConfirmId('all')}
                    >
                        {t('settings.logout_all')}
                    </button>
                )}
            </div>
        </div>
    )
}