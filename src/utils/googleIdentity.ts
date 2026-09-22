const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let loader: Promise<void> | null = null;

export function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  // Cached so concurrent callers share one <script> injection.
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loader = null;
      reject(new Error('Nao foi possivel carregar o Google Identity Services.'));
    };

    document.head.appendChild(script);
  });

  return loader;
}
