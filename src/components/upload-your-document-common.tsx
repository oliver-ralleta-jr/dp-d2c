import React, { useState } from 'react';

const UploadDocuments: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`upload-box details-common ${isCollapsed ? 'common-details-box' : ''}`}>
      <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`} style={{ display: 'flex' }}>
        <div className="col-xs-10">
          <h1>Upload your documents</h1>
        </div>
        <div className="col-xs-2" style={{ display: 'flex' }}>
          <a
            className={`isCollapse ${isCollapsed ? 'isCollapse' : ''}`}
            id="uploadDocCommonHide"
            name="uploadDocCommonHide"
            href="#"
            onClick={handleCollapse}
          >
            <span
              className={`pull-right collapse-icon glyphicon ${isCollapsed ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'}`}
            ></span>
          </a>
        </div>
      </div>
      <div className={`common-box-content uploadsection ${isCollapsed ? 'isCollapse' : ''}`}>
        <div className={`common-main-content ${isCollapsed ? 'common-details-box' : 'combine-padding'}`}>
          <div className="common-sub-box">
            {/* Rest of the code */}
          </div>
        </div>
      </div>
      <div className="btn-box text-right" style={{ display: 'flex' }}>
        <button
          id="btnNextToReview"
          name="btnNextToReview"
          title="btnNextToReview"
          className="btn detail-submit-btn"
          disabled={false} // Replace with your condition
          onClick={() => {}}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default UploadDocuments;
