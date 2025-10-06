import { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  User, 
  Briefcase, 
  BarChart3,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Users,
  ClipboardList,
  Building2,
  Upload,
  FileText,
  Mail,
  Shield,
  Trash2,
  LogOut,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [hrFiles, setHrFiles] = useState([]);
  const [hrError, setHrError] = useState('');
  const [hrResults, setHrResults] = useState([]);
  const [hrAllResults, setHrAllResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const colors = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f',
    secondary: '#9c27b0',
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  };

  const stats = [
    { label: 'Open Roles', value: 0, icon: Briefcase, color: colors.primary },
    { label: 'New Applicants', value: 0, icon: Users, color: colors.success },
    { label: 'Interviews This Week', value: 0, icon: ClipboardList, color: colors.secondary },
    { label: 'Avg. Match Score', value: '0%', icon: TrendingUp, color: colors.warning }
  ];

  const tabs = [
    { id: 'overview', label: 'HR Overview', icon: BarChart3 },
    { id: 'tools', label: 'HR Tools', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'settings', label: 'Settings', icon: User }
  ];

  const recentApplicants = [];

  const getStatusColor = (status) => {
    const normalized = status.toLowerCase();
    if (['shortlisted', 'interviewing'].includes(normalized)) {
      return { background: 'rgba(46, 125, 50, 0.1)', color: colors.success };
    }
    if (['under review'].includes(normalized)) {
      return { background: 'rgba(25, 118, 210, 0.1)', color: colors.primary };
    }
    return { background: 'rgba(158, 158, 158, 0.1)', color: colors.grey[700] };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 80) return colors.primary;
    if (score >= 70) return colors.warning;
    return colors.error;
  };

  function analyzeHR(files) {
    const results = Array.from(files).map((f) => {
      const base = Math.min(95, 50 + Math.floor((f.name.length % 20) * 2.2));
      const score = Math.max(50, Math.min(98, base));
      const skills = ['javascript','react','python','sql','aws','docker','excel','ml'];
      const top = skills
        .map(s => ({ s, v: Math.floor(Math.random() * 60) + 40 }))
        .sort((a, b) => b.v - a.v)
        .slice(0, 4)
        .map(({ s, v }) => ({ skill: s, percent: v }));
      const suggested = top[0]?.skill?.includes('react') || top[0]?.skill?.includes('javascript') ? 'Frontend Engineer' : top[0]?.skill?.includes('python') || top[0]?.skill?.includes('ml') ? 'Data Scientist' : 'Analyst';
      return { name: f.name, size: f.size, score, top, suggested };
    }).sort((a, b) => b.score - a.score);

    return { top5: results.slice(0, 5), all: results };
  }

  const onHrFiles = async (e) => {
    const files = e.target.files || [];
    if (files.length < 5 || files.length > 20) {
      setHrError('Please upload between 5 and 20 resumes.');
      setHrFiles([]);
      setHrResults([]);
      setHrAllResults([]);
      return;
    }
    setHrError('');
    const arr = Array.from(files);
    setHrFiles(arr);
    const result = analyzeHR(files);
    setHrResults(result.top5);
    setHrAllResults(result.all);
  };

  const hrSkillDistribution = useMemo(() => {
    const counts = new Map();
    hrAllResults.forEach(r => {
      r.top.forEach(t => counts.set(t.skill, (counts.get(t.skill) || 0) + 1));
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [hrAllResults]);

  const pieColors = ['#3B82F6','#22C55E','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#84CC16','#F472B6'];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.grey[50],
      padding: '32px 0'
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 16px'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '8px',
      color: colors.grey[900]
    },
    subtitle: {
      color: colors.grey[600],
      fontSize: '1rem'
    },
    tabsContainer: {
      borderBottom: `1px solid ${colors.grey[300]}`,
      display: 'flex',
      gap: '32px',
      marginBottom: '32px'
    },
    tab: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 4px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      color: isActive ? colors.primary : colors.grey[600],
      borderBottom: `2px solid ${isActive ? colors.primary : 'transparent'}`,
      transition: 'all 0.2s'
    }),
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.grey[200]}`
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    iconBox: (color) => ({
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${color}20`
    }),
    input: {
      width: '100%',
      padding: '10px 10px 10px 40px',
      border: `1px solid ${colors.grey[300]}`,
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border 0.2s'
    },
    button: {
      padding: '10px 16px',
      border: `1px solid ${colors.grey[300]}`,
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'background 0.2s'
    },
    chip: (bgColor, textColor) => ({
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: 500,
      background: bgColor,
      color: textColor,
      display: 'inline-block'
    }),
    applicantCard: {
      background: colors.grey[50],
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'background 0.2s',
      cursor: 'pointer'
    },
    uploadBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '128px',
      border: `2px dashed ${colors.grey[300]}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      fontWeight: 600,
      color: colors.grey[700],
      borderBottom: `1px solid ${colors.grey[200]}`
    },
    td: {
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.grey[200]}`
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={styles.title}>HR Dashboard</h1>
            <p style={styles.subtitle}>
              Upload and rank fresher resumes. Manage candidates and roles.
            </p>
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  style={styles.tab(activeTab === index)}
                  onMouseOver={(e) => e.currentTarget.style.color = colors.primary}
                  onMouseOut={(e) => e.currentTarget.style.color = activeTab === index ? colors.primary : colors.grey[600]}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={styles.card}>
                <div style={styles.statCard}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.grey[600], marginBottom: '4px' }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.grey[900] }}>
                      {stat.value}
                    </p>
                  </div>
                  <div style={styles.iconBox(stat.color)}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Search */}
              <div style={styles.card}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.grey[400] }} />
                    <input
                      type="text"
                      placeholder="Search candidates, jobs, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <button style={styles.button}>
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
              </div>

              {/* Recent Applicants */}
              <div style={styles.card}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                  Recent Applicants
                </h3>
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Users size={48} style={{ color: colors.grey[400], margin: '0 auto 16px' }} />
                  <p style={{ color: colors.grey[600], fontSize: '14px' }}>
                    No applicants yet. Upload resumes in HR Tools to get started.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* HR Tools */}
              <div style={styles.card}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: colors.grey[900] }}>
                  Bulk Upload Fresher Resumes (5–20)
                </h4>
                <label 
                  style={styles.uploadBox}
                  onMouseOver={(e) => e.currentTarget.style.background = colors.grey[50]}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <Upload size={24} style={{ color: colors.grey[500], marginBottom: '8px' }} />
                  <span style={{ fontSize: '14px', color: colors.grey[600] }}>
                    Select multiple files (.pdf, .docx, .txt)
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx,.txt" multiple onChange={onHrFiles} style={{ display: 'none' }} />
                </label>
                {hrError && <p style={{ marginTop: '8px', fontSize: '14px', color: colors.error }}>{hrError}</p>}
                {!!hrFiles.length && (
                  <p style={{ marginTop: '8px', fontSize: '14px', color: colors.grey[600] }}>
                    Selected: {hrFiles.length} files
                  </p>
                )}
              </div>

              {hrResults.length > 0 && (
                <div style={styles.card}>
                  <h5 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                    Top 5 Resumes by Score
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {hrResults.map((r, idx) => (
                      <div key={idx} style={{ background: colors.grey[50], borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                              <FileText size={16} />
                              <span style={{ fontWeight: 600, color: colors.grey[900] }}>{r.name}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {r.top.map((t, i) => (
                                <span key={i} style={styles.chip(`${colors.primary}20`, colors.primary)}>
                                  {t.skill} • {t.percent}%
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(r.score) }}>
                            {r.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hrAllResults.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div style={styles.card}>
                    <h5 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: colors.grey[900] }}>
                      Skill Distribution
                    </h5>
                    <div style={{ width: '100%', height: '256px' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={hrSkillDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                            {hrSkillDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <h5 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: colors.grey[900] }}>
                      All Uploaded Resumes
                    </h5>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Score</th>
                            <th style={styles.th}>Key Skills</th>
                            <th style={styles.th}>Suggested Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hrAllResults.map((r, i) => (
                            <tr key={i}>
                              <td style={styles.td}>{r.name}</td>
                              <td style={styles.td}>
                                <span style={{ fontWeight: 600 }}>{r.score}%</span>
                              </td>
                              <td style={styles.td}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {r.top.map((t, j) => (
                                    <span key={j} style={{ ...styles.chip(colors.grey[100], colors.grey[700]), fontSize: '11px' }}>
                                      {t.skill}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={styles.td}>{r.suggested}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div style={{ textAlign: 'center', padding: '96px 0' }}>
              <Users size={64} style={{ color: colors.grey[400], margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '8px', color: colors.grey[900] }}>
                Candidates
              </h3>
              <p style={{ color: colors.grey[600] }}>
                Browse and manage applicants for your open roles.
              </p>
            </div>
          )}

          {activeTab === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '96px 0' }}>
                  <p style={{ color: colors.grey[600] }}>Loading...</p>
                </div>
              ) : (
                <>
                  {/* User Profile Section */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                      Profile Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {/* Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: colors.grey[50], borderRadius: '8px' }}>
                        <div style={styles.iconBox(colors.primary)}>
                          <User size={20} style={{ color: colors.primary }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: colors.grey[600], marginBottom: '4px' }}>Name</p>
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.grey[900] }}>
                            {userData?.name || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: colors.grey[50], borderRadius: '8px' }}>
                        <div style={styles.iconBox(colors.success)}>
                          <Mail size={20} style={{ color: colors.success }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: colors.grey[600], marginBottom: '4px' }}>Email</p>
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.grey[900] }}>
                            {userData?.email}
                          </p>
                        </div>
                      </div>

                      {/* Role */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: colors.grey[50], borderRadius: '8px' }}>
                        <div style={styles.iconBox(colors.secondary)}>
                          <Shield size={20} style={{ color: colors.secondary }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: colors.grey[600], marginBottom: '4px' }}>Role</p>
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.grey[900] }}>
                            {userData?.role}
                          </p>
                        </div>
                      </div>

                      {/* User ID */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: colors.grey[50], borderRadius: '8px' }}>
                        <div style={styles.iconBox(colors.warning)}>
                          <Calendar size={20} style={{ color: colors.warning }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: colors.grey[600], marginBottom: '4px' }}>User ID</p>
                          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.grey[900] }}>
                            #{userData?.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                      Account Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        style={{
                          ...styles.button,
                          width: '100%',
                          justifyContent: 'center',
                          padding: '12px 16px',
                          background: colors.primary,
                          color: 'white',
                          border: 'none',
                          fontWeight: 500
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <LogOut size={18} />
                        Logout
                      </button>

                      {/* Delete Account Button */}
                      <button
                        onClick={handleDeleteAccount}
                        style={{
                          ...styles.button,
                          width: '100%',
                          justifyContent: 'center',
                          padding: '12px 16px',
                          background: deleteConfirm ? colors.error : 'white',
                          color: deleteConfirm ? 'white' : colors.error,
                          border: `1px solid ${colors.error}`,
                          fontWeight: 500
                        }}
                        onMouseOver={(e) => {
                          if (!deleteConfirm) {
                            e.currentTarget.style.background = `${colors.error}10`;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!deleteConfirm) {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        <Trash2 size={18} />
                        {deleteConfirm ? 'Click again to confirm deletion' : 'Delete Account'}
                      </button>
                      {deleteConfirm && (
                        <p style={{ fontSize: '12px', color: colors.error, textAlign: 'center', marginTop: '-8px' }}>
                          Warning: This action cannot be undone!
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}