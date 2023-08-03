import React, { useState } from 'react';

type Choice = {
  label: string;
};

type Props = {
  radioLabel: string;
  radioChoices: Choice[];
};

const RadioEditReview: React.FC<Props> = ({ radioLabel, radioChoices }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const handleEditAction = () => {
    setEditMode(true);
  };

  const handleChoiceSelection = (choice: Choice) => {
    setSelectedChoice(choice);
  };

  return (
    <div className="radio-edit-review">
      {/* error message */}
      {editMode && (
        <p className="error-msg">{/* error message content */}</p>
      )}

      {/* edit mode */}
      {editMode && (
        <div className="choice-content">
          <div className="box-label">
            <label className="radio-form-title">{radioLabel}</label>
          </div>
          {radioChoices.map((choice) => (
            <div
              className={`${
                radioChoices.length > 2 ? 'checkbox-choice' : 'box-choice'
              }`}
              key={choice.label}
              name={choice.label}
            >
              <div
                className={`uncheck-radio-box ${
                  !selectedChoice || selectedChoice.label !== choice.label
                    ? 'marked'
                    : ''
                }`}
                onClick={() => handleChoiceSelection(choice)}
              >
                <span className="label-img" />
                <span className="label-text text-capitalize">
                  {choice.label.toLowerCase()}
                </span>
              </div>
              <div
                className={`checked-radio-box ${
                  selectedChoice && selectedChoice.label === choice.label
                    ? 'marked'
                    : ''
                }`}
                onClick={() => handleChoiceSelection(choice)}
              >
                <div className="label-img-checked">
                  <span className="img-loop" />
                  <span className="img-circle" />
                </div>
                <span className="label-text text-capitalize">
                  {choice.label.toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* review mode */}
      {!editMode && (
        <div className="radio-review-content">
          <label className="radio-form-title">{radioLabel}</label>
          <span
            className="edit-pencil"
            onClick={handleEditAction}
          >
            <img src="assets/images/svg/edit.svg" alt="Edit" />
          </span>
          <p className="answer-text" name={selectedChoice?.label || 'N/A'}>
            {selectedChoice?.label || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RadioEditReview;
