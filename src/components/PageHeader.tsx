import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  title: string;
  icon?: IconDefinition;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, subtitle }) => {
  return (
    <div
      className="page-banner d-flex align-items-center px-3 py-2 mb-4 shadow-sm"
      style={{
        background: 'rgb(111, 66, 193)',
        color: 'white',
        borderRadius: '0 0 10px 10px',
        fontSize: '0.95rem',
      }}
    >
      {icon && (
        <span
          className="me-2"
          style={{
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </span>
      )}
      <div>
        <div className="fw-semibold" style={{ fontSize: '1rem', marginBottom: 0 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
