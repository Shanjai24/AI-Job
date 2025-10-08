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
  Calendar,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // ML Matching states
  const [mlFiles, setMlFiles] = useState([]);
  const [mlError, setMlError] = useState('');
  const [mlLoading, setMlLoading] = useState(false);
  const [mlResults, setMlResults] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [minEducation, setMinEducation] = useState('3');
  const [minExperience, setMinExperience] = useState('0');
  const [topN, setTopN] = useState('5');
  
  // Upload history
  const [uploadHistory, setUploadHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

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
    { label: 'Total Uploads', value: dashboardStats?.totalUploads || 0, icon: Briefcase, color: colors.primary },
    { label: 'Candidates Reviewed', value: dashboardStats?.totalCandidates || 0, icon: Users, color: colors.success },
    { label: 'Avg Match Score', value: `${dashboardStats?.avgScore || 0}%`, icon: TrendingUp, color: colors.warning },
    { label: 'Open Roles', value: '0', icon: ClipboardList, color: colors.secondary }
  ];

  const tabs = [
    { id: 'overview', label: 'HR Overview', icon: BarChart3 },
    { id: 'tools', label: 'ML Matcher', icon: Briefcase },
    { id: 'history', label: 'Upload History', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: User }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 80) return colors.primary;
    if (score >= 70) return colors.warning;
    return colors.error;
  };

  useEffect(() => {
    fetchUserData();
    fetchDashboardStats();
    fetchUploadHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:3000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/upload-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUploadHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleMlSubmit = async () => {
    if (mlFiles.length < 5 || mlFiles.length > 20) {
      setMlError('Please upload between 5 and 20 resumes');
      return;
    }

    if (!jobRole || !jobDescription) {
      setMlError('Job role and description are required');
      return;
    }

    setMlLoading(true);
    setMlError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      mlFiles.forEach(file => formData.append('files', file));
      formData.append('jobRole', jobRole);
      formData.append('jobDescription', jobDescription);
      formData.append('requiredSkills', requiredSkills);
      formData.append('minEducation', minEducation);
      formData.append('minExperience', minExperience);
      formData.append('topN', topN);

      const response = await fetch('http://localhost:3000/api/match-resumes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process resumes');
      }

      const data = await response.json();
      setMlResults(data.results);
      
      // Refresh stats and history
      fetchDashboardStats();
      fetchUploadHistory();
      
      // Clear form
      setMlFiles([]);
      setJobRole('');
      setJobDescription('');
      setRequiredSkills('');
    } catch (error) {
      setMlError(error.message);
    } finally {
      setMlLoading(false);
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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const styles = {
    container: { minHeight: '100vh', background: colors.grey[50], padding: '32px 0' },
    maxWidth: { maxWidth: '1400px', margin: '0 auto', padding: '0 16px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '2rem', fontWeight: 700, marginBottom: '8px', color: colors.grey[900] },
    subtitle: { color: colors.grey[600], fontSize: '1rem' },
    tabsContainer: { borderBottom: `1px solid ${colors.grey[300]}`, display: 'flex', gap: '32px', marginBottom: '32px' },
    tab: (isActive) => ({
      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 4px', border: 'none',
      background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
      color: isActive ? colors.primary : colors.grey[600],
      borderBottom: `2px solid ${isActive ? colors.primary : 'transparent'}`, transition: 'all 0.2s'
    }),
    card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${colors.grey[200]}` },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' },
    statCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconBox: (color) => ({ width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}20` }),
    input: { width: '100%', padding: '10px', border: `1px solid ${colors.grey[300]}`, borderRadius: '8px', fontSize: '14px', outline: 'none' },
    textarea: { width: '100%', padding: '10px', border: `1px solid ${colors.grey[300]}`, borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '100px', resize: 'vertical' },
    button: { padding: '10px 16px', border: 'none', borderRadius: '8px', background: colors.primary, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 },
    chip: (bgColor, textColor) => ({ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 500, background: bgColor, color: textColor, display: 'inline-block', marginRight: '8px', marginBottom: '8px' }),
    label: { fontSize: '14px', fontWeight: 500, color: colors.grey[700], marginBottom: '8px', display: 'block' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={styles.title}>HR Dashboard - ML Powered</h1>
            <p style={styles.subtitle}>AI-powered resume matching and ranking system</p>
          </div>

          <div style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(index)} style={styles.tab(activeTab === index)}>
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={styles.card}>
                <div style={styles.statCard}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.grey[600], marginBottom: '4px' }}>{stat.label}</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.grey[900] }}>{stat.value}</p>
                  </div>
                  <div style={styles.iconBox(stat.color)}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={styles.card}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Welcome to ML-Powered Matching</h3>
              <p style={{ color: colors.grey[600], marginBottom: '16px' }}>
                Upload resumes and let our AI rank candidates based on job requirements using advanced NLP and machine learning.
              </p>
              <button onClick={() => setActiveTab(1)} style={styles.button}>
                Get Started <Upload size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={styles.card}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>ML Resume Matcher</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={styles.label}>Job Role *</label>
                  <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g., Senior Python Developer" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Required Skills (comma separated)</label>
                  <input type="text" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} placeholder="e.g., python, django, aws" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Min Education</label>
                  <select value={minEducation} onChange={(e) => setMinEducation(e.target.value)} style={styles.input}>
                    <option value="0">Any</option>
                    <option value="2">Diploma</option>
                    <option value="3">Bachelor's</option>
                    <option value="4">Master's</option>
                    <option value="5">PhD</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Min Experience (years)</label>
                  <input type="number" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} min="0" style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Top N Candidates</label>
                  <input type="number" value={topN} onChange={(e) => setTopN(e.target.value)} min="1" max="20" style={styles.input} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Job Description *</label>
                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Describe the job role, requirements, and responsibilities..." style={styles.textarea} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Upload Resumes (5-20 files) *</label>
                <input type="file" accept=".pdf,.docx,.doc" multiple onChange={(e) => setMlFiles(Array.from(e.target.files))} style={{ ...styles.input, padding: '8px' }} />
                {mlFiles.length > 0 && (
                  <p style={{ marginTop: '8px', fontSize: '14px', color: colors.grey[600] }}>
                    Selected: {mlFiles.length} files
                  </p>
                )}
              </div>

              {mlError && (
                <div style={{ padding: '12px', background: `${colors.error}20`, color: colors.error, borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                  {mlError}
                </div>
              )}

              <button onClick={handleMlSubmit} disabled={mlLoading} style={{ ...styles.button, opacity: mlLoading ? 0.6 : 1 }}>
                {mlLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} />
                    Rank Candidates with AI
                  </>
                )}
              </button>
            </div>

            {mlResults && (
              <div style={styles.card}>
                <h5 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                  Top {mlResults.top_candidates.length} Candidates (out of {mlResults.total_resumes})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mlResults.top_candidates.map((candidate, idx) => (
                    <div key={idx} style={{ background: colors.grey[50], borderRadius: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: getScoreColor(candidate.score), 
                              color: 'white', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 700 
                            }}>
                              #{idx + 1}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} />
                                <span style={{ fontWeight: 600, color: colors.grey[900] }}>{candidate.filename}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                            <div>
                              <p style={{ fontSize: '12px', color: colors.grey[600] }}>Overall Score</p>
                              <p style={{ fontSize: '18px', fontWeight: 700, color: getScoreColor(candidate.score) }}>
                                {candidate.score}%
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '12px', color: colors.grey[600] }}>Semantic Match</p>
                              <p style={{ fontSize: '18px', fontWeight: 700, color: colors.primary }}>
                                {candidate.semantic_score}%
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '12px', color: colors.grey[600] }}>Feature Match</p>
                              <p style={{ fontSize: '18px', fontWeight: 700, color: colors.secondary }}>
                                {candidate.feature_score}%
                              </p>
                            </div>
                          </div>

                          {candidate.matched_skills && candidate.matched_skills.length > 0 && (
                            <div style={{ marginBottom: '12px' }}>
                              <p style={{ fontSize: '12px', color: colors.grey[600], marginBottom: '8px' }}>Matched Skills:</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {candidate.matched_skills.map((skill, i) => (
                                  <span key={i} style={styles.chip(`${colors.success}20`, colors.success)}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {candidate.education_match ? (
                                <CheckCircle size={16} style={{ color: colors.success }} />
                              ) : (
                                <XCircle size={16} style={{ color: colors.error }} />
                              )}
                              <span style={{ color: colors.grey[700] }}>Education</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {candidate.experience_match ? (
                                <CheckCircle size={16} style={{ color: colors.success }} />
                              ) : (
                                <XCircle size={16} style={{ color: colors.error }} />
                              )}
                              <span style={{ color: colors.grey[700] }}>Experience</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Upload History</h3>
            {uploadHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {uploadHistory.map((upload) => (
                  <div key={upload.id} style={{ padding: '16px', background: colors.grey[50], borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: colors.grey[900], marginBottom: '4px' }}>{upload.job_role}</p>
                      <p style={{ fontSize: '14px', color: colors.grey[600] }}>
                        {upload.total_resumes} resumes â€¢ Top {upload.required_candidates} selected
                      </p>
                      <p style={{ fontSize: '12px', color: colors.grey[500], marginTop: '4px' }}>
                        {new Date(upload.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => window.open(`http://localhost:3000/api/candidates/${upload.id}`, '_blank')}
                      style={{ ...styles.button, background: 'white', color: colors.primary, border: `1px solid ${colors.primary}` }}
                    >
                      View Results
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <ClipboardList size={48} style={{ color: colors.grey[400], margin: '0 auto 16px' }} />
                <p style={{ color: colors.grey[600] }}>No upload history yet. Start matching resumes!</p>
              </div>
            )}
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
                <div style={styles.card}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                    Profile Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                <div style={styles.card}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: colors.grey[900] }}>
                    Account Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        ...styles.button,
                        width: '100%',
                        justifyContent: 'center',
                        padding: '12px 16px'
                      }}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      style={{
                        ...styles.button,
                        width: '100%',
                        justifyContent: 'center',
                        padding: '12px 16px',
                        background: deleteConfirm ? colors.error : 'white',
                        color: deleteConfirm ? 'white' : colors.error,
                        border: `1px solid ${colors.error}`
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
  );
}