import React from 'react'

const EnvironmentInfo = () => {
  const environment = process.env.GATSBY_ENVIRONMENT || 'local'
  const apiUrl = process.env.GATSBY_API_URL || 'http://localhost:3001'
  const analyticsEnabled = process.env.GATSBY_ENABLE_ANALYTICS === 'true'
  const errorReportingEnabled = process.env.GATSBY_ENABLE_ERROR_REPORTING === 'true'

  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'prod':
        return '#28a745' // Green
      case 'beta':
        return '#ffc107' // Yellow
      case 'local':
      default:
        return '#6c757d' // Gray
    }
  }

  const getEnvironmentIcon = (env) => {
    switch (env) {
      case 'prod':
        return '🚀'
      case 'beta':
        return '🧪'
      case 'local':
      default:
        return '💻'
    }
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: `2px solid ${getEnvironmentColor(environment)}`,
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      fontSize: '0.9rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: getEnvironmentColor(environment)
      }}>
        <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>
          {getEnvironmentIcon(environment)}
        </span>
        Environment: {environment.toUpperCase()}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
        <div>
          <strong>API URL:</strong><br />
          <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px', borderRadius: '3px' }}>
            {apiUrl}
          </code>
        </div>
        
        <div>
          <strong>Features:</strong><br />
          <span style={{ color: analyticsEnabled ? '#28a745' : '#dc3545' }}>
            Analytics: {analyticsEnabled ? '✅' : '❌'}
          </span><br />
          <span style={{ color: errorReportingEnabled ? '#28a745' : '#dc3545' }}>
            Error Reporting: {errorReportingEnabled ? '✅' : '❌'}
          </span>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '0.5rem', 
        fontSize: '0.7rem', 
        color: '#6c757d',
        borderTop: '1px solid #dee2e6',
        paddingTop: '0.5rem'
      }}>
        Build time: {new Date().toISOString()}
      </div>
    </div>
  )
}

export default EnvironmentInfo

