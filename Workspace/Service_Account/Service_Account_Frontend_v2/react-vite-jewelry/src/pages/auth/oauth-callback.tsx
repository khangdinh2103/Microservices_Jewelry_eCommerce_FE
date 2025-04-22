import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleLoginCallback } from '@/config/api';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Spin, Result } from 'antd';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const callback = searchParams.get('callback') || '/';

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        // The backend already has the OAuth data in the session
        const res = await handleGoogleLoginCallback();
        
        if (res?.data) {
          localStorage.setItem('access_token', res.data.access_token);
          dispatch(setUserLoginInfo(res.data.user));
          
          // Redirect to the callback URL or home page
          window.location.href = callback;
        } else {
          setError(res.message || 'Authentication failed');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication process failed. Please try again.');
      }
    };

    processOAuthLogin();
  }, [dispatch, navigate, callback]);

  if (error) {
    return (
      <Result
        status="error"
        title="Authentication Failed"
        subTitle={error}
        extra={[
          <button key="login" onClick={() => navigate('/login')}>
            Back to Login
          </button>,
        ]}
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="Processing authentication..." />
    </div>
  );
};

export default OAuthCallback;