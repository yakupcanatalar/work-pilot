import React from 'react';
import TaskStageDto from '../dtos/TaskStageDto';
import '../App.css'; // Import the CSS file

interface StageFlowProps {
  stages?: TaskStageDto[];
  currentStageId?: number | string;
}

const StageFlow: React.FC<StageFlowProps> = ({ stages = [], currentStageId }) => {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-muted">
        Aktif aşama bulunmamaktadır.
      </div>
    );
  }

  const getCurrentStageIndex = () => {
    if (!currentStageId) return -1;
    return stages.findIndex(stage => stage.id === currentStageId);
  };

  const currentIndex = getCurrentStageIndex();
  const isCompleted = currentIndex === stages.length - 1;

  const getStageClassName = (index: number) => {
    if (isCompleted) return 'stage-box completed-stage';
    if (currentIndex === -1) return 'stage-box future-stage';

    if (index < currentIndex) return 'stage-box past-stage';
    if (index === currentIndex) return 'stage-box current-stage';
    return 'stage-box future-stage';
  };

  const getArrowClassName = (index: number) => {
    if (isCompleted) return 'arrow completed-arrow';
    if (currentIndex === -1) return 'arrow future-arrow';

    if (index < currentIndex) return 'arrow past-arrow';
    if (index === currentIndex) return 'arrow current-arrow';
    return 'arrow future-arrow';
  };

  return (
    <div className="stage-flow-container">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id || index}>
          <div className={`stage-box ${getStageClassName(index)}`}>
            <div className="stage-name">
              {stage.name}
            </div>
          </div>
          {index !== stages.length - 1 && (
            <div className={`arrow ${getArrowClassName(index)}`}>
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StageFlow;