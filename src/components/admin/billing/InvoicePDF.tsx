import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  clinicInfo: {
    flexDirection: 'column',
  },
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  colCode: { width: '15%' },
  colDesc: { width: '55%' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right', fontWeight: 'bold' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 4,
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  }
})

export const InvoicePDF = ({ invoice, clinic, patient }: any) => {
  const subtotal = invoice.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0)
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text>{clinic.address}</Text>
            <Text>{clinic.phone}</Text>
            <Text>{clinic.email}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE #{invoice.id.slice(-6).toUpperCase()}</Text>
            <Text style={{ textAlign: 'right' }}>Date: {new Date(invoice.createdAt).toLocaleDateString('fr-CA')}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Facturé à :</Text>
          <Text>{patient.firstName} {patient.lastName}</Text>
          <Text>{patient.address || 'Adresse non renseignée'}</Text>
          <Text>{patient.email}</Text>
        </View>

        {/* Table */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.colCode}>Code</Text>
          <Text style={styles.colDesc}>Description de l'acte</Text>
          <Text style={styles.colPrice}>Prix Unit.</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {invoice.items.map((item: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={styles.colCode}>{item.code || '-'}</Text>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colPrice}>{(item.unitPrice / 100).toFixed(2)}$</Text>
            <Text style={styles.colTotal}>{(item.totalPrice / 100).toFixed(2)}$</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={{ width: '85%', textAlign: 'right', paddingRight: 10 }}>Sous-total</Text>
            <Text style={{ width: '15%', textAlign: 'right' }}>{(subtotal / 100).toFixed(2)}$</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ width: '85%', textAlign: 'right', paddingRight: 10 }}>Taxes (TPS/TVQ)</Text>
            <Text style={{ width: '15%', textAlign: 'right' }}>{(invoice.taxAmount / 100).toFixed(2)}$</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={{ width: '85%', textAlign: 'right', paddingRight: 10 }}>TOTAL À PAYER</Text>
            <Text style={{ width: '15%', textAlign: 'right' }}>{(invoice.totalAmount / 100).toFixed(2)}$</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Merci de votre confiance. Les paiements sont dus à réception, sauf entente contraire.</Text>
          <Text>Oros - Propulsé par Oros</Text>
        </View>
      </Page>
    </Document>
  )
}
