import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderService } from '../services/OrderService';
import { useTaskService } from '../services/TaskService';
import { OrderDetail } from '../dtos/OrderDto';
import { useToken } from '../utils/TokenContext';

const OrderView: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { getOrderById } = useOrderService();
    const { getTaskById } = useTaskService();
    const { accessToken } = useToken();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Sipariş ID bulunamadı');
                setLoading(false);
                return;
            }
            try {
                const orderData = await getOrderById(parseInt(orderId));
                const taskDetail = await getTaskById(orderData.task.id) as { stages?: any[] };
                orderData.taskStages = taskDetail.stages || [];
                setOrder(orderData);
            } catch (err: any) {
                setError(err.message || 'Sipariş yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken && orderId) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId, accessToken]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CREATED': return 'Oluşturuldu';
            case 'IN_PROGRESS': return 'Devam Ediyor';
            case 'COMPLETED': return 'Tamamlandı';
            case 'CANCELLED': return 'İptal Edildi';
            default: return status;
        }
    };

    const calculateProgress = () => {
        if (!order?.taskStages || order.taskStages.length === 0) return 0;
        if (order.status === 'COMPLETED') return 100;
        if (order.status === 'CREATED' || !order.currentTaskStage) return 0;
        
        const currentStageIndex = order.taskStages.findIndex(stage => stage.id === order.currentTaskStage?.id);
        if (currentStageIndex >= 0) {
            // Mevcut aşama dahil tamamlanan aşama sayısı
            return ((currentStageIndex + 1) / order.taskStages.length) * 100;
        }
        return 0;
    };

    const getCompletedStagesCount = () => {
        if (!order?.taskStages || order.taskStages.length === 0) return 0;
        if (order.status === 'COMPLETED') return order.taskStages.length;
        if (order.status === 'CREATED' || !order.currentTaskStage) return 0;
        
        const currentStageIndex = order.taskStages.findIndex(stage => stage.id === order.currentTaskStage?.id);
        // Mevcut aşama dahil tamamlanan aşama sayısı
        return currentStageIndex >= 0 ? currentStageIndex + 1 : 0;
    };

    const getStageStatus = (stageIndex: number) => {
        if (!order?.taskStages) return 'pending';
        
        if (order.status === 'COMPLETED') {
            return 'completed';
        }
        
        if (order.status === 'CREATED' || !order.currentTaskStage) {
            return 'pending';
        }
        
        const currentStageIndex = order.taskStages.findIndex(stage => stage.id === order.currentTaskStage?.id);
        
        if (stageIndex < currentStageIndex) {
            return 'completed';
        } else if (stageIndex === currentStageIndex) {
            return 'current';
        } else {
            return 'pending';
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

    if (!accessToken) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <div className="display-1 mb-3">🔒</div>
                    <h2 className="text-danger mb-3">Giriş Gerekli</h2>
                    <p className="text-muted mb-4">Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary me-3"
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-secondary"
                    >
                        Ana Sayfaya Dön
                    </button>
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
            <div className="container py-5" style={{ maxWidth: '800px' }}>
                {/* Order Details at top */}
                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                                    👤 Müşteri Bilgileri
                                </h5>
                                <div className="mb-3">
                                    <small className="text-muted">Müşteri Adı:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.customer.name}</p>
                                </div>
                                <div>
                                    <small className="text-muted">İş Akışı:</small>
                                    <p className="fw-semibold text-dark mb-0">{order.task.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                                    📅 Zaman Bilgileri
                                </h5>
                                <div className="mb-3">
                                    <small className="text-muted">Sipariş Tarihi:</small>
                                    <p className="fw-semibold text-dark mb-0">{formatDate(order.createdDate)}</p>
                                </div>
                                <div>
                                    <small className="text-muted">Son Güncelleme:</small>
                                    <p className="fw-semibold text-dark mb-0">{formatDate(order.updatedDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Status Alert */}
                <div className={`alert ${order.status === 'COMPLETED' ? 'alert-success' : 'alert-primary'} d-flex align-items-center gap-3 mb-4`}>
                    <span className="fs-2">
                        {order.status === 'COMPLETED' ? '✅' : '⏱️'}
                    </span>
                    <div>
                        <h5 className="alert-heading mb-1">
                            {order.status === 'COMPLETED' ? 'İş Tamamlandı!' : `Mevcut Durum: ${getStatusText(order.status)}`}
                        </h5>
                        <p className="mb-0">
                            {order.status === 'COMPLETED'
                                ? 'Siparişiniz başarıyla tamamlandı ve teslime hazır.'
                                : `${order.task.name} işi şu an ${order.currentTaskStage?.name || 'başlangıç'} aşamasında devam ediyor.`
                            }
                        </p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="card-title mb-0">İlerleme Durumu</h4>
                            <small className="text-muted">
                                Son güncelleme: {formatDate(order.updatedDate)}
                            </small>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold text-dark mb-0">Tamamlanma Oranı</h6>
                                <div className="text-end">
                                    <span className="fs-3 fw-bold" style={{
                                        color: progressPercentage === 100 ? '#28a745' :
                                            progressPercentage >= 50 ? '#17a2b8' : '#0d6efd'
                                    }}>
                                        {Math.round(progressPercentage)}%
                                    </span>
                                    {order.taskStages && order.taskStages.length > 0 && (
                                        <div className="small text-muted mt-1">
                                            {completedStagesCount}/{order.taskStages.length} aşama tamamlandı
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Single Gradient Progress Bar */}
                            <div className="progress" style={{ height: '20px', backgroundColor: '#f0f0f0' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${progressPercentage}%`,
                                        background: 'linear-gradient(90deg, #007bff 0%, #20c997 100%)',
                                        transition: 'width 0.5s ease-in-out'
                                    }}
                                    aria-valuenow={progressPercentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                        </div>

                        {/* Stage Timeline */}
                        <div className="position-relative">
                            {order.taskStages && order.taskStages.map((stage, index) => {
                                const isLast = index === order.taskStages.length - 1;
                                const stageStatus = getStageStatus(index);

                                return (
                                    <div key={stage.id} className="position-relative d-flex align-items-center mb-4">
                                        {/* Timeline Line */}
                                        {!isLast && (
                                            <div
                                                className="position-absolute"
                                                style={{
                                                    left: '23px',
                                                    top: '46px',
                                                    width: '2px',
                                                    height: '64px',
                                                    backgroundColor: stageStatus === 'completed' ? '#28a745' : '#e9ecef',
                                                    zIndex: 1
                                                }}
                                            />
                                        )}

                                        {/* Stage Circle */}
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '46px',
                                                height: '46px',
                                                minWidth: '46px',
                                                border: `2px solid ${
                                                    stageStatus === 'completed' ? '#28a745' :
                                                    stageStatus === 'current' ? '#ffc107' : '#e9ecef'
                                                }`,
                                                backgroundColor: stageStatus === 'completed' ? '#28a745' :
                                                    stageStatus === 'current' ? '#ffc107' : '#ffffff',
                                                zIndex: 10,
                                                position: 'relative',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {stageStatus === 'completed' ? (
                                                <span style={{ color: '#ffffff', fontSize: '16px' }}>✓</span>
                                            ) : stageStatus === 'current' ? (
                                                <span style={{ color: '#ffffff', fontSize: '12px' }}>●</span>
                                            ) : (
                                                <span style={{ color: '#6c757d', fontSize: '12px' }}>{index + 1}</span>
                                            )}
                                        </div>

                                        {/* Stage Name */}
                                        <div className="ms-3">
                                            <span
                                                className="px-3 py-1 rounded-pill fw-semibold"
                                                style={{
                                                    fontSize: '14px',
                                                    backgroundColor: stageStatus === 'completed' ? '#d4edda' :
                                                        stageStatus === 'current' ? '#fff3cd' : '#f8f9fa',
                                                    color: stageStatus === 'completed' ? '#155724' :
                                                        stageStatus === 'current' ? '#856404' : '#6c757d'
                                                }}
                                            >
                                                {stage.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderView;