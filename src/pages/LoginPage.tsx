import { useState } from 'react';
import { AtSign, LockKeyhole, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import googleIcon from '../assets/google.png';
import backgroundImage from '../assets/header-login.png';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Informe seu e-mail e senha para continuar.');
      return;
    }

    if (!acceptedTerms) {
      setError('Você precisa aceitar os termos antes de entrar.');
      return;
    }

    const success = login(email, password);

    if (!success) {
      setError('Não foi possível entrar com essas credenciais.');
      return;
    }

    setError('');
    navigate('/dashboard', { replace: true });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div
          className="hero-panel"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />

        <div className="login-card">
          <div className="login-content">
            <div className="brand-mark" aria-label="Aqua IoT logo">
              <Waves size={34} />
              <span>Aqua IoT</span>
            </div>

            <h1 className="title">Garanta a segurança dos peixeis com monitoramento preciso</h1>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field" htmlFor="email">
                <span className="field-icon" aria-hidden="true">
                  <AtSign size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>

              <label className="field" htmlFor="password">
                <span className="field-icon" aria-hidden="true">
                  <LockKeyhole size={18} />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>

              <label className="checkbox-row" htmlFor="terms">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>Concordo com os termos de uso.</span>
              </label>

              {error ? <p className="error-message">{error}</p> : null}

              <button type="submit" className="primary-button">
                Entrar
              </button>
            </form>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
            >
              <img src={googleIcon} alt="Google" className="google-icon-img" />
              <span>Entrar com Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
