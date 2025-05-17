import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  title: string;
  icon?: IconDefinition;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon }) => {
  return (
    <div className="page-header d-flex flex-column justify-content-center align-items-center mb-4">
      <div className="d-flex align-items-center">
      {icon && <FontAwesomeIcon icon={icon} className="me-2 text-primary fs-4" />}
      <h1 className="page-title m-0">{title}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
