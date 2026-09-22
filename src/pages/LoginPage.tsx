import { useState } from 'react';
import { AtSign, LockKeyhole, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import googleIcon from '../assets/google.png';
import backgroundImage from '../assets/header-login.webp';
import backgroundImageMobile from '../assets/header-mobile.webp';
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

    const success = login(email, password);

    if (!success) {
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
    <div className="h-screen w-full max-tablet:h-auto max-tablet:min-h-screen">
      <div className="relative h-full w-full overflow-hidden bg-brand-50 max-tablet:h-screen">
        <div
          className="absolute inset-0 bg-[image:var(--hero-bg-desktop)] bg-cover bg-left bg-no-repeat max-tablet:bg-[image:var(--hero-bg-mobile)] max-tablet:bg-center"
          style={
            {
              '--hero-bg-desktop': `url(${backgroundImage})`,
              '--hero-bg-mobile': `url(${backgroundImageMobile})`,
            } as React.CSSProperties
          }
        />

        <div className="absolute inset-0 bg-[image:var(--overlay-hero-desktop)] max-tablet:bg-[image:var(--overlay-hero-mobile)]" />

        <div className="absolute inset-y-0 left-[5.5%] z-[2] flex w-[28%] items-center justify-center bg-[#fcfdfd] px-7 py-8 max-tablet:left-0 max-tablet:w-full max-tablet:bg-transparent max-tablet:px-5 max-tablet:pt-7 max-tablet:pb-[42px]">
          <div className="w-full max-w-[500px] text-center">
            <div
              className="mb-[18px] inline-flex items-center gap-2.5 text-[clamp(1.15rem,1.7vw,1.6rem)] font-extrabold tracking-[0.05em] text-brand-700 uppercase max-tablet:text-[#eaf6fb] max-mobile:text-base"
              aria-label="Aqua IoT logo"
            >
              <Waves size={34} className="text-aqua-500 max-tablet:text-aqua-300" />
              <span>Aqua IoT</span>
            </div>

            <h1 className="mb-7 font-display text-2xl font-black tracking-[-0.05em] text-brand-950 max-tablet:text-[#f5fbff] max-mobile:text-[1.9rem]">
              Garanta a segurança dos peixeis com monitoramento preciso
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
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
                className="mt-1 flex items-center gap-3 text-[0.9rem] font-semibold text-[rgba(18,36,45,0.9)] max-tablet:text-[rgba(245,251,255,0.92)]"
              >
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="h-[18px] w-[18px] accent-[#16b7d7]"
                />
                <span>Concordo com os termos de uso.</span>
              </label>

              {error ? (
                <p className="text-[0.8rem] font-bold text-[#b42318] max-tablet:text-[#ffb4a8]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-2 min-h-[56px] rounded-[14px] bg-linear-to-b from-aqua-400 to-aqua-600 font-extrabold tracking-[0.08em] text-[#f5faff] uppercase shadow-[0_8px_22px_rgba(21,176,209,0.38)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_10px_26px_rgba(21,176,209,0.42)] max-mobile:min-h-[50px]"
              >
                Entrar
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] border border-[rgba(81,97,112,0.28)] bg-white font-bold text-[#1f2a37] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-mobile:min-h-[50px]"
            >
              <img
                src={googleIcon}
                alt=""
                className="block h-[18px] w-[18px] object-contain"
              />
              <span className="leading-none">
                {googleLoading ? 'Conectando...' : 'Entrar com Google'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
