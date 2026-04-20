export default function RootTestPage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      background: '#f8fafc'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a' }}>DentaFlow ROOT TEST</h1>
      <p style={{ fontSize: '1.25rem', color: '#64748b' }}>If you see this, the Middleware is NOT rewriting this page.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <code>Path: src/app/page.tsx</code>
      </div>
    </div>
  )
}
