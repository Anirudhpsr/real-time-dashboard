import { useState, useEffect, useCallback } from 'react';
import { Activity, History, RefreshCw, Wifi, WifiOff, AlertTriangle, Loader, TrendingUp, AlertCircle, Check } from 'lucide-react';


const generateHistoricalData = (count) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    data.push({
      value: Math.floor(Math.random() * 100),
      timestamp: new Date(now - i * 60000).toISOString(),
      status: Math.random() > 0.9 ? 'warning' : 'normal'
    });
  }
  
  return data;
};

// Dashboard Component
export default function Dashboard() {
  const [realTimeData, setRealTimeData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isWebSocketActive, setIsWebSocketActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsError, setWsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define theme colors based on mode
  const theme = {
    bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
    card: isDarkMode ? '#16213e' : '#ffffff',
    text: isDarkMode ? '#e1e1e1' : '#212529',
    textSecondary: isDarkMode ? '#a0a0a0' : '#6c757d',
    border: isDarkMode ? '#252a41' : '#e9ecef',
    primary: isDarkMode ? '#4361ee' : '#3a86ff',
    accent: isDarkMode ? '#3f72af' : '#00b4d8',
    success: isDarkMode ? '#2ecc71' : '#198754',
    warning: isDarkMode ? '#ff7e67' : '#dc3545',
    highlight: isDarkMode ? '#1e3a8a' : '#e9f5ff',
    headerBg: isDarkMode ? '#0f172a' : '#ffffff'
  };

  // Fetch historical data via REST API
  const fetchHistoricalData = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      try {
        const data = generateHistoricalData(10);
        setHistoricalData(data);
        setIsLoading(false);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to fetch historical data');
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  // WebSocket connection simulation
  useEffect(() => {
    if (!isWebSocketActive) return;
    
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws`);

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if("Heartbeat" != parsedData.value) {
            console.log('Received data:', parsedData);

            const newData = {
                value: parsedData.value,
                timestamp: new Date().toISOString(),
                status: parsedData.status > 0.9 ? 'warning' : 'normal',
            };

            // Update real-time data only when a message is received
            setRealTimeData((prev) => {
        const updated = [newData, ...prev];
                return updated.slice(0, 20); // Keep only the 20 most recent items
            });
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsError('WebSocket connection failed. Please try again later.');
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    
    return () => {
        ws.close(); // Cleanup WebSocket connection on component unmount
    };
  }, [isWebSocketActive]);

  // Short polling for data when WebSocket is disabled
  useEffect(() => {
    if (isWebSocketActive) return;
    
    const pollInterval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Poll every 30 seconds
    
    setLastUpdated(new Date());
    
    return () => clearInterval(pollInterval);
  }, [isWebSocketActive]);

  // Fetch historical data on component mount
  useEffect(() => {
    fetchHistoricalData();
    
    // Set up interval for refreshing historical data
    const historyInterval = setInterval(fetchHistoricalData, 30000);
    
    return () => clearInterval(historyInterval);
  }, [fetchHistoricalData]);

  const toggleDataMethod = () => {
    setIsWebSocketActive(!isWebSocketActive);
  };

  const refreshHistoricalData = () => {
    fetchHistoricalData();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Enhanced styling with inline styles
  const styles = {
    container: {
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: theme.bg,
      color: theme.text,
      transition: 'all 0.3s ease',
      minHeight: '100vh'
    },
    header: {
      marginBottom: '24px',
      padding: '20px',
      backgroundColor: theme.headerBg,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      borderLeft: `4px solid ${theme.primary}`
    },
    title: {
      margin: '0',
      fontSize: '28px',
      fontWeight: '700',
      color: theme.text
    },
    headerControls: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center'
    },
    lastUpdated: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: theme.textSecondary,
      fontSize: '14px'
    },
    dataSourceToggle: {
      padding: '10px 16px',
      backgroundColor: isWebSocketActive ? theme.primary : theme.accent,
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
      }
    },
    themeSwitcher: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      color: theme.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    panel: {
      backgroundColor: theme.card,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    panelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px',
      alignItems: 'center',
      borderBottom: `2px solid ${theme.border}`,
      paddingBottom: '12px'
    },
    panelTitle: {
      margin: '0',
      fontSize: '18px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: theme.text
    },
    connectionBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    websocketBadge: {
      backgroundColor: isDarkMode ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.15)',
      color: theme.success
    },
    pollingBadge: {
      backgroundColor: isDarkMode ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.15)',
      color: theme.accent
    },
    button: {
      padding: '8px 14px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    },
    refreshButton: {
      backgroundColor: isDarkMode ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.15)',
      color: theme.accent
    },
    scrollContainer: {
      maxHeight: '400px',
      overflowY: 'auto',
      flex: '1'
    },
    dataList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0'
    },
    dataItem: {
      padding: '14px 12px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: theme.highlight
      }
    },
    dataValue: {
      fontSize: '24px',
      fontWeight: '600',
      color: theme.text
    },
    dataTimestamp: {
      fontSize: '13px',
      color: theme.textSecondary,
      marginTop: '4px'
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    normalBadge: {
      backgroundColor: isDarkMode ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.15)',
      color: theme.success
    },
    warningBadge: {
      backgroundColor: isDarkMode ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.15)',
      color: theme.warning
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0'
    },
    tableHead: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      position: 'sticky',
      top: '0'
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '12px 16px',
      borderBottom: `1px solid ${theme.border}`,
      fontSize: '14px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
      color: theme.textSecondary,
      gap: '12px'
    },
    loadingState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 0',
      gap: '12px',
      color: theme.textSecondary
    },
    errorAlert: {
      backgroundColor: isDarkMode ? 'rgba(231, 76, 60, 0.1)' : 'rgba(231, 76, 60, 0.08)',
      color: theme.warning,
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: `4px solid ${theme.warning}`
    },
    footer: {
      backgroundColor: theme.card,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    },
    statBox: {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    statIcon: {
      backgroundColor: theme.primary,
      color: 'white',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '6px'
    },
    statTitle: {
      margin: '0',
      fontSize: '13px',
      color: theme.textSecondary,
      fontWeight: '500'
    },
    statValue: {
      margin: '0',
      fontSize: '28px',
      fontWeight: '700',
      color: theme.text
    },
    warningCount: {
      fontSize: '12px',
      color: theme.warning,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  // Combined styles for composition
  const combinedStyles = {
    websocketBadge: { ...styles.connectionBadge, ...styles.websocketBadge },
    pollingBadge: { ...styles.connectionBadge, ...styles.pollingBadge },
    normalBadge: { ...styles.statusBadge, ...styles.normalBadge },
    warningBadge: { ...styles.statusBadge, ...styles.warningBadge },
    refreshButton: { ...styles.button, ...styles.refreshButton }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Real-Time Dashboard</h1>
        <div style={styles.headerControls}>
          <div style={styles.lastUpdated}>
            <RefreshCw size={16} />
            <span>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}</span>
          </div>
          <button onClick={toggleDataMethod} style={styles.dataSourceToggle}>
            {isWebSocketActive ? (
              <>
                <Wifi size={16} />
                Using WebSocket
              </>
            ) : (
              <>
                <WifiOff size={16} />
                Using Polling (30s)
              </>
            )}
          </button>
          <button onClick={toggleDarkMode} style={styles.themeSwitcher}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div style={styles.gridContainer}>
        {/* Real-time data section */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>
              <Activity size={18} />
              Real-time Data
            </h2>
            <div>
              {isWebSocketActive ? (
                <span style={combinedStyles.websocketBadge}>
                  <Wifi size={12} />
                  WebSocket
                </span>
              ) : (
                <span style={combinedStyles.pollingBadge}>
                  <RefreshCw size={12} />
                  Polling
                </span>
              )}
            </div>
          </div>

          {/* WebSocket error message */}
          {wsError && (
            <div style={styles.errorAlert}>
              <AlertTriangle size={16} />
              <span>{wsError}</span>
            </div>
          )}

          {/* Real-time data display */}
          <div style={styles.scrollContainer}>
            {realTimeData.length > 0 ? (
              <ul style={styles.dataList}>
                {realTimeData.map((item, index) => (
                  <li key={index} style={styles.dataItem}>
                    <div>
                      <div style={styles.dataValue}>{item.value}</div>
                      <div style={styles.dataTimestamp}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      {item.status === 'warning' ? (
                        <span style={combinedStyles.warningBadge}>
                          <AlertCircle size={12} />
                          Warning
                        </span>
                      ) : (
                        <span style={combinedStyles.normalBadge}>
                          <Check size={12} />
                          Normal
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.emptyState}>
                <Activity size={32} />
                <span>Waiting for data...</span>
              </div>
            )}
          </div>
        </div>

        {/* Historical data section */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>
              <History size={18} />
              Historical Data
            </h2>
            <button onClick={refreshHistoricalData} style={combinedStyles.refreshButton}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorAlert}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div style={styles.loadingState}>
              <Loader size={20} className="animate-spin" />
              <span>Loading historical data...</span>
            </div>
          ) : (
            <div style={styles.scrollContainer}>
              {historicalData.length > 0 ? (
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.th}>Timestamp</th>
                      <th style={styles.th}>Value</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{new Date(item.timestamp).toLocaleString()}</td>
                        <td style={styles.td}>{item.value}</td>
                        <td style={styles.td}>
                          {item.status === 'warning' ? (
                            <span style={combinedStyles.warningBadge}>
                              <AlertCircle size={12} />
                              Warning
                            </span>
                          ) : (
                            <span style={combinedStyles.normalBadge}>
                              <Check size={12} />
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>
                  <History size={32} />
                  <span>No historical data available</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer with summary stats */}
      <div style={styles.footer}>
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <div style={styles.statIcon}>
              <Activity size={18} />
            </div>
            <h3 style={styles.statTitle}>Total Data Points</h3>
            <p style={styles.statValue}>{realTimeData.length + historicalData.length}</p>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statIcon, backgroundColor: theme.accent }}>
              {isWebSocketActive ? <Wifi size={18} /> : <RefreshCw size={18} />}
            </div>
            <h3 style={styles.statTitle}>Data Source</h3>
            <p style={styles.statValue}>{isWebSocketActive ? 'WebSocket' : 'REST API'}</p>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statIcon, backgroundColor: theme.warning }}>
              <AlertTriangle size={18} />
            </div>
            <h3 style={styles.statTitle}>Warning Points</h3>
            <p style={styles.statValue}>
              {[...realTimeData, ...historicalData].filter(item => item.status === 'warning').length}
            </p>
            <span style={styles.warningCount}>
              <AlertCircle size={12} />
              {Math.round([...realTimeData, ...historicalData].filter(item => item.status === 'warning').length / 
                ([...realTimeData, ...historicalData].length || 1) * 100)}% of total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}