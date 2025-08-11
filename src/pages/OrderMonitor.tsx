import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomerOrderService } from '../services/CustomerOrderService';
import { CustomerViewOrderDetail, OrderStatus } from '../dtos/CustomerViewOrderDetail';

const OrderView: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { getOrderByToken } = useCustomerOrderService();
    const [order, setOrder] = useState<CustomerViewOrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Sipariş token bulunamadı');
                setLoading(false);
                return;
            }


            setLoading(true);
            setError(null);

            try {
                const orderData = await getOrderByToken(orderId);

                setOrder(orderData);
            } catch (err: any) {

                setError(err.message || 'Sipariş yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId, getOrderByToken]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.CREATED: return 'Oluşturuldu';
            case OrderStatus.IN_PROGRESS: return 'Devam Ediyor';
            case OrderStatus.COMPLETED: return 'Tamamlandı';
            case OrderStatus.CANCELLED: return 'İptal Edildi';
            default: return status;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.CREATED: return 'primary';
            case OrderStatus.IN_PROGRESS: return 'warning';
            case OrderStatus.COMPLETED: return 'success';
            case OrderStatus.CANCELLED: return 'danger';
            default: return 'secondary';
        }
    };

    const calculateProgress = () => {
        if (!order?.stages || order.stages.length === 0) return 0;
        if (order.status === OrderStatus.COMPLETED) return 100;
        if (order.status === OrderStatus.CREATED || !order.currentStage) return 0;

        const currentStageIndex = order.stages.findIndex(stage => stage === order.currentStage);
        if (currentStageIndex >= 0) {
            // Mevcut aşama dahil tamamlanan aşama sayısı
            return ((currentStageIndex + 1) / order.stages.length) * 100;
        }
        return 0;
    };

    const getCompletedStagesCount = () => {
        if (!order?.stages || order.stages.length === 0) return 0;
        if (order.status === OrderStatus.COMPLETED) return order.stages.length;
        if (order.status === OrderStatus.CREATED || !order.currentStage) return 0;

        const currentStageIndex = order.stages.findIndex(stage => stage === order.currentStage);
        // Mevcut aşama dahil tamamlanan aşama sayısı
        return currentStageIndex >= 0 ? currentStageIndex + 1 : 0;
    };

    const getStageStatus = (stageIndex: number) => {
        if (!order?.stages) return 'pending';

        if (order.status === OrderStatus.COMPLETED) {
            return 'completed';
        }

        if (order.status === OrderStatus.CREATED || !order.currentStage) {
            return 'pending';
        }

        const currentStageIndex = order.stages.findIndex(stage => stage === order.currentStage);

        if (stageIndex < currentStageIndex) {
            return 'completed';
        } else if (stageIndex === currentStageIndex) {
            return 'current';
        } else {
            return 'pending';
        }
    };

    const testBackendConnection = async () => {
        const statusElement = document.getElementById('backend-status');
        if (statusElement) {
            statusElement.textContent = 'Test ediliyor...';
            statusElement.style.color = 'orange';
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/customer-order/${orderId}`);
            if (statusElement) {
                if (response.ok) {
                    statusElement.textContent = '✅ Bağlantı başarılı';
                    statusElement.style.color = 'green';
                } else {
                    statusElement.textContent = `❌ HTTP ${response.status}`;
                    statusElement.style.color = 'red';
                }
            }
        } catch (error) {
            if (statusElement) {
                statusElement.textContent = '❌ Bağlantı hatası';
                statusElement.style.color = 'red';
            }

        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="fs-5 text-muted mt-3">Sipariş detayları yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <div className="display-1 mb-3">⚠️</div>
                    <h2 className="text-danger mb-3">Hata</h2>
                    <p className="text-muted mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="fs-5 text-muted mt-3">Sipariş yükleniyor...</div>
                </div>
            </div>
        );
    }

    const progressPercentage = calculateProgress();
    const completedStagesCount = getCompletedStagesCount();

    return (
        <div className="min-vh-100 bg-light">
            <div className="container py-5" style={{ maxWidth: '900px' }}>
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold text-dark mb-3">Sipariş Takip Sistemi</h1>
                    <p className="lead text-muted">Siparişinizin güncel durumunu takip edin</p>

                    {/* Debug Info */}
                    <div className="mt-3 p-3 bg-light rounded">
                        <small className="text-muted">
                            <strong>Debug Bilgileri:</strong><br />
                            Token: {orderId}<br />
                            API URL: http://localhost:8080/api/v1/customer-order/{orderId}<br />
                            Backend Status: <span id="backend-status">Kontrol ediliyor...</span>
                        </small>
                        <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() => testBackendConnection()}
                        >
                            Backend Bağlantısını Test Et
                        </button>
                    </div>
                </div>

                {/* Company and Customer Info */}
                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                                    🏢 Şirket Bilgileri
                                </h5>
                                <div className="mb-3">
                                    <small className="text-muted">Şirket Adı:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.userCompany}</p>
                                </div>
                                <div>
                                    <small className="text-muted">E-posta:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.userEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm h-100 border-0">
                            <div className="card-body">
                                <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                                    👤 Müşteri Bilgileri
                                </h5>
                                <div className="mb-3">
                                    <small className="text-muted">Müşteri Adı:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.customerName}</p>
                                </div>
                                <div>
                                    <small className="text-muted">İş Akışı:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.taskName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Status Alert */}
                <div className={`alert alert-${getStatusColor(order.status)} d-flex align-items-center gap-3 mb-4 border-0 shadow-sm`}>
                    <span className="fs-1">
                        {order.status === OrderStatus.COMPLETED ? '✅' :
                            order.status === OrderStatus.IN_PROGRESS ? '⏱️' :
                                order.status === OrderStatus.CREATED ? '📋' : '❌'}
                    </span>
                    <div>
                        <h5 className="alert-heading mb-1">
                            {order.status === OrderStatus.COMPLETED ? 'İş Tamamlandı!' :
                                order.status === OrderStatus.IN_PROGRESS ? 'İş Devam Ediyor!' :
                                    order.status === OrderStatus.CREATED ? 'Sipariş Oluşturuldu!' :
                                        'Sipariş İptal Edildi!'}
                        </h5>
                        <p className="mb-0">
                            {order.status === OrderStatus.COMPLETED
                                ? 'Siparişiniz başarıyla tamamlandı ve teslime hazır.'
                                : order.status === OrderStatus.IN_PROGRESS
                                    ? `${order.taskName} işi şu an ${order.currentStage || 'başlangıç'} aşamasında devam ediyor.`
                                    : order.status === OrderStatus.CREATED
                                        ? `${order.taskName} işi için sipariş oluşturuldu ve bekliyor.`
                                        : 'Sipariş iptal edildi.'
                            }
                        </p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="card-title mb-0">İlerleme Durumu</h4>
                            <div className="text-end">
                                <small className="text-muted d-block">
                                    Son güncelleme: {formatDate(order.updatedDate)}
                                </small>
                                <small className="text-muted">
                                    Sipariş tarihi: {formatDate(order.createdDate)}
                                </small>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold text-dark mb-0">Tamamlanma Oranı</h6>
                                <div className="text-end">
                                    <span className="fs-2 fw-bold" style={{
                                        color: progressPercentage === 100 ? '#28a745' :
                                            progressPercentage >= 50 ? '#17a2b8' : '#0d6efd'
                                    }}>
                                        {Math.round(progressPercentage)}%
                                    </span>
                                    {order.stages && order.stages.length > 0 && (
                                        <div className="small text-muted mt-1">
                                            {completedStagesCount}/{order.stages.length} aşama tamamlandı
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Single Gradient Progress Bar */}
                            <div className="progress" style={{ height: '25px', backgroundColor: '#f8f9fa' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${progressPercentage}%`,
                                        background: 'linear-gradient(90deg, #007bff 0%, #20c997 100%)',
                                        transition: 'width 0.8s ease-in-out',
                                        borderRadius: '12px'
                                    }}
                                    aria-valuenow={progressPercentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                        </div>

                        {/* Stage Timeline */}
                        {order.stages && order.stages.length > 0 && (
                            <div className="position-relative">
                                <h6 className="fw-semibold text-dark mb-4">İş Akışı Aşamaları</h6>
                                {order.stages?.map((stage, index) => {
                                    const isLast = index === (order.stages?.length || 0) - 1;
                                    const stageStatus = getStageStatus(index);

                                    return (
                                        <div key={index} className="position-relative d-flex align-items-center mb-4">
                                            {/* Timeline Line */}
                                            {!isLast && (
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        left: '25px',
                                                        top: '50px',
                                                        width: '3px',
                                                        height: '70px',
                                                        backgroundColor: stageStatus === 'completed' ? '#28a745' : '#e9ecef',
                                                        zIndex: 1,
                                                        borderRadius: '2px'
                                                    }}
                                                />
                                            )}

                                            {/* Stage Circle */}
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    minWidth: '50px',
                                                    border: `3px solid ${stageStatus === 'completed' ? '#28a745' :
                                                        stageStatus === 'current' ? '#ffc107' : '#e9ecef'
                                                        }`,
                                                    backgroundColor: stageStatus === 'completed' ? '#28a745' :
                                                        stageStatus === 'current' ? '#ffc107' : '#ffffff',
                                                    zIndex: 10,
                                                    position: 'relative',
                                                    fontSize: '14px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {stageStatus === 'completed' ? (
                                                    <span style={{ color: '#ffffff', fontSize: '18px' }}>✓</span>
                                                ) : stageStatus === 'current' ? (
                                                    <span style={{ color: '#ffffff', fontSize: '14px' }}>●</span>
                                                ) : (
                                                    <span style={{ color: '#6c757d', fontSize: '14px' }}>{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Stage Name */}
                                            <div className="ms-4">
                                                <span
                                                    className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
                                                    style={{
                                                        fontSize: '15px',
                                                        backgroundColor: stageStatus === 'completed' ? '#d4edda' :
                                                            stageStatus === 'current' ? '#fff3cd' : '#f8f9fa',
                                                        color: stageStatus === 'completed' ? '#155724' :
                                                            stageStatus === 'current' ? '#856404' : '#6c757d',
                                                        border: `1px solid ${stageStatus === 'completed' ? '#c3e6cb' :
                                                            stageStatus === 'current' ? '#ffeaa7' : '#e9ecef'
                                                            }`
                                                    }}
                                                >
                                                    {stage}
                                                </span>
                                                {stageStatus === 'current' && (
                                                    <div className="mt-2">
                                                        <small className="text-warning fw-semibold">
                                                            🔄 Şu an bu aşamada
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {(!order.stages || order.stages.length === 0) && (
                            <div className="text-center py-4">
                                <div className="text-muted">
                                    <i className="fas fa-info-circle fs-1 mb-3"></i>
                                    <p>Bu iş akışı için henüz aşama tanımlanmamış.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-5">
                    <small className="text-muted">
                        Sipariş takip numarası: {orderId}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default OrderView;