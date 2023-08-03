Sure! Here's the updated code in a React .tsx file using functional components and TypeScript types:

```tsx
import React, { useState } from 'react';

type Pdf = {
  displayName: string;
  cat: string;
  fileUrl: string;
  fileName: string;
};

type Props = {
  product: {
    prodName: string;
    basic: {
      optDescp: string;
    };
  };
  customerName: string;
  reqType: string;
  pdfList: Pdf[];
};

const WhatYouBuy: React.FC<Props> = ({ product, customerName, reqType, pdfList }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openPdf = (pdf: Pdf) => {
    // Implement the logic to open the PDF
  };

  const downloadPDF