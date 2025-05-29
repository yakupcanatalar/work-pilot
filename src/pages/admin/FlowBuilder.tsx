import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Card, Button, Spinner, Form } from 'react-bootstrap';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getAllTaskStages, createTaskStage, deleteTaskStage, TaskStageDto } from '../../services/TaskStage';
import '../../assets/styles/flow.css';

interface Task {
  id?: number;
  name: string;
  note?: string;
  stages?: TaskStageDto[];
  nodes?: Node[];
  edges?: Edge[];
}

interface FlowBuilderProps {
  show: boolean;
  onHide: () => void;
  onSave: (flowData: {
    name: string;
    note: string;
    stages: TaskStageDto[];
    nodes: Node[];
    edges: Edge[];
  }) => Promise<void>;
  task?: Task | null;
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ show, onHide, onSave, task }) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [availableStages, setAvailableStages] = useState<TaskStageDto[]>([]);
  const [selectedStages, setSelectedStages] = useState<TaskStageDto[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [lastNodeId, setLastNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newStageNote, setNewStageNote] = useState('');

  // Load task stages from API
  const loadTaskStages = async () => {
    try {
      const stages = await getAllTaskStages();
      setAvailableStages(stages);
    } catch (error) {
      console.error('Error loading task stages:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    if (show) {
      loadTaskStages();

      if (task) {
        setName(task.name || '');
        setNote(task.note || '');
        setSelectedStages(task.stages || []);
        setNodes(task.nodes || []);
        setEdges(task.edges || []);
        if (task.nodes && task.nodes.length > 0) {
          setLastNodeId(task.nodes[task.nodes.length - 1].id);
        }
      } else {
        setName('');
        setNote('');
        setSelectedStages([]);
        setNodes([]);
        setEdges([]);
        setLastNodeId(null);
      }
    }
    // eslint-disable-next-line
  }, [task, show]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const stageName = event.dataTransfer.getData('application/reactflow');
      if (!stageName) return;

      const basePosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const offset = 80;
      const newNodeId = `node-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: 'default',
        position: {
          x: basePosition.x + offset,
          y: basePosition.y + offset,
        },
        data: { label: stageName },
      };

      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);

        // Auto-connect to last node if exists
        if (lastNodeId && updatedNodes.length > 1) {
          setEdges((eds) =>
            addEdge(
              {
                id: `edge-${lastNodeId}-${newNodeId}`,
                source: lastNodeId,
                target: newNodeId,
                markerEnd: { type: MarkerType.ArrowClosed },
                animated: true,
              },
              eds
            )
          );
        }

        return updatedNodes;
      });

      setLastNodeId(newNodeId);
    },
    [reactFlowInstance, setNodes, lastNodeId, setEdges]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (window.confirm('Bu aşamayı silmek istediğinize emin misiniz?')) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== node.id && edge.target !== node.id)
        );

        // Update lastNodeId if we deleted the last node
        if (lastNodeId === node.id) {
          setLastNodeId(nodes.length > 1 ? nodes[nodes.length - 2].id : null);
        }
      }
    },
    [setNodes, setEdges, lastNodeId, nodes]
  );

  // Yeni aşama ekle ve güncel listeyi çek
  const addNewStage = async () => {
    if (!newStageName.trim()) return;

    setLoading(true);
    try {
      await createTaskStage({
        name: newStageName.trim(),
        note: newStageNote.trim() || undefined,
      });

      setNewStageName('');
      setNewStageNote('');
      await loadTaskStages(); // Güncel aşama listesini çek
    } catch (error) {
      console.error('Error creating stage:', error);
      alert('Aşama oluşturulurken hata oluştu!');
    }
    setLoading(false);
  };

  const removeStage = async (stageId: number) => {
    if (window.confirm('Bu aşamayı silmek istediğinize emin misiniz?')) {
      setLoading(true);
      try {
        await deleteTaskStage(stageId);
        await loadTaskStages();
        setSelectedStages(selectedStages.filter((stage) => stage.id !== stageId));
      } catch (error) {
        console.error('Error deleting stage:', error);
        alert('Aşama silinirken hata oluştu!');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Akış adı zorunludur!');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        note: note.trim(),
        stages: selectedStages,
        nodes,
        edges,
      });
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('İş akışı kaydedilirken hata oluştu!');
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        className="flow-builder-modal"
        dialogClassName="modal-90w"
      >
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">{task ? 'Akışı Düzenle' : 'Yeni Akış'}</h5>
          </Card.Header>

          <div className="px-4 pt-4 pb-3 bg-light border-bottom">
            <div className="row g-4">
              <div className="col-md-6">
                <Form.Label className="fw-semibold mb-2 fs-6 text-secondary">
                  Akış Adı *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Akış adını girin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="sm"
                  className="input-sm"
                />
              </div>
              <div className="col-md-6">
                <Form.Label className="fw-semibold mb-2 fs-6 text-secondary">
                  Not
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Not (opsiyonel)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  size="sm"
                  className="input-sm"
                />
              </div>
            </div>
          </div>

          <Card.Body className="d-flex flex-row p-0 flow-body">
            {/* Sidebar */}
            <div className="d-flex flex-column p-3 gap-3 bg-white border-end flow-sidebar">
              <Card className="mb-3 border flex-shrink-0">
                <Card.Header className="py-2">
                  <Card.Title className="fw-semibold mb-0 fs-6 text-secondary">
                    Yeni Aşama
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold mb-1 fs-7 text-secondary">
                      Aşama Adı
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Aşama adı"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNewStage()}
                      disabled={loading}
                      size="sm"
                      className="input-sm"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold mb-1 fs-7 text-secondary">
                      Not
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Not (opsiyonel)"
                      value={newStageNote}
                      onChange={(e) => setNewStageNote(e.target.value)}
                      disabled={loading}
                      size="sm"
                      className="input-sm"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={addNewStage}
                      disabled={!newStageName.trim() || loading}
                      className="btn-sm minw-80"
                    >
                      {loading ? <Spinner size="sm" /> : '+'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card className="flex-grow-1 border">
                <Card.Header className="py-2 border-bottom">
                  <Card.Title className="fw-semibold mb-0 fs-6 text-secondary">
                    Aşamalar ({availableStages.length})
                  </Card.Title>
                </Card.Header>
                <Card.Body className="p-2 stage-list-scroll">
                  {availableStages.length === 0 ? (
                    <div className="text-center py-4 text-muted fs-7">
                      Henüz aşama yok
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex flex-column gap-2">
                        {availableStages
                          .filter(
                            (stage) =>
                              stage.name && stage.name.trim() !== ''
                          )
                          .map((stage) => (
                            <div
                              key={stage.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  'application/reactflow',
                                  stage.name
                                );
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              className="stage-rect"
                            >
                              <span className="stage-label">{stage.name}</span>
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Sil"
                                onClick={() =>
                                  stage.id !== undefined &&
                                  removeStage(stage.id)
                                }
                                disabled={loading}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Flow Area */}
            <div className="d-flex flex-column flex-grow-1 position-relative flow-area">
              <ReactFlowProvider>
                <div className="flex-grow-1 flow-reactflow">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeContextMenu={onNodeContextMenu}
                    fitView={false}
                    minZoom={0.3}
                    maxZoom={1.2}
                    className="bg-light rounded-4 border shadow-sm"
                  />
                </div>
              </ReactFlowProvider>
            </div>
          </Card.Body>

          <Card.Footer className="py-2 bg-light border-top">
            <div className="d-flex align-items-center justify-content-between gap-2">
              {/* Sol taraf - Kısa bilgi */}
              <div className="d-flex align-items-center gap-2 justify-content-center w-100">
                <span className="icon-tip">💡</span>
                <span className="text-muted info-text">
                  Sürükle-bırak ile akış oluştur • Sağ tık ile sil
                </span>
                <span className="text-secondary info-count">
                  {nodes.length} adım • {edges.length} bağlantı
                </span>
              </div>

              {/* Sağ taraf - Butonlar */}
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={onHide}
                  className="btn-sm btn-footer"
                >
                  Vazgeç
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!name.trim() || loading}
                  className="btn-sm btn-footer"
                >
                  {loading ? <Spinner size="sm" /> : 'Kaydet'}
                </Button>
              </div>
            </div>

            {note && (
              <div className="mt-1">
                <span className="text-muted info-note">
                  <span className="fw-semibold">Not:</span> {note}
                </span>
              </div>
            )}
          </Card.Footer>
        </Card>
      </Modal>
    </>
  );
};

export default FlowBuilder;