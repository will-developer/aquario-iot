import { useState } from 'react';
import { AtSign, LockKeyhole, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import googleIcon from '../assets/google.png';
import heroDesktop from '../assets/header-login.webp';
import heroMobile from '../assets/header-mobile.webp';
import { FormField } from '../components/ui/FormField';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

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

    if (!login(email, password)) {
      setError('Não foi possível entrar com essas credenciais.');
      return;
    }

    setError('');
    navigate('/dashboard', { replace: true });
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (googleError) {
      setError(
        googleError instanceof Error
          ? googleError.message
          : 'Login com Google falhou.',
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-brand-50">
      <div
        className="absolute inset-0 bg-[image:var(--hero-desktop)] bg-cover bg-left bg-no-repeat max-tablet:bg-[image:var(--hero-mobile)] max-tablet:bg-center"
        style={
          {
            '--hero-desktop': `url(${heroDesktop})`,
            '--hero-mobile': `url(${heroMobile})`,
          } as React.CSSProperties
        }
      />

      <div className="absolute inset-0 bg-[image:var(--hero-overlay)]" />

      <div className="absolute inset-y-0 left-[5.5%] z-2 flex w-[28%] items-center justify-center bg-login-card px-7 py-8 max-tablet:left-0 max-tablet:w-full max-tablet:overflow-y-auto max-tablet:px-5 max-tablet:pt-7 max-tablet:pb-10.5">
        <div className="w-full max-w-[500px] text-center">
          <div className="mb-4.5 inline-flex items-center gap-2.5 text-[clamp(1.15rem,1.7vw,1.6rem)] font-extrabold tracking-wider text-login-logo uppercase max-mobile:text-base">
            <Waves size={34} className="text-login-icon" />
            <span>Aqua IoT</span>
          </div>

          <h1 className="mb-7 font-display text-2xl font-black tracking-tighter text-login-title max-mobile:text-[1.9rem]">
            Garanta a segurança dos peixeis com monitoramento preciso
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <FormField
              id="email"
              icon={AtSign}
              type="email"
              placeholder="e-mail"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            <FormField
              id="password"
              icon={LockKeyhole}
              type="password"
              placeholder="senha"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            <label
              htmlFor="terms"
              className="mt-1 flex items-center gap-3 text-[0.9rem] font-semibold text-login-text"
            >
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="size-4.5 accent-aqua-500"
              />
              <span>Concordo com os termos de uso.</span>
            </label>

            {error ? (
              <p className="text-[0.8rem] font-bold text-login-error">{error}</p>
            ) : null}

            <button
              type="submit"
              className="mt-2 min-h-14 rounded-control bg-linear-to-b from-aqua-400 to-aqua-600 font-extrabold tracking-[0.08em] text-on-primary uppercase shadow-control transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-control-hover max-mobile:min-h-12.5"
            >
              Entrar
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-control border border-google-border bg-white font-bold text-google-text shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-soft-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-mobile:min-h-12.5"
          >
            <img src={googleIcon} alt="" className="size-4.5 object-contain" />
            <span className="leading-none">
              {googleLoading ? 'Conectando...' : 'Entrar com Google'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
