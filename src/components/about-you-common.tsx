import React, { useState } from 'react';

type Props = {
  vm: {
    profile: {
      type: string;
      loginDetail: {
        username: string;
      };
      residencyCode: number;
    };
    summaryStep: string;
    isCollapsed: boolean;
    principalName: string;
    myInfoSelected: boolean;
    lastName: string;
    firstName: string;
    givenName: string;
    reqType: string;
    gender: string;
    dob: string;
    nric: string;
    showMediSave: boolean;
    residentialStatusDesc: string;
    nationalityDesc: string;
    passTypeDesc: string;
    passStatus: string;
    passExpiryDate: string;
    isValidMobileNo: boolean;
    idd: string;
    number: string;
    isValidEmail: boolean;
    email: string;
    aboutYouQuestions: any[];
    aboutYouQ: any;
    questionnaireCat: any;
    reqType: string;
    partnerChannel: string;
    productName: string;
  };
  setStep: () => void;
  validateInput: (type: string, value: string, idd?: string) => void;
  howCollectDataModal: () => void;
  validateForm: () => void;
};

const AboutYou: React.FC<Props> = (props) => {
  const { vm, setStep, validateInput, howCollectDataModal, validateForm } = props;

  return (
    <div id={`${vm.profile.type}-about-you`}>
      {/* Rest of your code */}
    </div>
  );
};

export default AboutYou;
