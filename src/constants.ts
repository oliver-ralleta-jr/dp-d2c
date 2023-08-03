import * as enums from './modules/_Cores/constants';
import * as configs from './modules/_Cores/configs';

/* tslint:disable */
var browser = require('detect-browser');

var normalWarningText = 'You are required to disclose, fully and faithfully, all the facts which you know or ought to know relating to this application. Otherwise you may not be able to claim anything under this policy, and/or the policy may be cancelled.';

module.exports = {

  crossBorderMsg: {
    foreignResidentialAddress: 'You have entered residential address that is outside of Singapore. Please confirm this is your current residential address?',
    foreignIdentification: 'You have entered non Singapore NRIC/FIN. Please confirm this is your current ID?',
    foreignContactNumber: 'You have entered non Singapore mobile number. Please confirm this is your current mobile number?'
  },

  browserName: browser && browser.name || null,

  V2UX: {
    products: ['PS', 'PER', 'PARW', 'PC', 'PAT'],
    PS: {
      hasStickyHelp: true
    },
    PER: {
      hasStickyHelp: false
    },
    PARW: {
      hasStickyHelp: true
    },
    PC: {
      hasStickyHelp: false
    },
    PAT: {
      hasStickyHelp: false
    }
  },

  V2UXColorOnly: {
   products: ['PA', 'PAS', 'PM', 'PL', 'PT']
  },

  // control whether console.log is on or off
  // but will be overwritten by utils.initialConsoleLog() in main.js
  isConsoleLogOn: true,
  debugMode: true,
  useMock: true,
  message: {
    eitherMsg: 'Please select either of them',
    notDate: 'This is not valid date!',
    noValue: 'This is a required field',
    notNumber: 'You should enter only number!',
    selAtLeastOne: 'Please select an option(s)!',
    addressChangeMsg: 'My residential address has not changed from the above',
    invalidTIN: 'This is an invalid TIN number',
    invalidOccupation: 'Please select occupation from dropdown list'
  },

  DPIproduct: {
    [enums.PRODUCT.PT.TYPE]: true,
  },

  // name: present productName
  // proInfo: retrieve product info by this key
  // gender: to determine gender by product, or by user's choice
  // confirmationPath: the confirmation route
  production: {
    PA: {
      shortName: enums.PRODUCT.PA.TYPE,
      globalClass: 'v2ux-container',
      confirmName: 'Personal Accident',
      themeColor: 'v2ux-color',
      name: 'PRUPersonal Accident',
      prodCode: 'PAU',
      anbRange: {
        maxAnb: 65,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'XAD8',
          componentList: ['XAD8', 'PAFE', 'XHI1']
        },
        elder: {
          basic: 'XAD9',
          componentList: ['XAD9', 'PAFE', 'XHI2']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDFForPA',
      corporateSite: 'app.paEntry',
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY03305', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY011', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY026', 'QMAY027'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {},
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUPersonal Accident Policy Contract',
        fileUrl: 'pdf/PRUpersonal_accident_Policy_Contract.pdf',
        fileName: 'PRUpersonal_accident_Policy_Contract.pdf'
      }],
      warningText: normalWarningText,
      noteText: '<span>NOTE:</span> (1) With regards to PRUPersonal Accident, no claims are payable for any accident caused directly by any pre-existing medical conditions. (2) In the case of Fracture Care PA, '
        + 'no claims are payable for any injury, fracture or dislocation caused either directly or indirectly by any medical condition including but not limited to osteoporosis or bone disease and/or its treatment.',
      footNote: ['This is only product information provided by Prudential. You should seek advice from a qualified financial advisor if in doubt. Buying health insurance products that are not suitable for you may impact your ability to finance your future healthcare needs.',
        'All benefits will only be payable upon an accident occuring.',
        'Public transport refers to MRT, buses, taxis, airplanes, ferries.',
        'Public transport excludes travelling as a fare-paying passenger in a vehicle (excluding taxis) driven by an individual who uses his/her personal vehicle or leases a vehicle as a driver partner with ride-sharing app companies.',
        'Building fires refer to fire at home, in a theatre, hotel, public auditorium, school, hospital (including community hospitals) or shopping mall provided the life assured was present within the premises at the start of the fire.',
        'Premiums listed are non-guaranteed.',
        'Premiums are inclusive of the prevailing GST.',
        'The information on this website is for reference only and is not a contract of insurance. Please refer to the exact terms and conditions, specific details and exclusions applicable to these insurance products in the policy documents.'
      ]
    },
    PAT: {
      shortName: enums.PRODUCT.PAT.TYPE,
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      themeFont: 'v2ux-font',
      docId: 'id_prod_lt5',
      confirmName: 'Active Term',
      name: 'PRUActive Term',
      prodCode: 'LT5',
      anbRange: {
        maxAnb: 75,
        minAnb: 18
      },
      anbHelpMessage: {
        maxAnb: 'Customer >75ANB is interested in PRUActive Term.  Please follow up.',
        minAnb: 'Customer <18ANB is interested in PRUActive Term.  Please follow up.'
      },
      component: {
        common: {
          basic: 'TLTL',
          componentList: ['TLTL']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.patEntry',
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY018', 'QMAY02404']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: []
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        name: 'PRUActive Term Cover Page, Product Summary and Policy Illustration',
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUActive Term Policy Document',
        fileUrl: 'pdf/PRUActive_Term_Policy_Document.pdf',
        fileName: 'PRUActive_Term_Policy_Document.pdf'
      }, {
        cat: 'Terms_and_Conditions_eContract_eCorrespondence_DP',
        displayName: 'Terms and conditions governing Policy Document and/or electronic correspondence',
        fileUrl: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
        fileName: 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf'
      }],
      policyContractPdf: [{
        cat: 'Policy_Contract_PruActive_Term',
        displayName: 'Policy Contract',
        fileUrl: 'pdf/PRUActive_Term_Policy_Document.pdf',
        fileName: 'PRUActive_Term_Policy_Document.pdf'
      }],
      productSummaryPdf: [{
        cat: 'Product_Summary_PruActive_Term',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUActive_Term_Product_Summary.pdf',
        fileName: 'PRUActive_Term_Product_Summary.pdf'
      }],
      warningText: normalWarningText,
      footNote : 'This is only product information provided by us. You should seek advice from a qualified Financial Consultant if in doubt. Buying life insurance products that are not suitable for you may impact your ability to finance your future insurance needs.<br><br>As this product has no savings or investment feature, there is no cash value if the policy ends or if the policy is terminated prematurely.<br><br>There are certain conditions such as pre-existing conditions, whereby no benefits will be payable. These are stated as exclusions in the contract. Please refer to the relevant policy documents for details.<br><br>The information contained on this website is intended to be valid in Singapore only and shall not be construed as an offer to sell or solicitation to buy or provision of any insurance product outside Singapore.<br><br>This policy is protected under the Policy Owners\' Protection Scheme which is administered by the Singapore Deposit Insurance Corporation (SDIC). Coverage for your policy is automatic and no further action is required from you. For more information on the types of benefits that are covered under the scheme as well as the limits of coverage, where applicable, please contact your insurer or visit the GIA/LIA or SDIC web-sites (<a target="_blank" href="https://www.gia.org.sg">www.gia.org.sg</a> or <a target="_blank" href="https://www.lia.org.sg">www.lia.org.sg</a> or <a target="_blank" href="https://www.sdic.org.sg">www.sdic.org.sg</a>).<br><br>Information is correct as at 12/11/2020.<br><br>This advertisement has not been reviewed by the Monetary Authority of Singapore.',
      helpQuestions: {
        findMore: {
          label: 'I would like to find out more about:',
          options: [
            { name: 'PRUActive Term Benefits' },
            { name: 'PRUActive Term pricing' },
            { name: 'Purchasing PRUActive Term for my dependants' },
            { name: 'Payment Options' },
          ]
        }
      },
      flowQuestions: {
        'healthDeclaration': {
          questionnaireId: 'ECGHQ_HD',
          label: 'Do you have any changes to your health since your last underwritten policy? Any life or health insurance that are pending, deferred, declined or accepted at special rates, nor have made any major claims for disability or critical illness, with this or any other insurance company?',
          yes: 'Yes',
          no: 'No',
          leadgenOn: 'true',
          message: '',
          continueTo: '',
          leadgenAnswer: 'Yes'
        }
      }
    },
    PC: {
      shortName: enums.PRODUCT.PC.TYPE,
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      themeFont: 'v2ux-font',
      docId: 'id_prod_can',
      confirmName: 'Cancer 360',
      name: 'PRUCancer 360',
      prodCode: 'CAN',
      anbRange: {
        maxAnb: 65,
        minAnb: 17
      },
      anbHelpMessage: {
        maxAnb: 'Customer >65ANB is interested in PRUCancer 360.  Please follow up.',
        minAnb: 'Customer <17ANB is interested in PRUCancer 360.  Please follow up.'
      },
      component: {
        common: {
          basic: 'CAN3',
          componentList: ['CAN3']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.pcEntry',
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY036', 'QMAY033', 'QMAY034'],
        paymentQ: ['QMAY036'],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY018', 'QMAY02404']
      },
      healthQuestion: {
        cat: 'QPS',
        catList: ['QGH'],
        redirectToAgentQs: ['V2QGHCAN1']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        name: 'PRUCancer 360 Cover Page, Product Summary and Policy Illustration',
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUCancer 360 Policy Document',
        fileUrl: 'pdf/PRUCancer_360_Policy_Document.pdf',
        fileName: 'PRUCancer_360_Policy_Document.pdf'
      }, {
        cat: 'Terms_and_Conditions_eContract_eCorrespondence_DP',
        displayName: 'Terms and conditions governing Policy Document and/or electronic correspondence',
        fileUrl: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
        fileName: 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf'
      }],
      policyContractPdf: [{
        cat: 'Policy_Contract_PruCancer_360',
        displayName: 'Policy Contract',
        fileUrl: 'pdf/PRUCancer_360_Policy_Document.pdf',
        fileName: 'PRUCancer_360_Policy_Document.pdf'
      }],
      productSummaryPdf: [{
        cat: 'Product_Summary_PruCancer_360',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PruCancer_360_Product_Summary.pdf',
        fileName: 'PruCancer_360_Product_Summary.pdf'
      }],
      warningText: normalWarningText,
      footNote : 'This is only product information provided by us. You should seek advice from a qualified Financial Consultant if in doubt.<br><br>As this product has no savings or investment feature, there is no cash value if the policy ends or if the policy is terminated prematurely. Premiums are not guaranteed and may be adjusted based on future claims experience.<br><br>Buying health insurance products that are not suitable for you may impact your ability to finance your future healthcare needs. Before replacing an existing accident and health policy with a new one, you should consider whether the switch is detrimental, as there may be potential disadvantages with switching and the new policy may cost more or have fewer benefits at the same cost.<br><br>There are certain conditions such as pre-existing conditions, whereby no benefits will be payable. These are stated as exclusions in the contract. Please refer to the relevant policy contract for details.<br><br>These policies are protected under the Policy Owners\' Protection Scheme which is administered by the Singapore Deposit Insurance Corporation (SDIC). Coverage for your policy is automatic and no further action is required from you. For more information on the types of benefits that are covered under the scheme as well as the limits of coverage, where applicable, please contact your insurer or visit the GIA/LIA or SDIC web-sites (<a target="_blank" href="https://www.gia.org.sg">www.gia.org.sg</a> or <a target="_blank" href="https://www.lia.org.sg">www.lia.org.sg</a> or <a target="_blank" href="https://www.sdic.org.sg">www.sdic.org.sg</a>).<br><br>This advertisement has not been reviewed by the Monetary Authority of Singapore.',
      helpQuestions: {
        findMore: {
          label: 'I would like to find out more about:',
          options: [
            { name: 'PRUCancer 360 Benefits' },
            { name: 'Payment Options' },
            { name: 'PRUCancer 360 Benefits pricing' },
            { name: 'Purchasing PRUCancer 360 Benefits for my dependents' },
          ]
        }
      },
      flowQuestions: {
        'landingPage': {
          questionnaireId: '',
          label: '',
          yes: '',
          no: '',
          leadgenOn: '',
          message: 'The online purchase is applicable for ages 17 - 65 only, if your next birthday age <17 or >65, please provide us with the following information so that we can get in touch with you.',
          continueTo: '',
          leadgenAnswer: ''
        }
      }
    },
    PS: {
      shortName: enums.PRODUCT.PS.TYPE,
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      themeFont: 'v2ux-font',
      confirmName: 'Shield',
      name: 'PRUShield',
      docId: 'id_prod_spm1',
      discountAnb: 100,
      discountResidency: [1, 2, 3],
      residencyConfig: {
        'C': {
          prodCode: 'PM1',
          docId: 'id_prod_pm1',
          anbRange: {
            maxAnb: 75,
            minAnb: 21
          },
          productsConfig: [
            {
              displayName: 'Standard',
              productCode: 'standard',
              cashCode: 'PMT2',
              medisaveCode: 'PMT1',
              subProducts: [],
            },
            {
              displayName: 'Plus',
              productCode: 'plus',
              cashCode: 'PMP2',
              medisaveCode: 'PMP1',
              subProducts: ['PMB5','PMB8']
            },
            {
              displayName: 'Premier',
              productCode: 'premier',
              badge: 'Most Popular',
              cashCode: 'PMR2',
              medisaveCode: 'PMR1',
              subProducts: ['PMB4', 'PMB7', 'PMB6']
            }
          ]
        },
        'F1': {
          prodCode: 'PM2',
          docId: 'id_prod_pm2',
          anbRange: {
            maxAnb: 75,
            minAnb: 21
          },
          productsConfig: [
            {
              displayName: 'Plus',
              productCode: 'plus',
              cashCode: 'PAP2',
              medisaveCode: 'PAP1',
              subProducts: ['PAB5','PAB8']
            },
            {
              displayName: 'Premier',
              productCode: 'premier',
              badge: 'Most Popular',
              cashCode: 'PAR2',
              medisaveCode: 'PAR1',
              subProducts: ['PAB4','PAB7','PAB6']
            }
          ]
        },
        'F2': {
          prodCode: 'PMB',
          docId: 'id_prod_pmb',
          anbRange: {
            maxAnb: 75,
            minAnb: 1
          },
          productsConfig: [
            {
              displayName: 'Plus',
              productCode: 'plus',
              cashCode: 'PFP2',
              medisaveCode: 'PFP1',
              subProducts: ['PFB5','PFB8']
            },
            {
              displayName: 'Premier',
              productCode: 'premier',
              badge: 'Most Popular',
              cashCode: 'PFR2',
              medisaveCode: 'PFR1',
              subProducts: ['PFB4','PFB7','PFB6']
            }
          ]
        }
      },
      scbChannelConfig: {
        residencyConfig: {
          'C': {
            prodCode: 'PM1',
            docId: 'id_prod_pm1',
            anbRange: {
              maxAnb: 75,
              minAnb: 21
            },
            productsConfig: [
              {
                displayName: 'Plus',
                productCode: 'plus',
                cashCode: 'PMP2',
                medisaveCode: 'PMP1',
                subProducts: ['PMB5']
              },
              {
                displayName: 'Premier',
                productCode: 'premier',
                badge: 'Most Popular',
                cashCode: 'PMR2',
                medisaveCode: 'PMR1',
                subProducts: ['PMB4', 'PMB7', 'PMB6']
              }
            ]
          },
          'F1': {
            prodCode: 'PM2',
            docId: 'id_prod_pm2',
            anbRange: {
              maxAnb: 75,
              minAnb: 21
            },
            productsConfig: [
              {
                displayName: 'Plus',
                productCode: 'plus',
                cashCode: 'PAP2',
                medisaveCode: 'PAP1',
                subProducts: ['PAB5']
              },
              {
                displayName: 'Premier',
                productCode: 'premier',
                badge: 'Most Popular',
                cashCode: 'PAR2',
                medisaveCode: 'PAR1',
                subProducts: ['PAB4','PAB7']
              }
            ]
          },
          'F2': {
            prodCode: 'PMB',
            docId: 'id_prod_pmb',
            anbRange: {
              maxAnb: 75,
              minAnb: 1
            },
            productsConfig: [
              {
                displayName: 'Plus',
                productCode: 'plus',
                cashCode: 'PFP2',
                medisaveCode: 'PFP1',
                subProducts: ['PFB5']
              },
              {
                displayName: 'Premier',
                productCode: 'premier',
                badge: 'Most Popular',
                cashCode: 'PFR2',
                medisaveCode: 'PFR1',
                subProducts: ['PFB4','PFB7']
              }
            ]
          }
        },
      },
      summaryConfig: {
        'standard': {
          title: 'Why choose this?',
          details: [
            {
              text: 'Public Hospitals'
            },
            {
              text: '4 Bedded Ward'
            },
            {
              text: 'Choice of Doctor from Public Hospitals'
            }
          ],
          viewmore: {
            heading: 'Standard',
            roomandboard: '$1,700',
            icu: '$2,900',
            surgicalbenefits: '$590 - $21,840',
            surgicalimplants: '$9,800',
            cancertreatment: '$5,200 per month / $880 - $6,210 per treatment',
            renaldialysis: '$3,740 per month',
            prehospital: 'Not Covered',
            posthospital: 'Not Covered',
            annuallimit: '$200,000',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: '$1,500 - $3,000',
            coinsurance: '10%',
            tooltip: {
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 80.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Standard and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Standard, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          },
          viewmoremodified: {
            heading: 'Standard',
            roomandboard: 'Room & Board coverage of <strong>$1,700</strong>',
            icu: 'ICU coverage of <strong>$2,900</strong>',
            surgicalbenefits: 'Surgical Benefits coverage of <strong>$590 - $21,840</strong>',
            surgicalimplants: 'Surgical Implants coverage of <strong>$9,800</strong>',
            cancertreatment: 'Cancer Treatment coverage of <strong>$5,200 per month / $880 - $6,210</strong> per treatment',
            renaldialysis: 'Renal Dialysis coverage of <strong>$3,740</strong> per month',
            prehospital: '',
            posthospital: '',
            annuallimit: 'Annual Claim Limit of <strong>$200,000</strong>',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: 'Deductibles of <strong>$1,500 - $3,000</strong>',
            coinsurance: 'Co-insurance of <strong>10%</strong>',
            tooltip: {
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 80.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Standard and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Standard, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          }
        },
        'plus': {
          title: 'Why choose this?',
          details: [
            {
              text: 'Public Hospitals'
            },
            {
              text: '<strong>Single-bedded Ward</strong>'
            },
            {
              text: 'Choice of Doctor from Public Hospitals'
            }
          ],
          viewmore: {
            heading: 'Plus',
            roomandboard: '',
            icu: '',
            surgicalbenefits: '',
            surgicalimplants: 'As charged',
            cancertreatment: '',
            renaldialysis: '',
            prehospital: 'As charged, 180 days preceding confinement or day surgery',
            posthospital: 'As charged, within 365 days after confinement or day surgery',
            annuallimit: '$600,000',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: '$1,500 - $5,250',
            coinsurance: '10%',
            tooltip: {
              surgicalimplants: 'By the hospital based on the entitled ward or below',
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 85.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Plus and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Plus, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          },
          viewmoremodified: {
            heading: 'Plus',
            roomandboard: 'Coverage for Room & Board, ICU, Surgical Benefits, Surgical Implants, Cancer Treatment and Renal Dialysis (<strong>As Charged</strong>)',
            icu: '',
            surgicalbenefits: '',
            surgicalimplants: '',
            cancertreatment: '',
            renaldialysis: '',
            prehospital: 'Pre-Hospitalisation Treatment for up to 180 days preceding confinement or day surgery (<strong>As Charged</strong>)',
            posthospital: 'Post-Hospitalisation Treatment within 365 days after Confinement or Day Surgery (<strong>As Charged</strong>)',
            annuallimit: 'Annual Claim Limit of <strong>$600,000</strong>',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: 'Deductible of <strong>$1,500 - $5,250</strong>',
            coinsurance: 'Co-insurance of <strong>10%</strong>',
            tooltip: {
              surgicalimplants: 'By the hospital based on the entitled ward or below',
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 85.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Plus and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Plus, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          }
        },
        'premier': {
          title: 'Why choose this?',
          details: [
            {
              text: 'Public + <strong>Private Hospitals</strong>'
            },
            {
              text: '<strong>Single-bedded Ward</strong>'
            },
            {
              text: 'Choice of Doctor from <strong>any Hospital</strong>'
            }
          ],
          viewmore: {
            heading: 'Premier',
            roomandboard: '',
            icu: '',
            surgicalbenefits: '',
            surgicalimplants: 'As charged',
            cancertreatment: '',
            renaldialysis: '',
            prehospital: 'As charged, 180 days preceding confinement or day surgery',
            posthospital: 'As charged, within 365 days after confinement or day surgery',
            annuallimit: '$1,200,000',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: '$1,500 - $5,250',
            coinsurance: '10%',
            tooltip: {
              surgicalimplants: 'By the hospital based on the entitled ward or below',
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 85.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Premier and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Premier, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          },
          viewmoremodified: {
            heading: 'Premier',
            roomandboard: 'Coverage for Room & Board, ICU, Surgical Benefits, Surgical Implants, Cancer Treatment and Renal Dialysis (<strong>As Charged</strong>)',
            icu: '',
            surgicalbenefits: '',
            surgicalimplants: '',
            cancertreatment: '',
            renaldialysis: '',
            prehospital: 'Pre-Hospitalisation Treatment for up to 180 days preceding confinement or day surgery (<strong>As Charged</strong>)',
            posthospital: 'Post-Hospitalisation Treatment within 365 days after Confinement or Day Surgery (<strong>As Charged</strong>)',
            annuallimit: 'Annual Claim Limit of <strong>$1,200,000</strong>',
            coverterm: 'Lifetime Guaranteed Renewability',
            deductible: 'Deductible of <strong>$1,500 - $5,250</strong>',
            coinsurance: 'Co-insurance of <strong>10%</strong>',
            tooltip: {
              surgicalimplants: 'By the hospital based on the entitled ward or below',
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase by 50% depending on ward class when the life assured is above age 85.'
            },
            info: 'The above summary contains only key benefits of Medishield Life and PRUShield Premier and is not exhaustive. For more information, please refer to the Product Summary. For the terms and conditions, specific details, exclusions and waiting periods applicable to PRUShield Premier, please refer to the Policy Contract. Premiums are non-guaranteed and will increase as you get older.'
          }
        },
        'medishield': {
          viewmore: {
            heading: 'Medishield Life',
            roomandboard: '$700 per day',
            icu: '$1,200 per day',
            surgicalbenefits: '$200 - $2,000',
            surgicalimplants: '$7,000',
            cancertreatment: '$3,000 per month / $140 - $1,800 per treatment',
            renaldialysis: '$1,000 per month',
            prehospital: 'Not Covered',
            posthospital: 'Not Covered',
            annuallimit: '$100,000',
            coverterm: 'Lifetime',
            deductible: '$1,500 - $2,500',
            coinsurance: '3 - 10%',
            tooltip: {
              coverterm: 'Renewable every year',
              deductible: 'Deductible will increase to $3000 depending on ward class when the life assured is above age 80.'
            },
          }
        }
      },
      ridersConfig: {
        'PMB4': {
          displayName : 'Extra Premier CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Premier Copay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Premier CoPay premium',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your supplementary plan premium'
            }
          ]

        },
        'PMB5': {
          displayName: 'Extra Plus CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus CoPay</strong>',
          benefits: [
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PMB6': {
          displayName: 'Extra Premier Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Premier Lite Copay</strong>',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PMB8': {
          displayName: 'Extra Plus Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus Lite CoPay</strong>',
          benefits: [
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PMB7': {
          displayName: 'Extra Preferred CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Preferred Copay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Preferred CoPay',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'Private Hospitals under Panel and Non-panel providers',
              tooltip: `
              <div><p>Panel providers under Private Hospital include:</p>
              <ul>
              <li>Registered medical practitioners and specialists;</li>
              <li>Private Hospitals; and</li>
              <li>Private treatment centres, that appear on our approved Panel list on our <a target="_blank" href='http://www.prudential.com.sg/ppc'> website </a></p></li>
              </ul>
              <p>All Restructured Hospitals and treatment centres are also considered as Panel providers.</p>
              <p></p>
              <p>Non-panel provides are private Hospitals and treatment centres listed under Non-panel on our <a target="_blank" href='www.prudential.com.sg/non-ppc'> website </a>.They also include non-participating private specialists operating in private Hospitals listed under Panel on our website. We reserve the right to change this Panel or Non-panel list from time to time.</p></div>`
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your PRUExtra Preferred CoPay premium'
            }
          ]
        },
        'PAB4': {
          displayName : 'Extra Premier CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Premier Copay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Premier CoPay premium',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your PRUExtra Premier CoPay premium'
            }
          ]
        },
        'PAB5': {
          displayName: 'Extra Plus CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus CoPay</strong>',
          benefits: [
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PAB6': {
          displayName: 'Extra Premier Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Premier Lite Copay</strong>',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PAB8': {
          displayName: 'Extra Plus Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus Lite CoPay</strong>',
          benefits: [
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PAB7': {
          displayName: 'Extra Preferred CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Preferred CoPay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Preferred CoPay',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'Private Hospitals under Panel and Non-panel providers',
              tooltip: `
              <div><p>Panel providers under Private Hospital include:</p>
              <ul>
              <li>Registered medical practitioners and specialists;</li>
              <li>Private Hospitals; and</li>
              <li>Private treatment centres, that appear on our approved Panel list on our <a target="_blank" href='http://www.prudential.com.sg/ppc'> website </a></p></li>
              </ul>
              <p>All Restructured Hospitals and treatment centres are also considered as Panel providers.</p>
              <p></p>
              <p>Non-panel provides are private Hospitals and treatment centres listed under Non-panel on our <a target="_blank" href='www.prudential.com.sg/non-ppc'> website </a>.They also include non-participating private specialists operating in private Hospitals listed under Panel on our website. We reserve the right to change this Panel or Non-panel list from time to time.</p></div>`
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your PRUExtra Preferred CoPay premium'
            }
          ]
        },
        'PFB4': {
          displayName : 'Extra Premier CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Premier Copay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Premier CoPay premium',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your PRUExtra Premier CoPay premium'
            }
          ]
        },
        'PFB5': {
          displayName: 'Extra Plus CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus CoPay</strong>',
          benefits: [
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PFB6': {
          displayName: 'Extra Premier Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Premier Lite Copay</strong>',
          benefits: [
            {
              text: 'All Singapore Private Hospitals'
            },
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PFB8': {
          displayName: 'Extra Plus Lite CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra#overview',
          extraInfo: 'For additional information about <strong>PRUExtra Plus Lite CoPay</strong>',
          benefits: [
            {
              text: '<strong>50%</strong> of Deductible covered',
              subText: '(up to $1,750 per policy year)',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            }
          ]
        },
        'PFB7': {
          displayName: 'Extra Preferred CoPay',
          detailsLink: 'https://www.prudential.com.sg/products/medical/pruextra-premier',
          extraInfo: 'Your Renewal premium for <strong>PRUExtra Preferred CoPay</strong> may change based on your claims in the review period of preceding policy year.',
          highlightInfo: 'Get 20% savings on your PRUExtra Preferred CoPay',
          additionalInfo: ' when you have no existing health conditions upon policy inception. Your Renewal Premium may change based on your claims in the review period of preceding policy year. ',
          benefits: [
            {
              text: 'Private Hospitals under Panel and Non-panel providers',
              tooltip: `
              <div><p>Panel providers under Private Hospital include:</p>
              <ul>
              <li>Registered medical practitioners and specialists;</li>
              <li>Private Hospitals; and</li>
              <li>Private treatment centres, that appear on our approved Panel list on our <a target="_blank" href='http://www.prudential.com.sg/ppc'> website </a></p></li>
              </ul>
              <p>All Restructured Hospitals and treatment centres are also considered as Panel providers.</p>
              <p></p>
              <p>Non-panel provides are private Hospitals and treatment centres listed under Non-panel on our <a target="_blank" href='www.prudential.com.sg/non-ppc'> website </a>.They also include non-participating private specialists operating in private Hospitals listed under Panel on our website. We reserve the right to change this Panel or Non-panel list from time to time.</p></div>`
            },
            {
              text: '<strong>95%</strong> of Deductible covered',
              tooltip: 'This is the fixed amount you have to pay of the bill (from your MediSave and/or in cash) before any benefit is payable. The deductible ranges from $1,500 to $3,500 depending on age and ward class'
            },
            {
              text: '<strong>50%</strong> of Co-insurance covered',
              tooltip: 'This is the percentage of the bill that you have to pay after the deductible is paid. The maximum co-insurance is 10%.'
            },
            {
              text: '<strong>20%</strong> Reward of staying healthy',
              tooltip: 'Get 20% savings on your PRUExtra Preferred CoPay premium'
            }
          ]
        },
      },
      benefitsConfig: [
        {
          key: 'heading',
          text: 'Benefits'
        },
        {
          key: 'roomandboard',
          text: 'Room & Board'
        },
        {
          key: 'icu',
          text: 'ICU'
        },
        {
          key: 'surgicalbenefits',
          text: 'Surgical Benefits'
        },
        {
          key: 'surgicalimplants',
          text: 'Surgical Implants'
        },
        {
          key: 'cancertreatment',
          text: 'Cancer Treatment'
        },
        {
          key: 'renaldialysis',
          text: 'Renal Dialysis'
        },
        {
          key: 'prehospital',
          text: 'Pre-Hospital Treatment'
        },
        {
          key: 'posthospital',
          text: 'Post-Hospital Treatment'
        },
        {
          key: 'annuallimit',
          text: 'Annual Limit'
        },
        {
          key: 'coverterm',
          text: 'Cover Term'
        },
        {
          key: 'deductible',
          text: 'Deductible'
        },
        {
          key: 'coinsurance',
          text: 'Co-insurance'
        }
      ],
      prodCode: 'PM1',
      anbRange: {
        maxAnb: 75,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'PMR1',
          componentList: ['PMSD','PMR1', 'PMR2']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.psEntry',
      needsAnalysisQuestion: {
        hospitalType: {
          privateHospital: {
            name: 'privateHospital',
            text: 'Private Hospital'
          },
          publicHospital: {
            name: 'publicHospital',
            text: 'Public Hospital'
          }
        },
        roomType: {
          ownRoom: {
            name: 'ownRoom',
            text: 'I prefer my own room'
          },
          shareRoom: {
            name: 'shareRoom',
            text: 'I can share a room with 3 or more people'
          }
        },
        additionalCoverageType: {
          noAdditionalCoverage: {
            name: 'noAdditionalCoverage',
            text: 'I don\'t need additional coverage'
          },
          someAdditionalCoverage: {
            name: 'someAdditionalCoverage',
            text: 'I prefer some additional coverage'
          },
          moreAdditionalCoverage: {
            name: 'moreAdditionalCoverage',
            text: 'I prefer more coverage with a list of providers'
          },
          maxAdditionalCoverage: {
            name: 'maxAdditionalCoverage',
            text: 'I prefer the maximum coverage available'
          }
        }
      },
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY03305', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY011', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY028'],
        sectionQ4: ['QMAY029', 'QMAY030'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: [
          'QPS01001', 'QPS01002', 'QPS01003', 'QPS01004', 'QPS01005',
          'QPS01101', 'QPS01102', 'QPS01103', 'QPS01104', 'QPS01105', 'QPS01106', 'QPS01107', 'QPS01108', 'QPS01109',
          'QPS012',
          'QPS025','QPS026','QPS027',
          'QPS01301'
        ]
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Terms_and_Conditions_eContract_eCorrespondence_DP',
        displayName: 'Terms and conditions governing Policy Document and/or electronic correspondence',
        fileUrl: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
        fileName: 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
        fileUrlNoWatermark: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
      }, {
        cat: 'Your Guide to Health Insurance',
        displayName: 'Your Guide to Health Insurance',
        fileUrl: 'pdf/ygthi-english.pdf',
        fileName: 'ygthi-english.pdf'
      }],
      productSummaryPdf: [{
        cat: 'PRUShield_Standard_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUShield_Standard_Product_Summary.pdf',
        fileName: 'PRUShield_Standard_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUShield_Standard_Product_Summary.pdf'
      },
      {
        cat: 'PRUShield_Premier_PRUShield_Plus_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUShield_Premier_PRUShield_Plus_Product_Summary.pdf',
        fileName: 'PRUShield_Premier_PRUShield_Plus_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUShield_Premier_PRUShield_Plus_Product_Summary.pdf'
      },
      {
        cat: 'PRUShield_PRUExtra_Plus_CoPay_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUShield_PRUExtra_Plus_CoPay_Product_Summary.pdf',
        fileName: 'PRUShield_PRUExtra_Plus_CoPay_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUShield_PRUExtra_Plus_CoPay_Product_Summary.pdf'
      },
      {
        cat: 'PRUShield_PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUShield_PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf',
        fileName: 'PRUShield_PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUShield_PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf'
      },
      {
        cat: 'PRUExtra_Plus_CoPay_PRUExtra_Plus_Lite_CoPay_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUExtra_Plus_CoPay_PRUExtra_Plus_Lite_CoPay_Product_Summary.pdf',
        fileName: 'PRUExtra_Plus_CoPay_PRUExtra_Plus_Lite_CoPay_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUExtra_Plus_CoPay_PRUExtra_Plus_Lite_CoPay_Product_Summary.pdf'
      },
      {
        cat: 'PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf',
        fileName: 'PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf',
        fileUrlNoWatermark: 'pdf/PRUExtra_Premier_CoPay_PRUExtra_Preferred_CoPay_PRUExtra_Premier_Lite_CoPay_Product_Summary.pdf'
      }],
      policyContractPdf: [{
          cat: 'Policy_PRUShield_Basic',
          displayName: 'PRUShield Policy Contract',
          fileUrl: 'pdf/PRUShield_Policy_Contract.pdf',
          fileName: 'PRUShield_Policy_Contract.pdf',
          fileUrlNoWatermark: 'pdf/v2/PRUShield_Policy_Contract.pdf'
        }, {
          cat: 'Policy_PRUExtra_CoPay',
          displayName: 'PRUShield and PRUExtra CoPay Policy Contract',
          fileUrl: 'pdf/PRUShield_PRUExtra_CoPay_Contract.pdf',
          fileName: 'PRUShield_PRUExtra_CoPay_Contract.pdf',
          fileUrlNoWatermark: 'pdf/v2/PRUShield_PRUExtra_CoPay_Contract.pdf'
        }, {
          cat: 'Policy_PRUExtra_Premier_Lite_CoPay',
          displayName: 'PRUShield and PRUExtra Premier Lite CoPay Policy Contract',
          fileUrl: 'pdf/PRUShield_Premier_Lite_CoPay_Contract.pdf',
          fileName: 'PRUShield_Premier_Lite_CoPay_Contract.pdf',
          fileUrlNoWatermark: 'pdf/v2/PRUShield_Premier_Lite_CoPay_Contract.pdf'
        }, {
          cat: 'Policy_PRUExtra_Lite_CoPay',
          displayName: 'PRUExtra Lite CoPay Policy Contract',
          fileUrl: 'pdf/PRUExtra_Lite_CoPay_Policy_Contract.pdf',
          fileName: 'PRUExtra_Lite_CoPay_Policy_Contract.pdf',
          fileUrlNoWatermark: 'pdf/PRUExtra_Lite_CoPay_Policy_Contract.pdf'
        }, {
          cat: 'Policy_PRUExtra_CoPay',
          displayName: 'PRUExtra Plus CoPay Policy Contract',
          fileUrl: 'pdf/PRUExtra_CoPay_Policy_Contract.pdf',
          fileName: 'PRUExtra_CoPay_Policy_Contract.pdf',
          fileUrlNoWatermark: 'pdf/PRUExtra_CoPay_Policy_Contract.pdf'
        }],
      warningText: normalWarningText,
      footNote: [
        'This is only product information provided by Prudential. You should seek advice from our Prudential Financial Consultant if in doubt. Buying health insurance products that are not suitable for you may impact your ability to finance your future healthcare needs.'
      ],
      promoNote: [
        'Good News! Enjoy the PRUShield and supplementary plans promotion for the first year. <a href="https://www.prudential.com.sg/products/promotions/prushieldpromo" target="_blank">Terms and Conditions</a> apply.'
      ],
      discountNote: [
        'Enjoy 25% off on your first-year premiums, when you buy PRUShield and PRUExtra supplementary plans between now and 31 May 2020. <a href="https://www.prudential.com.sg/wedosimple" target="_blank">Terms and Conditions </a> apply.',
        'Enjoy 25% off on your first-year premiums, when you buy PRUShield and PRUExtra supplementary plans between now and 31 May 2020. The discounted amount will be refunded to you after your policy is incepted. <a href="https://www.prudential.com.sg/wedosimple" target="_blank">Terms and Conditions </a> apply. '
      ],
      flowQuestions: {
        'existingShield': {
          questionnaireId: 'QPS_EXT',
          label: 'Do you have an existing shield policy with Prudential?',
          yes: 'Yes',
          no: 'No',
          leadgenOn: 'true',
          message: 'Our record shows that you has an existing PRUShield plan. In order to complete your application, we will need additional information',
          continueTo: 'detailsCommon',
          leadgenAnswer: 'Yes'
        },
        'buyingFor': {
          questionnaireId: 'QPS_DEP',
          label: 'Are you buying the PRUShield plan for yourself?',
          yes: 'Yes, I am',
          no: 'No, I am buying for my dependant(s)',
          leadgenOn: 'false',
          message: 'To purchase a shield plan for your dependants, we will need additional information.',
          continueTo: 'existingShield',
          leadgenAnswer: 'No, I am buying for my dependant(s)'
        },
        'foreignerMediSave': {
          questionnaireId: 'QPS_F1_MED',
          label: 'Pay By Medisave?',
          yes: 'Yes',
          no: '',
          leadgenOn: 'false',
          message: 'You have selected to pay a portion of your premium via Medisave. In order to complete your purchase, we will need additional information.',
          continueTo: '',
          leadgenAnswer: 'Yes'
        },
        'shieldAPS': {
          questionnaireId: 'QPS_APS',
          label: 'Are you currently receiving Additional Premium Support (APS)* to pay for your MediShield Life and/or CareShield Life premiums?',
          yes: 'Yes',
          no: 'No',
          leadgenOn: 'true',
          message: 'In view that you are receiving Additional Premium Support (APS) to pay for your MediShield Life and/or CareShield Life premiums, our Prudential Financial Consultant will contact you to explain further the impact on your APS if you are to buy PRUShield.',
          continueTo: 'detailsCommon',
          leadgenAnswer: 'Yes',
          bannerText: normalWarningText
        }
      },
      newCustomerHideQuestions: [
        {
          answer: null,
          parent: null,
          question: {
            code: 'QMAY019',
            parent: '',
            sequence: '22',
            type: 'title'
          }
        },
        {
          answer: {
            value: 'true',
            label: 'Yes'
          },
          parent: {
            code: 'QMAY019',
            sequence: '22'
          },
          question: {
            code: 'QMAY01901',
            parent: 'QMAY019',
            sequence: '1',
            type: 'multipleRadio'
          }
        },
        {
          answer: {
            value: '10',
            label: 'Other'
          },
          parent: null,
          question: {
            code: 'QMAY021',
            parent: '',
            sequence: '23',
            type: 'dropdown'
          }
        }
      ],
      clientAcknowledgement: {
        // QMAY029: `I understand the implications that may arise from a replacement/switch could outweigh any potential benefit(s) such as:<br/>
        // (1) If the new policy offers a lower benefit at a higher/same cost or offers the same level of benefit at a higher cost, it may be less suitable for me.<br/>
        // (2) If my existing medical conditions are covered by my current plan and by switching or upgrading to this new plan, I may lose coverage for these conditions or may not be given enhanced benefits for these conditions (for plan upgrade).<br/>
        // (3) If the new policy is intended to replace a lapsed/terminated PRUExtra Premier / PRUExtra Premier CoPay policy, the premium will be set at prevailing premium rate of the lapsed/terminated policy.  Therefore the Policy Illustration and Product Summary provided may not be an accurate reflection of the premium payable under the Proposed Policy.<br/>`,
         QMAY029: `I understand the implications that may arise from a replacement/switch could outweigh any potential benefit(s) such as:<br/></br>
         (i) If the new policy offers a lower benefit at a higher/same cost or offers the same level of benefit at a higher cost, it may be less suitable for me.</br></br>
         (ii) If my existing medical conditions are covered by my current plan and by switching or upgrading to this new plan, I may lose coverage for these conditions or may not be given enhanced benefits for these conditions (for plan upgrade).</br></br>
         (iii) a. &nbsp;If this proposal for PruExtra Premier CoPay/PruExtra Preferred CoPay ("Proposed Policy") is to replace or intended to replace a lapsed/terminated PruExtra Premier/PruExtra Premier CoPay/PruExtra Preferred CoPay policy ("Lapsed/Terminated Policy"), the premium for the Proposed Policy will be set at the prevailing premium level the Lapsed/Terminated Policy was pegged at. Therefore, the Policy Illustration and Product Summary provided may not be an accurate reflection of the premiums payable under the Proposed Policy.</br></br>
         &nbsp; &nbsp;&nbsp;  b.  &nbsp; &nbsp;If this proposal for the Proposed Policy is to replace or intended to replace a lapsed/terminated PRUExtra Plus policy ("Lapsed/Terminated PRUExtra Plus Policy") and you have made one (1) or more policy replacement(s) in the past 12 months prior to this proposal, the premium payable for the Proposed Policy will be pegged at the highest premium level of your lapsed/terminated policies within the said year. Therefore, the Policy Illustration and Product Summary provided may not be an accurate reflection of the premiums payable under the Proposed Policy.</br></br>
         &nbsp; &nbsp;&nbsp;  c.  &nbsp; &nbsp;The foregoing will apply to the Proposed Policy upon (1) receipt and official acceptance of the Proposed Policy by Prudential, (2) payment of premiums, and (3) issuance of an official letter indicating commencement of cover of the Proposed Policy.`,
         QMAY030: 'I agree to proceed and I understand that each Life Assured can only have one integrated Shield Plan. Upon commencement of this new policy, the existing Integrated Shield Plan covering me (if any) will be automatically terminated.'
      },
      entryStaticTextConfig: {
        8: {
          1: 'My Dependant is',
          2: 'and my daughter is',
          3: 'and my son is',
          4: 'and my spouse is'
        },
        12: {
          1: 'My Date of birth is',
          2: 'her date of birth is',
          3: 'his date of birth is',
          4: 'his/her date of birth is'
        }
      },
      helpQuestions: {
        findMore: {
          label: 'I would like to find out more about:',
          options: [
            { name: 'PRUShield Benefits' },
            { name: 'PRUShield pricing' },
            { name: 'Replacement of my existing intergrated shield plans' },
            { name: 'Cover for my pre-existing medical conditions' },
            { name: 'Purchasing PRUShield for my dependants', selectOn: 'QPS_DEP'},
            { name: 'Payment Options' }
          ]
        }
      }
    },
    PER:{
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      themeFont: 'v2ux-font',
      multipleProduct: true,
      shortName: enums.PRODUCT.PER.TYPE,
      confirmName: 'Easy Rewards',
      name: 'PRUEasy Rewards',
      docId: 'id_prod_xz7',
      prodCode: 'XZ7',
      anbRange: {
        maxAnb: 65,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'EXP7',
          componentList: ['EXP7']
        },
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.perEntry',
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY036', 'QMAY033', 'QMAY034'],
        paymentQ: ['QMAY036'],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY018', 'QMAY02404']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: []
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        name: 'PRUEasy Rewards Cover Page, Product Summary and Policy Illustration',
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUEasy Rewards Policy Document',
        fileUrl: 'pdf/PRUEasy_Rewards_Policy_Document.pdf',
        fileName: 'PRUEasy_Rewards_Policy_Document.pdf'
      }, {
        cat: 'Terms_and_Conditions_eContract_eCorrespondence_DP',
        displayName: 'Terms and conditions governing Policy Document and/or electronic correspondence',
        fileUrl: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
        fileName: 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf'
      }],
      policyContractPdf: [{
        cat: 'Policy_Contract_PRUEasy_Rewards',
        displayName: 'Policy Contract',
        fileUrl: 'pdf/PRUEasy_Rewards_Policy_Document.pdf',
        fileName: 'PRUEasy_Rewards_Policy_Document.pdf'
      }],
      productSummaryPdf: [{
        cat: 'Product_Summary_PRUEasy_Rewards',
        displayName: 'Product Summary',
        fileUrl: 'pdf/PRUEasy_Rewards_Product_Summary.pdf',
        fileName: 'PRUEasy_Rewards_Product_Summary.pdf'
      }],
      warningText: 'You are required to disclose, fully and faithfully, all the facts which you know or ought to know, otherwise you may  receive nothing from the policy.',
      helpQuestions: {
        findMore: {
          label: 'I would like to find out more about:',
          options: [
            { name: 'PRUEasy Rewards Benefits' },
            { name: 'Payment Options' },
            { name: 'PRUEasy Rewards Benefits pricing' },
            { name: 'Purchasing PRUEasy Rewards Benefits for my dependents' },
          ]
        }
      },
      importantNotes: [
        'The figures above are prepared based on two assumptions regarding the investment rates of return. These rates are purely illustrative and do not represent the investment performance of the Participating Fund. As bonus rates are not guaranteed, the actual benefits payable will vary according to the future performance of the participating fund. Values are automatically rounded off to the nearest dollar.',
        'This is the total potential amount you could receive at the end of your policy. It consists of a guaranteed payout and a non-guaranteed payout.',
        'For full details it is important that you read and understand the Policy Illustration and other important information before you decide to buy. These documents are available for you to download below and also on the review page at the end of your application.'
      ],
      footNote : 'The Death benefit is the higher of: (a) 105% of the total premiums paid up to time of death (excluding premiums for supplementary benefits (if any) less any bonus surrendered (if any); OR b) 101% of surrender value, less any amounts owing to Prudential. Refer to the Product Summary for more details on Death Benefit payable upon death.  <br><br><u> Exclusions </u>  <br> There are certain conditions such as death from suicide or pre-existing condition within 12 months from Cover Start Date or date of reinstatement (if any) under which no benefits will be payable. Please read the policy document for the full details of these exclusions',
      OecdTaxResidencyLink : 'http://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-residency/',
      OecdTaxIdentificationLink : 'https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/',
      taxtooltip : 'The term "TIN" means Taxpayer Identification Number or a functionalequivalent in the absence of a TIN. A TIN is a unique combination ofletters or numbers assigned by a jurisdiction to an individual or an Entityand used to identify the individual or Entity for the purposes ofadministering the tax laws of such jurisdiction. Further details ofacceptable TINs can be found at the OECD automatic exchange ofinformation portal. Some jurisdictions do not issue a TIN. However. thesejurisdictions often utilise some other high integrity number with anequivalent level of identification (a "functional equivalent"). Examples ofthat type of number include. for individuals. a social security/insurance number. citizen/personal identification/service code/number. and resident registration number'
    },
    PARW:{
      globalClass: 'v2ux-container',
      multipleProduct: true,
      shortName: enums.PRODUCT.PARW.TYPE,
      confirmName: 'Assure Rewards',
      name: 'PRUAssure Rewards',
      anbRange: {
        maxAnb: 65,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'EXP7',
          componentList: ['EXP7']
        },
      },
      insurancePlan: [{
        onepayone: {
          productsConfig: {
            cash: {
              docId: "id_prod_ipc",
              prodCode: "IPC",
              prodDesc: "PruAssure Rewards 1-year (Cash)"

            },
            srs: {
              docId: "id_prod_irc",
              prodCode: "IRC",
              prodDesc: "PruAssure Rewards 1-year (SRS)"
            }
          }
        }
      }],
    },
    PAS:{
      multipleProduct: true,
      shortName: enums.PRODUCT.PAS.TYPE,
      confirmName: 'Active Saver III',
      name: 'PRUActive Saver III',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      docId: 'id_prod_xw8',
      prodCode: 'XW8',
      anbRange: {
        maxAnb: 65,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'EX48',
          componentList: ['EX48']
        },
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.pasEntry',
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY036', 'QMAY033', 'QMAY034'],
        paymentQ: ['QMAY036'],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY018', 'QMAY02404']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUActive Saver III Policy Contract',
        fileUrl: 'pdf/PRUActive_Saver_III_Policy_Contract.pdf',
        fileName: 'PRUActive_Saver_III_Policy_Contract.pdf'
      }],
      warningText: normalWarningText,
      importantNotes: [
        'The figures above are prepared based on two assumptions regarding the investment rates of return. These rates are purely illustrative and do not represent the investment performance of the Participating Fund. As bonus rates are not guaranteed, the actual benefits payable will vary according to the future performance of the participating fund. Values are automatically rounded off to the nearest dollar.',
        'This is the total potential amount you could receive at the end of your policy. It consists of a guaranteed payout and a non-guaranteed payout.',
        'For full details it is important that you read and understand the Policy Illustration and other important information before you decide to buy.'
      ],
      footNote : 'The Death benefit is the higher of: (a) 105% of the total premiums paid up to time of death (excluding premiums for supplementary benefits (if any) less any bonus surrendered (if any); OR b) 101% of surrender value, less any amounts owing to Prudential. Refer to the Product Summary for more details on Death Benefit payable upon death.  <br><br><u> Exclusions </u>  <br> There are certain conditions such as death from suicide or pre-existing condition within 12 months from Cover Start Date or date of reinstatement (if any) under which no benefits will be payable. Please read the policy document for the full details of these exclusions'
    },
    PFC: {
      shortName: enums.PRODUCT.PFC.TYPE,
      confirmName: 'flexicash',
      name: 'PRUflexicash',
      prodCode: 'EC7',
      anbRange: {
        maxAnb: 60,
        minAnb: 17
      },
      component: {
        common: {
          basic: 'ENP7',
          componentList: ['ENP7', 'DAN7']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'createPfc',
      corporateSite: 'app.pfcEntry',
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY03305', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY011', 'QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY027', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY01904', 'QMAY02404', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: ['QPS00401', 'QPS00402', 'QPS00403', 'QPS00404', 'QPS00405', 'QPS00406',
          'QPS00701', 'QPS00702', 'QPS008', 'QPS01001', 'QPS01002', 'QPS01003', 'QPS01004', 'QPS01005',
          'QPS01101', 'QPS01102', 'QPS01103', 'QPS01104', 'QPS01105', 'QPS01106', 'QPS01107', 'QPS01108',
          'QPS01109', 'QPS012', 'QPS01301'
        ]
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'PRUflexicash Policy Contract',
        fileUrl: 'pdf/PRUflexicash_Policy_Contract.pdf',
        fileName: 'PRUflexicash_Policy_Contract.pdf'
      }],
      warningText: normalWarningText
    },
    ET: {
      shortName: enums.PRODUCT.ET.TYPE,
      confirmName: 'easy term',
      name: 'PRUeasy term',
      prodCode: 'CT7',
      defaultTerm: 10,
      anbRange: {
        maxAnb: 54,
        minAnb: 18
      },
      anbScbRange: {
        maxAnb: 54,
        minAnb: 21
      },
      component: {
        prefix: 'DAQ',
        common: {
          basic: 'TGT2',
          componentList: ['TGT2', 'DAQ2']
        },
        scb: {
          basic: 'TGT1',
          componentList: ['TGT1', 'DAQ1']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      confirmationScbPath: 'app.confirmationScbEt',
      corporateSite: 'app.etEntry',
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY026', 'QMAY027', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: ['QPS015', 'QPS016']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
      }, {
        cat: 'Policy',
        displayName: 'Policy Contract - PRUeasy term',
        fileUrl: 'pdf/PruEasy_Term_Policy_Contract.pdf',
        fileName: 'PruEasy_Term_Policy_Contract.pdf'
      }],
      warningText: normalWarningText,
      footNote: ['This is only product information provided by Prudential. You should seek advice from a qualified financial advisor if in doubt. Buying a life insurance policy is a long-term commitment. This plan has no cash value.',
        'On the death of the life assured during the term of the policy, the sum assured is payable in one lump sum.',
        'The whole plan terminates when this benefit is claimed.',
        '"Terminally ill" shall mean that the life assured is suffering from a condition, which in the opinion of an appropriate medical consultant is highly likely to lead to death within twelve (12) months.',
        'If the life assured suffers from Terminal Illness during the term of the policy, the benefit sum assured is payable in a lump sum.',
        'We will not accept any claim for this benefit if the life assured is already deceased at the time of the claim. We will pay the Death Benefit instead.',
        'Once we pay an Accelerated Terminal Illness claim, the Accelerated Terminal Illness Benefit terminates.'
      ]
    },
    PT: {
      shortName: enums.PRODUCT.PT.TYPE,
      confirmName: 'Protect Term',
      name: 'PRUProtect Term',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      prodCode: ['TB1', 'RB1', 'TC1'],
      anbRange: {
        maxAnb: 65,
        minAnb: 19
      },
      anbTC1Range: {
        maxAnb: 60,
        minAnb: 19
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      confirmationScbPath: 'app.confirmationScbPt',
      corporateSite: 'app.ptEntry',
      aboutYouQuestion: {
        cat: 'QMAY',
        questions: ['QMAY018']
      },
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY026', 'QMAY027', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: ['QPS00401', 'QPS00402', 'QPS00403', 'QPS00404', 'QPS00405', 'QPS00406',
          'QPS00701', 'QPS00702', 'QPS008', 'QPS01001', 'QPS01002', 'QPS01003', 'QPS01004', 'QPS01005',
          'QPS01101', 'QPS01102', 'QPS01103', 'QPS01104', 'QPS01105', 'QPS01106', 'QPS01107', 'QPS01108', 'QPS01109',
          'QPS012', 'QPS01301'
        ]
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
      }, {
        cat: 'Policy5',
        displayName: 'Policy Contract - PRUProtect Term',
        fileUrl: 'pdf/DIRECT_PRUProtect_Term_5_Policy_Contract.pdf',
        fileName: 'DIRECT_PRUProtect_Term_5_Policy_Contract.pdf'
      }, {
        cat: 'PolicyOthers',
        displayName: 'Policy Contract - PRUProtect Term',
        fileUrl: 'pdf/DIRECT_PRUProtect_Term_Policy_Contract.pdf',
        fileName: 'DIRECT_PRUProtect_Term_Policy_Contract.pdf'
      }, {
        cat: 'fact',
        displayName: 'Fact sheet and checklist',
        fileUrl: 'pdf/DPI_Factsheet_and_Checklist.pdf',
        fileName: 'DPI_Factsheet_and_Checklist.pdf'
      }, {
        cat: 'faq',
        displayName: 'FAQ',
        fileUrl: 'pdf/DPI_FAQ.pdf',
        fileName: 'DPI_FAQ.pdf'
      }],
      warningText: normalWarningText,
      footNote: [
        ['On the death of the life assured during the term of the policy, the sum assured is payable in one lump sum.',
          'The whole plan terminates when this benefit is claimed.',
          '"Terminally ill" shall mean that the life assured is suffering from a condition, which in the opinion of an appropriate medical consultant is highly likely to lead to death within twelve (12) months.',
          'If the life assured suffers from Terminal Illness during the term of the policy, the benefit sum assured is payable in a lump sum.',
          'We will not accept any claim for this benefit if the life assured is already deceased at the time of the claim. We will pay the Death Benefit instead.',
          'Once we pay an Accelerated Terminal Illness claim, the Accelerated Terminal Illness Benefit terminates.',
          '"Totally and permanently disabled" shall mean any of the two situations:'
          + '<br><span>a)&nbsp;The life assured, due to accident or sickness, is disabled to such an extent as to be rendered totally unable to engage in any occupation, business or activity for income, remuneration or profit, and the disability must:'
          + '<br><span>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;continue uninterrupted for at least 6 consecutive months from the time when the disability started; and'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;in the view of a medical examiner appointed by Prudential Singapore, must be deemed permanent with no possibility of improvement in the foreseeable future; or</span></span>'
          + '<br><span>b)&nbsp;The life assured, due to accident or sickness, suffers total and irrecoverable loss of use of:'
          + '<br><span>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in both eyes;'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;any two limbs at or above the wrist or ankle; or'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in one eye and any one limb at or above the wrist or ankle.</span></span>',
          'If the life assured stops being Totally and Permanently Disabled before the balance sum assured is due for payment, we stop the Accelerated Disability Benefit immediately.',
          'Once we pay an Accelerated Disability claim, the Accelerated Disability Benefit terminates.',
          'We pay this benefit only for one Critical Illness, even if the life assured is diagnosed as having a second Critical Illness.',
          'Once we pay a Critical Illness claim, the policy and all its benefits including the Accelerated Terminal Illness benefit and Accelerated Disability benefit terminates.'
        ],
        ['Alzheimer\'s Disease / Severe Dementia',
          'Angioplasty and Other Invasive Treatment For Coronary Artery',
          'Aplastic Anaemia',
          'Bacterial Meningitis',
          'Benign Brain Tumour',
          'Blindness (Loss of Sight)',
          'Coma',
          'Coronary Artery By-pass Surgery',
          'Deafness (Loss of Hearing)',
          'End Stage Liver Failure',
          'End Stage Lung Disease',
          'Fulminant Hepatitis',
          'Heart Attack of Specified Severity',
          'Heart Valve Surgery',
          'HIV Due to Blood Transfusion and Occupationally Acquired HIV',
          'Kidney Failure',
          'Loss of Speech',
          'Major Burns',
          'Major Cancers',
          'Major Head Trauma',
          'Major Organ / Bone Marrow Transplantation',
          'Motor Neurone Disease',
          'Multiple Sclerosis',
          'Muscular Dystrophy',
          'Paralysis (Loss of Use of Limbs)',
          'Parkinson\'s Disease',
          'Primary Pulmonary Hypertension',
          'Stroke',
          'Surgery to Aorta',
          'Viral Encephalitis'
        ]
      ]
    },
    PM: {
      shortName: enums.PRODUCT.PM.TYPE,
      confirmName: 'Man',
      name: 'PRUMan',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      prodCode: 'SM1',
      anbRange: {
        maxAnb: 55,
        minAnb: 17
      },
      gender: 'M',
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.manEntry',
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY026', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: ['QPS02101', 'QPS02102', 'QPS02103', 'QPS017']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: 'Product_Summary_PRUMan'
      }, {
        cat: 'Policy',
        displayName: 'Policy Contract - PRUMan',
        fileUrl: 'pdf/PruMan_Policy_Contract.pdf',
        fileName: 'PruMan_Policy_Contract.pdf'
      }],
      warningText: normalWarningText,
      footNote: ['This is only product information provided by Prudential. You should seek advice from a qualified financial advisor if in doubt. Buying health insurance products that are not suitable for you may impact your ability to finance your future healthcare needs.']
    },
    PL: {
      shortName: enums.PRODUCT.PL.TYPE,
      confirmName: 'Lady',
      name: 'PRULady',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color',
      prodCode: 'SL2',
      anbRange: {
        maxAnb: 55,
        minAnb: 17
      },
      gender: 'F',
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.ladyEntry',
      entryUrl: 'pl_entry',
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY001', 'QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY026', 'QMAY031', 'QMAY032', 'QMAY033', 'QMAY034'],
        paymentQ: [],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY01904', 'QMAY018']
      },
      healthQuestion: {
        cat: 'QPS',
        redirectToAgentQs: ['QPS017', 'QPS018', 'QPS019', 'QPS02001', 'QPS02002', 'QPS02003', 'QPS02004', 'QPS02005']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: 'Product_Summary_PRULady'
      }, {
        cat: 'Policy',
        displayName: 'Policy Contract - PRULady',
        fileUrl: 'pdf/PruLady_Policy_Contract.pdf',
        fileName: 'PruLady_Policy_Contract.pdf'
      }],
      warningText: normalWarningText,
      footNote: ['This is only product information provided by Prudential. You should seek advice from a qualified financial advisor if in doubt. Buying health insurance products that are not suitable for you may impact your ability to finance your future healthcare needs.']
    },
    PTV: {
      shortName: enums.PRODUCT.PTV.TYPE,
      confirmName: 'Term Vantage',
      name: 'PRUTerm Vantage',
      nameSIO: 'PRUTerm Vantage (SIO)',
      nameGIO: 'PRUTerm Vantage (GIO)',
      prodCode: 'LT4',
      anbRange: {
        maxAnb: 75,
        minAnb: 21
      },
      component: {
        common: {
          basic: 'TLT8',
          componentList: ['TLT8', 'DLT5', 'HCRB']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation_ptv',
      proposalPdf: '',
      confirmationScbPath: 'app.confirmationScbPtv',
      corporateSite: 'app.ptvEntry',
      entryUrl: 'ptv_entry',
      warningText: normalWarningText,
      footNote: [
        ['On the death of the life assured during the term of the policy, the sum assured is payable in one lump sum.',
          'The whole plan terminates when this benefit is claimed.',
          '"Terminally ill" shall mean that the life assured is suffering from a condition, which in the opinion of an appropriate medical consultant is highly likely to lead to death within twelve (12) months.',
          'If the life assured suffers from Terminal Illness during the term of the policy, the benefit sum assured is payable in a lump sum.',
          'We will not accept any claim for this benefit if the life assured is already deceased at the time of the claim. We will pay the Death Benefit instead.',
          'Once we pay an Accelerated Terminal Illness claim, the Accelerated Terminal Illness Benefit terminates.',
          '"Totally and permanently disabled" shall mean any of the two situations:'
          + 'a)&nbsp;The life assured, due to accident or sickness, is disabled to such an extent as to be rendered totally unable to engage in any occupation, business or activity for income, remuneration or profit, and the disability must:'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;continue uninterrupted for at least 6 consecutive months from the time when the disability started; and'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;in the view of a medical examiner appointed by Prudential Singapore, must be deemed permanent with no possibility of improvement in the foreseeable future; or',
          'b)&nbsp;The life assured, due to accident or sickness, suffers total and irrecoverable loss of use of:'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in both eyes;'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;any two limbs at or above the wrist or ankle; or'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in one eye and any one limb at or above the wrist or ankle.',
          'If the life assured stops being Totally and Permanently Disabled before the balance sum assured is due for payment, we stop the Accelerated Disability Benefit immediately.',
          'Once we pay an Accelerated Disability claim, the Accelerated Disability Benefit terminates.',
          'We pay this benefit only for one Critical Illness, even if the life assured is diagnosed as having a second Critical Illness.',
          'Once we pay a Critical Illness claim, the policy and all its benefits including the Accelerated Terminal Illness benefit and Accelerated Disability benefit terminates.',
        ],
        ['Alzheimer\'s Disease / Severe Dementia',
          'Angioplasty and Other Invasive Treatment For Coronary Artery',
          'Aplastic Anaemia',
          'Bacterial Meningitis',
          'Benign Brain Tumour',
          'Blindness (Loss of Sight)',
          'Coma',
          'Coronary Artery By-pass Surgery',
          'Deafness (Loss of Hearing)',
          'End Stage Liver Failure',
          'End Stage Lung Disease',
          'Fulminant Hepatitis',
          'Heart Attack of Specified Severity',
          'Heart Valve Surgery',
          'HIV Due to Blood Transfusion and Occupationally Acquired HIV',
          'Kidney Failure',
          'Loss of Speech',
          'Major Burns',
          'Major Cancers',
          'Major Head Trauma',
          'Major Organ / Bone Marrow Transplantation',
          'Motor Neurone Disease',
          'Multiple Sclerosis',
          'Muscular Dystrophy',
          'Paralysis (Loss of Use of Limbs)',
          'Parkinson\'s Disease',
          'Primary Pulmonary Hypertension',
          'Stroke',
          'Surgery to Aorta',
          'Viral Encephalitis'
        ]
      ]
    },
    PLMF: {
      shortName: enums.PRODUCT.PLMF.TYPE,
      confirmName: 'Life Multiplier Flex',
      name: 'PRULife Multiplier Flex',
      nameSIO: '',
      nameGIO: '',
      prodCode: ['WR7','WR7_1', 'WR7_2', 'WR7_3', 'WR7_4'],
      prodRiderMapping: {
        WR7_1: 'SCRF',
        WR7_2: 'SCRG',
        WR7_3: 'SCRH',
        WR7_4: 'SCRI'
      },
      anbRange: {
        maxAnb: 60,
        minAnb: 18
      },
      component: {
        common: {
          basic: '',
          componentList: ['']
        }
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmationPlmf',
      proposalPdf: '',
      confirmationScbPath: 'app.confirmationScbPlmf',
      corporateSite: 'app.plmfEntry',
      warningText: normalWarningText,
      footNote: [
        ['On the death of the life assured during the term of the policy, the sum assured is payable in one lump sum.',
          'The whole plan terminates when this benefit is claimed.',
          '"Terminally ill" shall mean that the life assured is suffering from a condition, which in the opinion of an appropriate medical consultant is highly likely to lead to death within twelve (12) months.',
          'If the life assured suffers from Terminal Illness during the term of the policy, the benefit sum assured is payable in a lump sum.',
          'We will not accept any claim for this benefit if the life assured is already deceased at the time of the claim. We will pay the Death Benefit instead.',
          'Once we pay an Accelerated Terminal Illness claim, the Accelerated Terminal Illness Benefit terminates.',
          '"Totally and permanently disabled" shall mean any of the two situations:'
          + 'a)&nbsp;The life assured, due to accident or sickness, is disabled to such an extent as to be rendered totally unable to engage in any occupation, business or activity for income, remuneration or profit, and the disability must:'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;continue uninterrupted for at least 6 consecutive months from the time when the disability started; and'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;in the view of a medical examiner appointed by Prudential Singapore, must be deemed permanent with no possibility of improvement in the foreseeable future; or',
          'b)&nbsp;The life assured, due to accident or sickness, suffers total and irrecoverable loss of use of:'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in both eyes;'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;any two limbs at or above the wrist or ankle; or'
          + '<br>&ndash;&nbsp;&nbsp;&nbsp;&nbsp;the entire sight in one eye and any one limb at or above the wrist or ankle.',
          'If the life assured stops being Totally and Permanently Disabled before the balance sum assured is due for payment, we stop the Accelerated Disability Benefit immediately.',
          'Once we pay an Accelerated Disability claim, the Accelerated Disability Benefit terminates.',
          'We pay this benefit only for one Critical Illness, even if the life assured is diagnosed as having a second Critical Illness.',
          'Once we pay a Critical Illness claim, the policy and all its benefits including the Accelerated Terminal Illness benefit and Accelerated Disability benefit terminates.',
        ],
        ['Alzheimer\'s Disease / Severe Dementia',
          'Angioplasty and Other Invasive Treatment For Coronary Artery',
          'Aplastic Anaemia',
          'Bacterial Meningitis',
          'Benign Brain Tumour',
          'Blindness (Loss of Sight)',
          'Coma',
          'Coronary Artery By-pass Surgery',
          'Deafness (Loss of Hearing)',
          'End Stage Liver Failure',
          'End Stage Lung Disease',
          'Fulminant Hepatitis',
          'Heart Attack of Specified Severity',
          'Heart Valve Surgery',
          'HIV Due to Blood Transfusion and Occupationally Acquired HIV',
          'Kidney Failure',
          'Loss of Speech',
          'Major Burns',
          'Major Cancers',
          'Major Head Trauma',
          'Major Organ / Bone Marrow Transplantation',
          'Motor Neurone Disease',
          'Multiple Sclerosis',
          'Muscular Dystrophy',
          'Paralysis (Loss of Use of Limbs)',
          'Parkinson\'s Disease',
          'Primary Pulmonary Hypertension',
          'Stroke',
          'Surgery to Aorta',
          'Viral Encephalitis'
        ]
      ]
    },
    PGP: {
      shortName: enums.PRODUCT.PGP.TYPE,
      confirmName: 'investor guaranteed plus',
      name: 'PRUinvestor guaranteed plus',
      prodCode: ['IN7', 'IN6', 'IR7'],
      anbRange: {
        maxAnb: 75,
        minAnb: 17,
        threshold19: 19 // threshold value for display the SRS question in questionnaire
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      confirmationScbPath: 'app.confirmationScbPgp',
      corporateSite: 'app.pgpEntry',
      warningText: normalWarningText,
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY036', 'QMAY033', 'QMAY034'],
        paymentQ: ['QMAY036'],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY025', 'QMAY018', 'QMAY02404']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy_USD',
        displayName: 'Policy Contract - PRUinvestor guaranteed plus',
        fileUrl: 'pdf/PRUinvestor_Guaranteed_Plus_Policy_Contract_USD.pdf',
        fileName: 'PRUinvestor_Guaranteed_Plus_Policy_Contract_USD.pdf'
      }, {
        cat: 'Policy_SGD',
        displayName: 'Policy Contract - PRUinvestor guaranteed plus',
        fileUrl: 'pdf/PRUinvestor_Guaranteed_Plus_Policy_Contract_SGD.pdf',
        fileName: 'PRUinvestor_Guaranteed_Plus_Policy_Contract_SGD.pdf'
      }]
    },
    PGRP: {
      shortName: enums.PRODUCT.PGRP.TYPE,
      confirmName: 'golden retirement premier',
      name: 'PRUgolden retirement premier',
      compoName: 'PruGolden Retirement Premier @ ',
      defaultProductCode: 'AM7',
      cashProdCode: 'AL7',
      srsProdCode: 'AM7',
      prodCode: ['AL7', 'AM7'],
      anbRange: {
        maxAnb: 66,
        minAnb: 19,
        threshold51: 51, // retire age at 51 years old
        threshold56: 56, // retire age at 56 years old
        threshold61: 61 // retire age at 61 years old
      },
      proInfo: 'product',
      confirmationPath: 'app.confirmation',
      proposalPdf: 'generateProposalPDF',
      corporateSite: 'app.pgrpEntry',
      warningText: normalWarningText,
      moreAboutYouQuestion: {
        cat: 'QMAY',
        sectionQ1: ['QMAY003A', 'QMAY003B', 'QMAY003C', 'QMAY001', 'QMAY004'],
        sectionQ2: ['QMAY018', 'QMAY019', 'QMAY021'],
        sectionQ3: ['QMAY023', 'QMAY023A', 'QMAY024', 'QMAY025', 'QMAY026', 'QMAY031', 'QMAY032', 'QMAY036', 'QMAY033', 'QMAY034'],
        paymentQ: ['QMAY036'],
        redirectToAgentQs: ['QMAY001', 'QMAY004', 'QMAY018', 'QMAY023021', 'QMAY023022', 'QMAY023023', 'QMAY02404', 'QMAY025']
      },
      pdfList: [{
        cat: 'BI',
        displayName: displayBIPdfName,
        fileUrl: null,
        fileName: null
      }, {
        cat: 'Policy',
        displayName: 'Policy Contract - PRUgolden retirement premier',
        fileUrl: 'pdf/PRUgolden_Retirement_Premier_Policy_Contract.pdf',
        fileName: 'PRUgolden_Retirement_Premier_Policy_Contract.pdf'
      }]
    },
    PTP: {
      shortName: enums.PRODUCT.PTP.TYPE,
      confirmName: 'Triple protect',
      name: 'PRUTriple protect',
      prodCode: 'CTA'
    },
    PAP: {
      shortName: enums.PRODUCT.PAP.TYPE,
      confirmName: 'Active Protect',
      name: 'PRUActive Protect',
      prodCode: 'NCI',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color'
    },
    PAR: {
      shortName: enums.PRODUCT.PAR.TYPE,
      confirmName: 'Active Retirement',
      name: 'PRUActive Retirement',
      prodCode: 'AT7'
    },
    PLVA: {
      shortName: enums.PRODUCT.PLVA.TYPE,
      confirmName: 'Life Vantage Achiever Prime',
      name: 'PruLife Vantage Achiever Prime',
      prodCode: 'PG7'
    },
    PATC: {
      shortName: enums.PRODUCT.PATC.TYPE,
      confirmName: 'Crisis Care II (PRUActive Term)',
      name: 'Crisis Care II (PRUActive Term)',
      prodCode: 'LT5_1'
    },
    PAL: {
      shortName: enums.PRODUCT.PAL.TYPE,
      confirmName: 'Active Life',
      name: 'PRUActive Life',
      prodCode: 'WO7'
    },
    PRU: {
      shortName: enums.PRODUCT.PRU.TYPE,
      confirmName: 'Service Request',
      name: 'PRUService Request',
      prodCode: 'PRU'
    },
    PCS: {
      shortName: enums.PRODUCT.PCS.TYPE,
      confirmName: 'Cash Secure',
      name: 'PRUCash Secure',
      prodCode: 'AC7'
    },
    PWP: {
      shortName: enums.PRODUCT.PWP.TYPE,
      confirmName: 'Wealth II (SGD) 5 Pay',
      name: 'PRUWealth II (SGD) 5 Pay',
      prodCode: 'VE7'
    },
    PLSC: {
      shortName: enums.PRODUCT.PLSC.TYPE,
      confirmName: 'Link SuperGrowth Cash',
      name: 'PRULink SuperGrowth Cash',
      prodCode: 'PR3'
    },
    PGR: {
      shortName: enums.PRODUCT.PGR.TYPE,
      confirmName: 'Golden Retirement',
      name: 'PRUGolden Retirement',
      prodCode: 'AH7'
    },
    PGRR: {
      shortName: enums.PRODUCT.PGRR.TYPE,
      confirmName: 'Golden Retirement Reward II',
      name: 'PRUGolden Retirement Reward II',
      prodCode: 'AQ7'
    },
    PLI4P: {
      shortName: enums.PRODUCT.PLI4P.TYPE,
      confirmName: 'Lifetime Income 4-Pay',
      name: 'PRULifetime Income 4-Pay',
      prodCode: 'WK7'
    },
    PLIP: {
      shortName: enums.PRODUCT.PLIP.TYPE,
      confirmName: 'Lifetime Income Premier II',
      name: 'PRULifetime Income Premier II',
      prodCode: 'WX7'
    },
    PLEP: {
      shortName: enums.PRODUCT.PLEP.TYPE,
      confirmName: 'Link Enhanced Protector II',
      name: 'PRULink Enhanced Protector II',
      prodCode: 'PX1'
    },
    PSSA: {
      shortName: enums.PRODUCT.PSSA.TYPE,
      confirmName: 'Link SuperSaver Acct (CASH)',
      name: 'PRULink SuperSaver Acct (CASH)',
      prodCode: 'R2M'
    },
    PSV: {
      shortName: enums.PRODUCT.PSV.TYPE,
      confirmName: 'Select Vantage (SGD)',
      name: 'PRUSelect Vantage (SGD)',
      prodCode: 'SFA'
    },
    PE: {
      shortName: enums.PRODUCT.PE.TYPE,
      confirmName: 'Extra',
      name: 'PRUExtra',
      prodCode: 'PMB'
    },
    PASO: {
      shortName: enums.PRODUCT.PASO.TYPE,
      confirmName: 'Active Saver',
      name: 'PRUActive Saver',
      prodCode: 'XY7'
    },
    PVTA: {
      shortName: enums.PRODUCT.PVTA.TYPE,
      confirmName: 'Vantage Assure (SP)',
      name: 'PRUVantage Assure (SP)',
      prodCode: 'PY1'
    },
    PVTAR: {
      shortName: enums.PRODUCT.PVTAR.TYPE,
      confirmName: 'Vantage Assure (RP)',
      name: 'PRUVantage Assure (RP)',
      prodCode: 'PY2'
    },
    PAC: {
      shortName: enums.PRODUCT.PAC.TYPE,
      confirmName: 'Active Cash',
      name: 'PRUActive Cash',
      prodCode: 'AC8'
    },
    PVTRE: {
      shortName: enums.PRODUCT.PVTRE.TYPE,
      confirmName: 'Vantage RetireCare',
      name: 'PRUVantage RetireCare',
      prodCode: 'PZ1',
      globalClass: 'v2ux-container',
      themeColor: 'v2ux-color'
    }
  },
  initProductRequest: [{
    name: 'client',
    dob: '',
    age: '',
    gender: '',
    smoker: '',
    residentStatus: 'C',
    numberOfLife: '0',
    clientType: 'ML',
    countryCode: 'SNG',
    occupation: '1',
    occupationCode: 'OTH1',
    occupationDesc: ''
  }],
  productSelected: {
    docId: 'id_prod_',
    prodCode: '',
    prodName: '',
    selectedTermOption: '', // only for PM and PL
    term: 0,
    sumAssured: 0,
    totalYearlyPremium: 0,
    basic: {
      compoCode: '',
      compoName: '',
      sumAssured: 0,
      premium: 0,
      yearlyPremium: 0,
      halfYearlyPremium: 0,
      quarterlyPremium: 0,
      monthlyPremium: 0,
      term: 0,
      optCode: '',
      optDescp: ''
    },
    rider: [],
    whatYouBuy: {
      illnesses: '',
      surgeries: '',
      reconstructive: '',
      accident: '',
      description: []
    }
  },
  mailDetails: {
    reqType: '',
    operationStep: '',
    givenName: '',
    surName: '',
    mailAddress: '',
    agentName: '',
    agentMail: '',
    productName: '',
    erefNo: '',
    stage: '',
    phoneNo: '',
    age: '',
    occupation: '',
    nationality: 'SNG',
    nationalityMail: 'Singaporean',
    gender: '',
    totalYearlyPremium: '0'
  },
  events: {
    PA: {},
    PS: {},
    PFC: {},
    ET: {
      validateConfirmRead: 'validateEtConfirmRead',
      doConsentValidation: 'doEtConsentValidation',
      refreshProduct: 'refreshEtProduct'
    },
    PT: {
      validateConfirmRead: 'validatePtConfirmRead',
      doConsentValidation: 'doPtConsentValidation',
      refreshProduct: 'refreshPtProduct'
    },
    PM: {
      validateConfirmRead: 'validatePmConfirmRead',
      doConsentValidation: 'doPmConsentValidation',
      refreshProduct: 'refreshPmProduct'
    },
    PL: {
      validateConfirmRead: 'validatePlConfirmRead',
      doConsentValidation: 'doPlConsentValidation',
      refreshProduct: 'refreshPlProduct'
    },
    PTV: {},
    PGP: {},
    PAS: {},
    PGRP: {},
    PLMF: {},
    PER: {},
    PC: {},
    PAT: {},
  },
  uploadList: {
    singaporean: [{
      currentImage: false,
      currentPercent: 0,
      name: 'Front of NRIC',
      subName: 'Front of NRIC:',
      imgIndex: 1,
      id: 'front-of-NRIC'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Back of NRIC',
      subName: 'Back of NRIC:',
      imgIndex: 1,
      id: 'back-of-NRIC'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Selfie with front of NRIC',
      subName: 'Selfie with front of NRIC:',
      imgIndex: 2,
      id: 'selfie-with-front-of-NRIC'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Proof of address',
      subName: 'Proof of address:',
      imgIndex: 3,
      id: 'proof-of-address'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'NRIC of Beneficial Owner',
      subName: 'NRIC of Beneficial Owner:',
      imgIndex: 4,
      id: 'NRIC-of-BO'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'NRIC of Politically Exposed Person',
      subName: 'NRIC of Politically Exposed Person:',
      imgIndex: 5,
      id: 'NRIC-of-PEP'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'FIN/NRIC Verification',
      subName: 'FIN/NRIC Verification:',
      imgIndex: 6,
      id: 'FIN-NRIC-verification-photo'
    }],
    foreign: [{
      currentImage: false,
      currentPercent: 0,
      name: 'Front of employment/dependant pass',
      subName: 'Front of employment/dependant pass:',
      imgIndex: 1,
      id: 'front-of-pass'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Back of employment/dependant pass',
      subName: 'Back of employment/dependant pass:',
      imgIndex: 1,
      id: 'back-of-pass'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Selfie with front of employment /dependent pass',
      subName: 'Selfie with front of employment /dependent pass:',
      imgIndex: 2,
      id: 'selfie-with-front-of-employment-pass'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'Proof of address',
      subName: 'Proof of address:',
      imgIndex: 3,
      id: 'proof-of-address'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'NRIC of Beneficial Owner',
      subName: 'NRIC of Beneficial Owner:',
      imgIndex: 4,
      id: 'NRIC-of-BO'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'NRIC of Politically Exposed Person',
      subName: 'NRIC of Politically Exposed Person:',
      imgIndex: 5,
      id: 'NRIC-of-PEP'
    },
    {
      currentImage: false,
      currentPercent: 0,
      name: 'FIN/NRIC Verification',
      subName: 'FIN/NRIC Verification:',
      imgIndex: 6,
      id: 'FIN-NRIC-verification-photo'
    }
    ]
  },
  angularSwiperInitParams: {
    effect: 'slide',
    centeredSlides: false,
    slidesPerView: 'auto',
    spaceBetween: 10,
    observeParents: true,
    observer: true,
    slidesOffsetAfter: 15,
    setWrapperSize: true,
    pagination: '.swiper-pagination',
    coverflow: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    }
  },
  openEncryption: true,
  channel: enums.CHANNEL,
  dpchannel: enums.DP_CHANNEL,
  mediumType: enums.COMMUNICATION_MEDIUM,
  directEntryChannelCode: enums.DIRECT_ENTRY_CHANNEL_CODE,
  showHealth: true,
  simpleEncryptKey: 'This key is 4 url encryption and decryption ONLY.',
  sessionDateEncryptionKey: 'pru$123987!@',
  /*
    selector values for entries
  */
  entries: {
    smokers: [{ type: 'smoker', id: 1 },
      { type: 'non-smoker', id: 2 }
    ],
    genders: [{ type: 'Female', id: 'F' },
      { type: 'Male', id: 'M' }
    ],
    nationalitys: [{ type: 'Singaporean', id: 1 },
      { type: 'Singapore PR, Employment Pass or Work Permit holder', id: 2 },
      { type: 'Foreigner residing in Singapore with a valid pass', id: 3 }
    ],
    numYears: [{ type: '65', id: 1 },
      { type: '75', id: 2 }
    ],
    occupations: [{
      type: 'Professional / White collar / Office worker',
      note: 'For those engaged mainly in executive, administrative or clerical duties. You spend a substantial amount of time indoors (e.g. the office). Examples include administrators, accountants, C-level management, doctors, professionals, childcare services, school teachers, and students.',
      id: 1,
      name: 'Occupation Class 1 (white collar, office worker)'
    },
    {
      type: 'Sales / Light manual worker',
      note: 'For those engaged mainly in sales or light manual duties, service industry and may be required to be on the move frequently. However, your job does not expose you to hazardous conditions. Examples include sales persons, employees of hospitality industry, beauticians, homemakers, commercial airlines crew, engineer (civil/electrical), healthcare personnel and National Servicemen Full-time (NSFs).',
      id: 2,
      name: 'Occupation Class 2 (Sales / Light Manual Worker)'
    },
    {
      type: 'Skilled / Semi-skilled worker',
      note: 'For those engaged mainly in skilled or semi-skilled work and may be required to perform manual labour (not involving height above 6 meters from ground level). Your job may also expose you to certain hazardous conditions. Examples include technicians, engineers (aeronautical/mechanical), light vehicle drivers, housekeepers and manufacturers.',
      id: 3,
      name: 'Occupation Class 3 (Skilled & Semi-skilled Manual Worker)'
    },
    {
      type: 'Heavy manual / Unskilled worker / Risky occupation',
      note: 'For those engaged mainly in heavy manual duties involving heavy machinery or expose to hazardous conditions which may affect your health and safety. Examples include armed/military personnel, firemen, construction or offshore workers, deliverymen, heavy vehicle drivers, pilots (non-commercial), sportsmen and unemployed.',
      id: 4,
      name: 'Occupation Class 4 (Heavy Manual / Unskilled Worker)'
    },
    {
      type: 'Non-income earner',
      note: '',
      id: 5,
      name: 'Occupation Class 5 (Non-income earner)'
    }],
    currency: [{ type: 'Singapore Dollars', id: 'SGD' },
      { type: 'US Dollars', id: 'USD' }
    ],
    identities4ps: [{ type: 'Singaporean', id: 1 },
      { type: 'Singapore PR', id: 2 },
      { type: 'Employment Pass or Work Permit holder', id: 4 },
      { type: 'Foreigner residing in Singapore with a valid pass', id: 3 }
    ],
    numYears4pt: [{ type: 'for 5 years (renewable)', id: 'RB1' },
      { type: 'for 20 years', id: 'TB1' },
      { type: 'until I turn 65 years old', id: 'TC1' }
    ],
    countries: [{ type: 'Singapore', id: 'SNG' },
      { type: 'Malaysia', id: 'MAL' },
      { type: 'Indonesia', id: 'INA' },
      { type: 'China', id: 'CHN' }
    ]
  },
  /*
    Constants for maxYear and minYear
  */
  yearRange: {
    minYear: 1940,
    maxYear: new Date().getFullYear()
  },
  /*
    set the forbidenFlow (PRUACCESS, edm, CRM)
  */
  forbiddenCRMFlow: [],
  forbiddenEDMFlow: [],
  forbiddenGenericEDMFlow: [],
  forbiddenLeadgenEDMFlow: [],
  forbiddenPRUACSFlow: [],

  /*
    Constants for male or female
  */
  gender: {
    male: 'Male',
    female: 'Female',
    maleShortName: 'M',
    femaleShortName: 'F'
  },

  /*
    Constants for man or lady calling
  */
  title: {
    man: 'Mr',
    lady: 'Ms'
  },

  /*
    Constants for Singapore Short Name
  */
  singaporeShort: 'SG',
  singapore: 'SNG',
  singapore2: 'SGP',

  /*
    Constants for Singapore and Singaporean Name
  */
  singaporeName: 'Singapore',
  singaporeanName: 'Singaporean',

  /*
    Constants for Singapore IDD
  */
  singaporeIDD: '+65',

  /*
    Constants for Mail Type
  */
  mailType: {
    closeBrowser: 'CLOSEBROWSER',
    ptvLead: 'PTV_LEAD',
    newLead: 'NEW_LEAD',
    exLead: 'EXISTING_LEAD',
    agent: 'AGENT',
    edmLead: 'EDM_LEAD',
    customer: 'CUSTOMER',
    failquestionLead: 'FAILQUESTION_LEAD',
    inEligibleLead: 'INELIGIBLE_LEAD',
    inCompletedataLead: 'INCOMPLETEDATA_LEAD',
    backup: 'BACKUP',
    getHelpLead: 'GETHELP_LEAD',
    sessionTimeOut: 'SESSIONTIMEOUT',
    plmfLead: 'PLMF_LEAD'
  },

  /*
    Constants for Application Form Section
  */
  section: {
    aboutYou: 'aboutYou',
    moreAboutYou: 'moreAboutYou',
    healthAndLifestyle: 'healthAndLifestyle',
    paymentOption: 'paymentOption',
    uploadDocument: 'uploadDocument'
  },

  /*
    Constants for Application Form Step
  */
  step: {
    detail: 'DETAIL',
    edit: 'EDIT',
    review: 'REVIEW',
    confirmation: 'CONFIRMATION'
  },

  /*
    Constants for Questionnaire Code
  */
  questionnaireCode: {
    qps003: 'QPS003',
    qps00301: 'QPS00301',
    qps00302: 'QPS00302',
    qps00303: 'QPS00303',
    qps0030301: 'QPS0030301',
    qps0030101: 'QPS0030101',
    qps004: 'QPS004',
    qps007: 'QPS007',
    qps005: 'QPS005',
    qps010: 'QPS010',
    qps011: 'QPS011',
    qps013: 'QPS013',
    qps020: 'QPS020',
    qps021: 'QPS021',
    qamy001: 'QMAY001',
    qmay004: 'QMAY004',
    qmay010: 'QMAY010',
    qmay018: 'QMAY018',
    qmay019: 'QMAY019',
    qmay01901: 'QMAY01901',
    qmay01902: 'QMAY01902',
    qmay01903: 'QMAY01903',
    qmay01904: 'QMAY01904',
    qmay021: 'QMAY021',
    qmay0210102: 'QMAY0210102',
    qmay0210202: 'QMAY0210202',
    qmay0210302: 'QMAY0210302',
    qmay0210402: 'QMAY0210402',
    qmay0210502: 'QMAY0210502',
    qmay0210602: 'QMAY0210602',
    qmay0210702: 'QMAY0210702',
    qmay0210802: 'QMAY0210802',
    qmay0210902: 'QMAY0210902',
    qmay023: 'QMAY023',
    qmay023a: 'QMAY023A',
    qmay02301: 'QMAY02301',
    qmay023011: 'QMAY023011',
    qmay02302: 'QMAY02302',
    qmay023021: 'QMAY023021',
    qmay023022: 'QMAY023022',
    qmay023023: 'QMAY023023',
    qmay02303: 'QMAY02303',
    qmay023031: 'QMAY023031',
    qmay023041: 'QMAY023041',
    qmay02304: 'QMAY02304',
    qmay0230401: 'QMAY0230401',
    qmay024: 'QMAY024',
    qmay02404: 'QMAY02404',
    qmay02701: 'QMAY02701',
    qmay02704: 'QMAY02704',
    qmay02709: 'QMAY02709',
    qmay032: 'QMAY032',
    qmay033: 'QMAY033',
    qmay034: 'QMAY034',
    qmay036: 'QMAY036',
    qmay03601: 'QMAY03601',
    qmay03602: 'QMAY03602',
    qmay03603: 'QMAY03603',
    qmay0360104: 'QMAY0360104',
    qmay025: 'QMAY025',
    qmay028: 'QMAY028'
  },

  /*
    Constants for Questionnaire Type
  */
  questionnaireType: {
    checkbox: 'checkbox',
    textfield: 'textfield',
    textarea: 'textarea',
    multipleRadio: 'multipleRadio',
    title: 'title',
    questionnaire: 'questionnaire',
    declaration: 'declaration',
    dropdown: 'dropdown',
    toggle: 'toggle',
    inverse: 'inverse',
    dropDownToggleAdd: 'dropDownToggleAdd',
    dropDownSearch: 'dropdownSearch'
  },

  /*
  * PACSDP-2041 Common Reporting Standard
  * TIN number questionaire mappings
  */
  countryQustionaireMappings: {
    QMAY023031: 'QMAY023021',
    QMAY023032: 'QMAY023022',
    QMAY023033: 'QMAY023023'
  },

  /*
    Constants for questionnaire Description
  */
  questionnaireDesc: {
    noneOfTheAbove: 'None of the above'
  },

  questionnaireWarningText: {
    'QMAY025': {
      'true': `By Selecting 'Yes', your assigned Financial Consultant will contact you separately to submit a completed
      <a href="https://www.prudential.com.sg/services/useful-links/-/media/Prudential/PDF/applicationforms/formw-9.pdf" target="_blank">W9 Form</a>.`,
      'false': `By Selecting 'No', your assigned Financial Consultant will contact you separately to submit a completed
      <a href="https://www.prudential.com.sg/services/useful-links/-/media/Prudential/PDF/applicationforms/formw-8ben.pdf" target="_blank">W8-Ben Form</a> (this is applicable only if the country of birth/address/phone number in the US).`
    },
    "QPS005" : {
      healthDeclaration : `I hereby declare that there is no change to my health that may have required or requires further medical intervention, treatment, hospitalisation or follow up, or any other changes that may impact my insurability since my last fully underwritten Life or Health insurance policy or last completed medical examination with Prudential Singapore.
      <br><br>
      I further confirm that I have not made any application (including reinstatement) of life or Health Insurance policy which is pending or has been deferred, declined or accepted at special rates, nor have made any major claims for disability or critical illness, with this or any other insurance company.`
    }
  },
  /*
    Constants for Questionnaire Message Type
  */
  questionnaireMsgType: {
    eitherMsg: 'eitherMsg',
    invalid: 'invalid',
    invalidTIN: 'invalidTIN'
  },
  /*
    Constants for Questionnaire pass Type
  */
  questionnairePassType: {
    "question": {
      "after":"",
      "description":"what type of pass are you holding ?",
      "validation":"","cat":"QMAY","parent":"","depend":"",
      "max":0,
      "type":"toggleAdd",
      "title":"",
      "code":"QMAY_PASSTYPE",
      "details":"",
      "subQuestions":[],
      "answerArray":null,
      "questionnaire":"",
      "sequence":"6",
      "required":"",
      "warningText":"",
      "min":0,
      "order":"6",
      "option":"",
      "answer":null,
      "level":1,
      "editMode":true
    },
    "answer":{
      "value":"",
      "label":null
    },
    "subs":{},
    "parent":null
    },
/*
    Constants for Questionnaire payment Type
  */
   questionnairePaymentType: {
    "question": {
      "description": "how do you wish to pay?",
      "cat": "QMAY",
      "code": "QMAY_PAYMENT_OPTION"
    },
    "answer": {
      "value": "",
      "label": null
    }
   },

    /*
    Constants for questionnaire mode
  */
  questionnaireMode: {
    edit: 'edit',
    save: 'save'
  },

  /*
    Constants for Address Type
  */
  addressType: {
    residentialAddress: 'R',
    mailingAddress: 'M'
  },

  /*
    Constants for Address Name
  */
  addressName: {
    residential: 'residential',
    mailing: 'mailing'
  },

  /*
    Constants for residential address Type
  */
  residentialAddressType: {
    c: 'C',
    h: 'H'
  },

  /*
    Constants for Default Issue Date
  */
  defaultIssueDate: '01-JAN-2013',

  /*
    Constants for Default Policy Status
  */
  defaultPolicyStatus: 'IF',

  /*
    Constants for DropDown Code
  */
  dropDownCode: {
    pfcopt066: 'PFCOPT066',
    pfcopt070: 'PFCOPT070',
    edopt001: 'EDOPT001',
    iddopt1: 'IDDOPT1',
    elopt001: 'ELOPT001'
  },

  /*
    Constants for unemployed occupations
  */
  unemployedOccupations: ['BABY', 'CHIL', 'HOME', 'PENS', 'RETR', 'STUD', 'UNEM'],

  /*
    Constants for dob filter
  */
  dobFilter: 'dd/MM/yyyy',

  /*
    Constants for America Country Code
  */
  america: 'USA',

  /*
    Constants for encryption api
  */
  encryptionRequestText: 'count=',

  /*
    Constants for route parameter
  */
  routeParameter: 'help',

  /*
    Constants for paymentType
  */
  paymentType: {
    sgdCash: 'SGD_CASH',
    srs: 'SRS',
    usd: 'USD',
    intendSrs: 'INTEND_SRS'
  },

  /*
    units for premium
  */
  premiumUnit: {
    years: ' years',
    months: ' months'
  },

  /*
    Constants for currency
  */
  currency: {
    usdShort: 'US',
    USD: 'USD',
    usdShortWithSign: 'US$',
    sgdShort: 'S',
    SGD: 'SGD',
    sgdShortWithSign: 'S$',
  },

  /*
    Constants for modal close parameter
  */
  modalCloseParameter: {
    cancel: 'cancel',
    n: 'N',
    y: 'Y'
  },

  /*
    Constants for pdfType
  */
  pdfType: {
    ra: 'RA',
    fact: 'fact',
    faq: 'faq',
    pafe: 'PAFE',
    policy: 'policy',
    summary: 'summary',
    crisis: 'crisis',
    accelerated: 'accelerated',
    illustration: 'illustration',
    proposal: 'proposal',
  },

  /* Constants for pdfUrl */
  pdfUrl: {

  },

  /*
    Constants for Product Type BI
  */
  productBI: 'BI',


  /*
    Constants for browser types
  */
  browser: {
    IE: 'ie',
    safari: 'safari',
    ios: 'ios'
  },

  /*
    Constants for file types
  */
  fileType: {
    pdf: '.pdf'
  },

  /*
    Constants for Singapore PR
  */
  singaporePR: 'SPR',
  singaporeCitizen: 'SC',
  other: 'OTH',

  /*
    Constants for expire age for PRUgolden retirement premier
  */
  ageExpire: {
    age55: '55',
    age60: '60',
    age65: '65',
    age70: '70',
    age75: '75'
  },

  /*
    Constants for anb range for different retirementAge of product PGRP
  */
  pgrpAnbRange: {
    anb17: 17,
    anb60: 60
  },

  /*
    Constants for default marital status
  */
  defaultMarital: 'Z',

  /*
    Constants for idd number
  */
  iddNumber: {
    sgIdd: '65',
    sgIddWithPlus: '+65',
    usIddWithPlus: '+1',
    usIddWithPlus1: '+01',
    usIddWithPlus2: '+001',
    sgIddWithHyphen: '65-'
  },

  /*
    Constants for plan type
  */
  planType: {
    basic: 'BASIC',
    rider: 'RIDER'
  },

  /*
    Constants for input type
  */
  inputType: {
    idd: 'idd',
    email: 'email',
    nric: 'nric'
  },

  /*
    Constants for docID
   */
  docPrefix: 'id_prod_',

  /*
    Constants for paymentQ Method
  */
  paymentQMethod: {
    srs: 'SRS',
    intend: 'INTEND',
    cash: 'CASH'
  },

  perpaymentQMethod: {
    card:'CARD',
    cash: 'CASH'
  },

  /*
    Constants for payment type
  */
 // PACSDP-664 PAS payment options
  paymentQ: {
    srs: {
      key: 'SRS',
      value: 'SRS',
      label: 'Supplementary Retirement Scheme (SRS)',
    },
    cash: {
      key: 'CASH',
      value: 'SGD_CASH',
      label: 'Cheque / Bank Transfer',
    },
    intend: {
      key: 'INTEND',
      value: 'INTEND_SRS'
    },
    card: {
      key: 'CARD',
      value: 'CARD',
      label: 'Visa / Mastercard'
    },
  },


 // PACSDP-2852 PER payment options
  perPaymentQ: {
    card: {
      key: 'CARD',
      value: 'CARD',
      label: 'Visa / Mastercard'
    },
    cash:{
      key: 'CASH',
      value: 'CASH',
      label: 'iBanking, FAST (Fast and Secure Transfers), Cheque'
    }
  },

  /*
    Constants for checkFields
  */
  checkEntryFields: {
    PA: ['gender', 'dob', 'residencyCode', 'occupationCode'],
    PS: ['gender', 'dob', 'residencyCode'],
    ET: ['gender', 'dob', 'residencyCode', 'smoker'],
    PT: ['gender', 'dob', 'residencyCode', 'smoker'],
    PM: ['dob', 'residencyCode', 'smoker', 'policyTerm'],
    PL: ['dob', 'residencyCode', 'smoker', 'policyTerm'],
    PFC: ['gender', 'dob', 'residencyCode', 'smoker'],
    PAS: ['dob', 'residencyCode'],
    PTV: ['gender', 'dob', 'smoker', 'countryCode'],
    PGP: ['dob', 'residencyCode', 'currencyCode'],
    PGRP: ['residencyCode', 'dob']
  },
  /*
    Constants for residency options
 */
    residencyOptions : [
      {
        option: 'Singaporean',
        value: 1
      },
      {
        option: 'Singapore PR',
        value: 2
      },
      {
        option: 'Foreigner',
        value: 3
      }
    ],

  /*
      Constants for passType  options
  */
  passTypeOptions : [
    {
      option: 'Employment Pass',
      value: 1
    },
    {
      option: 'Personalised Employment Pass',
      value: 2
    },
    {
      option: 'Entre Pass',
      value: 3
    },
    {
      option: 'S Pass',
      value: 4
    },
    {
      option: 'Work Permit',
      value: 5
    },
    {
      option: 'Long Term Visit Pass',
      value: 6
    },
    {
      option: 'Student Pass',
      value: 7
    },
    {
      option: 'Dependant Pass',
      value: 8
    },
    {
       option: 'Overseas Networks & Expertise Pass',
       value: 9
    }
  ],

  passTypeOptionsPc : [
    {
      option: 'Employment Pass',
      value: 1
    },
    {
      option: 'Personalised Employment Pass',
      value: 2
    },
    {
      option: 'Entre Pass',
      value: 3
    },
    {
      option: 'S Pass',
      value: 4
    },
    {
      option: 'Work Permit',
      value: 5
    },
    {
      option: 'Long Term Visit Pass',
      value: 6
    },
    {
      option: 'Student Pass',
      value: 7
    },
    {
      option: 'Dependant Pass',
      value: 8
    },
    {
       option: 'Overseas Networks & Expertise Pass',
       value: 9
    }
  ],

  /*
    Constants for Special Product Code
  */
  joinProductCode: {
    pt: 'TB1-TC1-RB1',
    pgp: 'IN6-IN7-IR7',
    pgrp: 'AL7-AM7'
  },

  /*
    Constants for the duration for upload document
  */
  uploadDocDuration: 50,

  /*
    Constants for the upload document types
  */
  uploadDocFileTypes: '|jpg|png|gif|jpeg|',

  /*
    Constants for the residency code mapping
  */
  residencyCode: {
    singaporean: 1,
    singaporePR: 2,
    epOrWpHolder: 3,
    foreigner: 4
  },

  /*
    Constants for the residency code mapping
  */
  clientIndicator: {
    bth: 'BTH',
    all: 'ALL'
  },

  /*
    Constants for the questionnaire category for Pru questionnaire API required
  */
  questionnaireCategory: {
    QMAY: 'QMAY',
    QPS: 'QPS'
  },

  /*
    Constants for the name of prudential
  */
  prudential: 'PRU',

  /*
    Constants for the default client type
  */
  clientType: 'ML',

  /*
    Constants for the prudential company web site
  */
  prudentialWebsite: 'https://www.prudential.com.sg',

  /*
    Constants for the questionnaire category for Pru questionnaire API required
  */
  planCode: {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: ''
  },

  /*
    Constants for Month list
  */
  monthArray: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  /*

    Constants for mapping the business name of SCB dummy code
  */
  dummyCodeBusinessName :['PruCustomer Care - SCB > FL','PruCustomer Care (SCB MM)'],
  /*

    Constants for Response status
  */
  serviceResponse: {
    statusSuccess: 'success',
    statusError: 'error'
  },

  /*
    Constants for timeout stage description
  */
  timeoutStageDesc: {
    otpRequest: 'Got as far as the "Request OTP" page but did not continue.',
    oneTimePassword: 'Got as far as the "Enter OTP" page but did not continue.',
    entry: 'Got as far as the "Pre-quotation" page but did not continue.',
    estimation: 'Got as far as the "Quotation" page but did not continue.',
    help: 'Got as far as the "Get Help" page but did not continue.',
    detail: 'Got as far as the "your details" section but did not continue.',
    summary: 'Got as far as the "Review Summary" page but did not continue.',
    payment: 'Got as far as the "Payment" page but did not continue.',
    redirectToAgent: 'Got as far as the "Get Help" page but did not continue.'
  },
  /*
    Constants for timeout stage
  */
  timeoutStage: {
    entry: 'entry',
    estimation: 'estimation',
    oneTimePassword: 'oneTimePassword',
    otpRequest: 'otpRequest',
    help: 'redirect_get_new_assistance',
    detail: 'detailsCommon',
    summary: 'summaryCommon',
    payment: 'cyberpay',
    redirectToAgent: 'redirect_to_agent'
  },
  /*
    Set default mid to SIT
    Automatically update depends on deployment env
    non-product: 20111117001
    product: 104201537214
  */
  loadingDuration: 20,
  /*
    Set default time out for the application
    default page timeout 40 mins => 2400 seconds
    default popup timeoput 5 mins => 300 seconds
  */
  timeout: {
    page: 2400,
    popup: 300
  },
  /*
    Special links of different channels
  */
  channelLinks: {
    scb: 'scbprod'
  },
  apiProdConfig: {
    PGP: 1,
    PGRP: 1,
    PS: 1,
    PAS: 1
  },
  /* Set api path */
  apiBasePath: configs.API_BASE_PATH,
  contextPath: configs.CONTEXT_PATH,
  baseUrl: configs.BASE_URL,

  /* country code mapping */
  // PACSDP-507 PTV cases
  countryCodeMapping: {
    CHN: 'CHI',
    INA: 'IND',
    MAL: 'MAL',
  },

  whoWillAssist: {
    default: 'Our Prudential Financial Consultant',
    UOB: 'Your UOB Banker',
    SCB: 'Your Standard Chartered Representative'
  },
  assistBy: {
    DEFAULT: 'Prudential Financial Consultant',
    UOB: 'UOB Banker',
    SCB: 'Standard Chartered Bank (Singapore) Limited representative'
  },
  pruaccess: {
    link: 'https://pruaccess.prudential.com.sg/pruaccess_sg',
    info: 'PruAccess is a self-help portal where you can see the details of all your existing policies and more. You will receive the login credentials to PruAccess after your policy has been incepted.'
  },
  insuranceGuide: {
    link: 'https://www.lia.org.sg/tools-and-resources/consumer-guides/2016/your-guide-to-health-insurance',
    title: 'Your Guide to Health Insurance'
  },
  termAndConditionPdf: [{
    cat: 'Terms_and_Conditions_eContract_eCorrespondence_DP',
    displayName: 'Terms and conditions governing Policy Document and/or electronic correspondence',
    fileUrl: 'pdf/Terms_and_Conditions_eContract_eCorrespondence_DP.pdf',
    fileName: 'Terms_and_Conditions_eContract_eCorrespondence_DP.pdf'
  }],
};

function displayBIPdfName(productName, customerName, reqType) {
  var biName = null;
  if (productName && customerName) {
    if (reqType === 'PGP') {
      biName = 'Policy Illustration and Product Summary - ' + productName;
    } else if (reqType === 'PM' || reqType === 'PL' || reqType === 'PA' || reqType === 'PS') {
      biName = productName + ' Product Summary for ' + customerName;
    } else if (reqType === 'PER') {
      biName = 'PRUEasy Rewards Cover Page, Product Summary and Policy Illustration';
    } else if (reqType === 'PC') {
      biName = 'PRUCancer 360 Cover Page, Product Summary and Policy Illustration';
    } else if (reqType === 'PAT') {
      biName = 'PRUActive Term Cover Page, Product Summary and Policy Illustration';
    }else {
      biName = productName + ' Policy Illustration and Product Summary for ' + customerName;
    }
  } else {
    biName = '';
  }
  return biName;
};

