import React from 'react';

export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1c1917', 
      color: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>图鉴博物馆</h1>
      <p style={{ color: '#a8a29e' }}>测试页面 - 如果你看到此页面，说明 React 工作正常</p>
    </div>
  );
}
