import { useState, useEffect } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import Invoice from '@/components/order/Invoice';

export const showDownloadLink = (item) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFDownloadLink
          document={<Invoice order={item} />}
          fileName="invoice.pdf"
          className="btn btn-sm btn-block btn-outline-primary"
        >
          Download PDF
        </PDFDownloadLink>
      )}
    </>
  );
};
