import React, { useCallback, useRef } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes = [
  { type: "start", label: "Başlangıç", style: { background: "#1677ff", color: "#fff" } },
  { type: "approve", label: "Onay", style: { background: "#fff", color: "#333", border: "1px solid #bbb" } },
  { type: "reject", label: "Red", style: { background: "#fff", color: "#333", border: "1px solid #bbb" } },
  { type: "info", label: "Bilgi Toplama", style: { background: "#fff", color: "#333", border: "1px solid #bbb" } },
  { type: "complete", label: "Tamamlama", style: { background: "#52c41a", color: "#fff" } },
];

function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside style={{ width: 250, padding: 16, background: "#f4f4fa", borderRadius: 8, marginRight: 16 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Standart Adımlar</div>
        {nodeTypes.map((n) => (
          <div
            key={n.type}
            onDragStart={(e) => onDragStart(e, n.type)}
            draggable
            style={{
              ...n.style,
              padding: "8px 16px",
              borderRadius: 6,
              marginBottom: 8,
              cursor: "grab",
              display: "inline-block",
              fontWeight: n.type === "start" || n.type === "complete" ? 600 : 400,
            }}
          >
            {n.label}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Görev Aşamaları</div>
        <div style={{ background: "#fff", borderRadius: 6, padding: 8, color: "#888" }}>
          Henüz aşama eklenmemiş.
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Akış Bilgileri</div>
        <input placeholder="Akış adı giriniz" style={{ width: "100%", marginBottom: 8, padding: 6, borderRadius: 4, border: "1px solid #ccc" }} />
        <div style={{ fontSize: 13, color: "#888" }}>Toplam Adım: 0 Toplam Bağlantı: 0</div>
      </div>
    </aside>
  );
}

interface FlowBuilderProps {
  show: boolean;
  handleClose: () => void;
  onSave: (flowData: { nodes: any[]; edges: any[] }) => void;
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ show, handleClose, onSave }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const nodeId = `${type}_${+new Date()}`;
      const nodeLabel = nodeTypes.find((n) => n.type === type)?.label || type;

      setNodes((nds) => {
        const newNodes = nds.concat({
          id: nodeId,
          type: "default",
          position,
          data: { label: nodeLabel },
        });

        // Otomatik bağlantı için bir önceki node ile yeni node'u bağla
        if (nds.length > 0) {
          setEdges((eds) =>
            eds.concat({
              id: `e${nds[nds.length - 1].id}-${nodeId}`,
              source: nds[nds.length - 1].id,
              target: nodeId,
              type: "default",
            })
          );
        }

        return newNodes;
      });
    },
    [setNodes, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSave = () => {
    onSave({ nodes, edges });
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const handleModalClose = () => {
    handleClose();
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered size="xl">
      <Card className="shadow-sm m-0">
        <Card.Header>
          <h5 className="mb-0">Yeni İş Akışı Oluştur</h5>
        </Card.Header>
        <Card.Body style={{ background: "#f8f9fb", borderRadius: 8 }}>
          <ReactFlowProvider>
            <div style={{ display: "flex", height: "70vh", background: "#fff", borderRadius: 8 }}>
              <Sidebar />
              <div
                ref={reactFlowWrapper}
                style={{ flex: 1, height: "100%", background: "#fafafd", borderRadius: 8, border: "1px solid #eee" }}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                >
                  <Background gap={16} size={1} color="#eee" />
                  <MiniMap />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </ReactFlowProvider>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleModalClose}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Kaydet
          </Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};

export default FlowBuilder;