import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderService } from '../services/OrderService';
import { useTaskService } from '../services/TaskService';
import { OrderDetail } from '../dtos/OrderDto';
import StageFlow from '../components/StageFlow';
import { useToken } from '../utils/TokenContext';

const OrderView = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { getOrderById } = useOrderService();
    const { getTaskById } = useTaskService();
    const { accessToken } = useToken();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Sipariş ID bulunamadı');
                setLoading(false);
                return;
            }

            console.log('Fetching order with ID:', orderId);
            console.log('Access token:', accessToken);

            try {
                const orderData = await getOrderById(parseInt(orderId));
                console.log('Order data received:', orderData);

                // Task stages'leri de çek
                const taskDetail = await getTaskById(orderData.task.id) as { stages?: any[] };
                orderData.taskStages = taskDetail.stages || [];

                console.log('Task stages:', orderData.taskStages);
                setOrder(orderData);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.message || 'Sipariş yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId, getOrderById, getTaskById, accessToken]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return '#6b7280';
            case 'IN_PROGRESS': return '#f59e0b';
            case 'COMPLETED': return '#10b981';
            case 'CANCELLED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', color: '#6b7280', marginBottom: '16px' }}>Yükleniyor...</div>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    if (!accessToken) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Giriş Gerekli</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginRight: '12px'
                        }}
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }



    if (error || !order) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Hata</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error || 'Sipariş bulunamadı'}</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    // Progress hesaplama - tamamlanan adımları sayarak
    const calculateProgress = () => {
        if (!order.taskStages || order.taskStages.length === 0) return 0;

        const currentStageIndex = order.currentTaskStage && order.taskStages ?
            order.taskStages.findIndex(stage => stage.id === order.currentTaskStage?.id) : -1;

        // Eğer current stage varsa, sadece o aşamadan önceki aşamalar tamamlanmış sayılır
        if (currentStageIndex >= 0) {
            return (currentStageIndex / order.taskStages.length) * 100;
        }

        // Eğer current stage yoksa ve sipariş tamamlanmışsa %100
        if (order.status === 'COMPLETED') {
            return 100;
        }

        // Eğer sipariş henüz başlamamışsa %0
        if (order.status === 'CREATED') {
            return 0;
        }

        // Diğer durumlar için %0 (henüz hiçbir aşama tamamlanmamış)
        return 0;
    };

    const progressPercentage = calculateProgress();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                <div style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '32px',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                            İlerleme Durumu
                        </h2>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            Son güncelleme: {formatDate(order.updatedDate)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                                Tamamlanma Oranı
                            </span>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                                    {Math.round(progressPercentage)}%
                                </span>
                                {order.taskStages && order.taskStages.length > 0 && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                        {order.currentTaskStage ?
                                            `${order.taskStages.findIndex(s => s.id === order.currentTaskStage?.id)}/${order.taskStages.length} aşama tamamlandı` :
                                            `0/${order.taskStages.length} aşama tamamlandı`
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{
                            width: '100%',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '9999px',
                            height: '16px'
                        }}>
                            <div
                                style={{
                                    background: 'linear-gradient(to right, #3b82f6, #10b981)',
                                    height: '16px',
                                    borderRadius: '9999px',
                                    transition: 'width 1s ease-in-out',
                                    width: `${progressPercentage}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Stage Timeline */}
                    <div>
                        {order.taskStages && order.taskStages.map((stage, index) => {
                            const isLast = index === order.taskStages.length - 1;
                            const isCurrent = order.currentTaskStage?.id === stage.id;
                            const currentStageIndex = order.currentTaskStage && order.taskStages ?
                                order.taskStages.findIndex(s => s.id === order.currentTaskStage?.id) : -1;
                            const isCompleted = currentStageIndex > index;

                            return (
                                <div key={stage.id} style={{ position: 'relative', display: 'flex', alignItems: 'start' }}>
                                    {/* Timeline line */}
                                    {!isLast && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '24px',
                                            top: '64px',
                                            width: '2px',
                                            height: '96px',
                                            backgroundColor: isCompleted ? '#10b981' : '#d1d5db'
                                        }} />
                                    )}

                                    {/* Stage content */}
                                    <div style={{ display: 'flex', alignItems: 'start', width: '100%' }}>
                                        {/* Icon */}
                                        <div style={{
                                            flexShrink: 0,
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            border: `4px solid ${isCompleted ? '#10b981' : isCurrent ? '#f59e0b' : '#d1d5db'}`,
                                            backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#f59e0b' : '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 10,
                                            position: 'relative'
                                        }}>
                                            {isCompleted ? (
                                                <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>✓</span>
                                            ) : isCurrent ? (
                                                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>●</span>
                                            ) : (
                                                <span style={{ color: '#6b7280', fontSize: '16px', fontWeight: 'bold' }}>{index + 1}</span>
                                            )}
                                        </div>

                                        {/* Stage info */}
                                        <div style={{ marginLeft: '24px', flexGrow: 1, paddingBottom: '48px' }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '8px 16px',
                                                borderRadius: '9999px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                backgroundColor: isCompleted ? '#dcfce7' : isCurrent ? '#fef3c7' : '#f3f4f6',
                                                color: isCompleted ? '#166534' : isCurrent ? '#92400e' : '#6b7280'
                                            }}>
                                                {isCompleted && <span style={{ marginRight: '8px' }}>✓</span>}
                                                {isCurrent && <span style={{ marginRight: '8px' }}>●</span>}
                                                {stage.name}
                                            </div>
                                            <p style={{
                                                marginTop: '8px',
                                                color: '#6b7280',
                                                margin: '8px 0 4px 0'
                                            }}>
                                                {stage.note || 'Aşama açıklaması'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                    {/* Customer Info */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        padding: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            👤 Müşteri Bilgileri
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Müşteri Adı:</span>
                                <p style={{ fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>{order.customer.name}</p>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>İş Akışı:</span>
                                <p style={{ fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>{order.task.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        padding: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📅 Zaman Bilgileri
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Sipariş Tarihi:</span>
                                <p style={{ fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>{formatDate(order.createdDate)}</p>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280', fontSize: '14px' }}>Son Güncelleme:</span>
                                <p style={{ fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>{formatDate(order.updatedDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Status Alert */}
                <div style={{
                    borderRadius: '16px',
                    padding: '24px',
                    backgroundColor: order.status === 'COMPLETED' ? '#f0fdf4' : '#dbeafe',
                    border: `1px solid ${order.status === 'COMPLETED' ? '#bbf7d0' : '#bfdbfe'}`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            fontSize: '32px',
                            color: order.status === 'COMPLETED' ? '#16a34a' : '#2563eb'
                        }}>
                            {order.status === 'COMPLETED' ? '✅' : '⏱️'}
                        </span>
                        <div>
                            <h4 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: order.status === 'COMPLETED' ? '#166534' : '#1e40af',
                                margin: '0 0 4px 0'
                            }}>
                                {order.status === 'COMPLETED' ? 'İş Tamamlandı!' : `Mevcut Durum: ${getStatusText(order.status)}`}
                            </h4>
                            <p style={{
                                color: order.status === 'COMPLETED' ? '#15803d' : '#1d4ed8',
                                margin: '0'
                            }}>
                                {order.status === 'COMPLETED'
                                    ? 'Siparişiniz başarıyla tamamlandı ve teslime hazır.'
                                    : `${order.task.name} işi şu an ${order.currentTaskStage?.name || 'başlangıç'} aşamasında devam ediyor.`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stage Flow Component */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '24px',
                    marginTop: '32px'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: '0 0 16px 0'
                    }}>
                        İş Akışı Görünümü
                    </h3>
                    <StageFlow
                        stages={order.taskStages || []}
                        currentStageId={order.currentTaskStage?.id}
                    />
                    {!order.taskStages || order.taskStages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                            Bu iş akışı için henüz aşama tanımlanmamış.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderView;