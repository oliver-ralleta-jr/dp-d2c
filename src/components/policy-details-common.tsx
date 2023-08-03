Sure! Here's the updated code in a React .tsx file using functional components and TypeScript types:

```tsx
import React, { useState } from 'react';

type PolicyDetailsProps = {
  reqType: string;
  profile: {
    type: string;
    currencyCode: string;
    anb: number;
  };
  policy: {
    hasDiscount: boolean;
    sumYearlyPremium: number;
    discountedPremium: number;
    discountedYearlyPremium: number;
    planName: string;
    optDescp: string;
    rider: {
      compoName: string;
    }[];
  };
  isLoading: boolean;
  currency: string;
 