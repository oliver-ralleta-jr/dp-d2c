Sure! Here's the updated code in a React functional component (.tsx) file:

```tsx
import React, { useState } from 'react';

const UploadReview: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [summaryEdit, setSummaryEdit] = useState('EDIT');
  const [uploadFailed, setUploadFailed] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [itemList, setItemList] = useState([]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleEdit = () => {
    setSummaryEdit('EDIT');
  };

  const uploadImage = (item, index) => {
    // Handle upload logic here
  };

  const deleteImage = (item, index) => {
    // Handle delete logic here
  };

  return (
    <div id="upload-review" className="upload-box">
      <div className={`common-box-header ${isCollapsed ? 'isCollapse' : ''}`}>
        <div className="row">
          <div className="col-xs-10">
            <h1>Upload your documents</h1>
          </div>
          <div className="col-xs-2">
            <a href="#" onClick={handleCollapse}>
              <span
                className={`pull-right collapse-icon glyphicon ${
                  isCollapsed ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'
                }`}
              ></span>
            </a>
          </div>
        </div>
      </div>
      <div className="common-box-content upload-box-content" style={{ display: summaryEdit === 'EDIT' ? 'block' : 'none' }}>
        <div className="common-main-content">
          <div className="common-sub-box">
            <div className="upload-tool-tip">
              <p className="tip-header">Document Requirements</p>
              <div className="row">
                <div className="col-xs-2 selfie-image">
                  <img src="assets/images/selfie-image.png" alt="Selfie Image" />
                </div>
                <div className="col-md-3 col-xs-5 bordered-right">
                  <p className="grey-text">Accepted file formats</p>
                  <p className="bold-text">PNG, GIF, JPG</p>
                </div>
                <div className="col-md-3 col-xs-5">
                  <p className="grey-text">Maximum file size</p>
                  <p className="bold-text">4MB</p>
                </div>
              </div>
              <br />
              <p className="grey-text">{!existingCustomer && residencyCode !== 3 ? 'For Selfie with front of NRIC' : 'For Selfie with Front of employment / dependent pass'}</p>
              <p className="bold-text">{!existingCustomer && residencyCode !== 3 ? 'To verify your NRIC, please ensure the following is captured:' : 'To verify your Employment / Dependent pass, please ensure the following is captured:'}</p>
              <div className="row">
                <div className="col-xs-12">
                  <ul className="list-entry">
                    {!existingCustomer && residencyCode !== 3 ? (
                      <>
                        <li>Take a photo of your fullface while holding the front of your NRIC card. Make sure that the photo on your NRIC is also visible.</li>
                        <li>Ensure that facial features and NRIC are clearly evident in the photo.</li>
                        <li>Photograph must be taken within the last