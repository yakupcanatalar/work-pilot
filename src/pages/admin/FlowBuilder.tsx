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
import { useTaskStageService } from '../../services/TaskStage';
import '../../assets/styles/flow.css';
import TaskStageDto from '../../dtos/TaskStageDto';
import TaskDto from '../../dtos/TaskDto';

interface FlowBuilderProps {
  show: boolean;
  onHide: () => void;
  onSave: (flowData: { name: string; note: string; stages: TaskStageDto[] }) => Promise<void>;
  task?: TaskDto | null;
}

function getOrderedStageIds(nodes: Node[], edges: Edge[]): number[] {
  if (nodes.length === 0) return [];
  const targetIds = edges.map(e => e.target);

  let startNode = nodes.find(n => !targetIds.includes(n.id));
  if (!startNode) startNode = nodes[0];

  const order: number[] = [];
  let current: Node | undefined = startNode;
  while (current) {
    order.push(current.data.stageId);
    const nextEdge: Edge | undefined = edges.find(e => e.source === current?.id);
    if (!nextEdge) break;
    current = nodes.find(n => n.id === nextEdge.target);
  }
  return order;
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ show, onHide, onSave, task }) => {
  const {
    getAllTaskStages,
    createTaskStage,
    deleteTaskStage,
  } = useTaskStageService();

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [availableStages, setAvailableStages] = useState<TaskStageDto[]>([]);
  const [selectedStageIds, setSelectedStageIds] = useState<number[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newStageNote, setNewStageNote] = useState('');

  const loadTaskStages = async () => {
    try {
      const stages = await getAllTaskStages();
      setAvailableStages(stages);
    } catch (error) {
      console.error('Error loading task stages:', error);
    }
  };

  const createSequentialEdges = (nodeList: Node[]): Edge[] => {
    const edgeList: Edge[] = [];
    for (let i = 0; i < nodeList.length - 1; i++) {
      edgeList.push({
        id: `edge-${nodeList[i].id}-${nodeList[i + 1].id}`,
        source: nodeList[i].id,
        target: nodeList[i + 1].id,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true,
      });
    }
    return edgeList;
  };

  useEffect(() => {
    if (show) {
      loadTaskStages();

      if (task) {
        setName(task.name || '');
        setNote(task.note || '');

        const stageIds = task.stages?.map(stage => stage.id).filter((id): id is number => id !== undefined) || [];
        setSelectedStageIds(stageIds);

        if (task.stages && task.stages.length > 0) {
          const taskNodes: Node[] = task.stages.map((stage, index) => ({
            id: `node-${stage.id}`,
            type: 'default',
            position: {
              x: 200 + (index * 200),
              y: 100,
            },
            data: {
              label: stage.name,
              stageId: stage.id
            },
          }));

          setNodes(taskNodes);
          setEdges(createSequentialEdges(taskNodes));
        } else {
          setNodes([]);
          setEdges([]);
        }
      } else {
        setName('');
        setNote('');
        setSelectedStageIds([]);
        setNodes([]);
        setEdges([]);
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

      const stageData = event.dataTransfer.getData('application/reactflow');
      if (!stageData) return;

      const { stageName, stageId } = JSON.parse(stageData);

      const basePosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = `node-${stageId}`;

      const existingNode = nodes.find(node => node.data.stageId === stageId);
      if (existingNode) {
        alert('Bu aşama zaten eklenmiş!');
        return;
      }

      const newNode: Node = {
        id: newNodeId,
        type: 'default',
        position: {
          x: basePosition.x,
          y: basePosition.y,
        },
        data: {
          label: stageName,
          stageId: stageId
        },
      };

      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        setEdges(createSequentialEdges(updatedNodes));
        return updatedNodes;
      });

      setSelectedStageIds(prev => [...prev, stageId]);
    },
    [reactFlowInstance, nodes, setNodes, setEdges]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (window.confirm('Bu aşamayı silmek istediğinize emin misiniz?')) {
        const stageId = node.data.stageId;

        setNodes((nds) => {
          const filteredNodes = nds.filter((n) => n.id !== node.id);
          setEdges(createSequentialEdges(filteredNodes));
          return filteredNodes;
        });

        setSelectedStageIds(prev => prev.filter(id => id !== stageId));
      }
    },
    [setNodes, setEdges]
  );

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
      await loadTaskStages();
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

        setSelectedStageIds(prev => prev.filter(id => id !== stageId));

        setNodes((nds) => {
          const filteredNodes = nds.filter((n) => n.data.stageId !== stageId);
          setEdges(createSequentialEdges(filteredNodes));
          return filteredNodes;
        });
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
      const orderedStageIds = getOrderedStageIds(nodes, edges);

      await onSave({
        name: name.trim(),
        note: note.trim(),
        stages: availableStages
          .filter(stage => stage.id !== undefined && orderedStageIds.includes(stage.id as number))
          .sort(
            (a, b) =>
              orderedStageIds.indexOf(a.id as number) -
              orderedStageIds.indexOf(b.id as number)
          ),
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
                                const stageData = JSON.stringify({
                                  stageName: stage.name,
                                  stageId: stage.id
                                });
                                e.dataTransfer.setData(
                                  'application/reactflow',
                                  stageData
                                );
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              className={`stage-rect ${stage.id !== undefined && selectedStageIds.includes(stage.id) ? 'selected' : ''}`}
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
              <div className="d-flex align-items-center gap-2 justify-content-center w-100">
                <span className="icon-tip">💡</span>
                <span className="text-muted info-text">
                  Sürükle-bırak ile akış oluştur • Sağ tık ile sil
                </span>
                <span className="text-secondary info-count">
                  {nodes.length} adım • Sıralı bağlantı
                </span>
              </div>

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