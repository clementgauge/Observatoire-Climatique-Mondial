import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  lang?: 'fr' | 'en';
  variant?: 'header' | 'mobile' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'fr',
  variant = 'header',
}) => {
  const isEn = lang === 'en';
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
      return;
    }
    setShowGuideModal(true);
  };

  const buttonClasses =
    variant === 'mobile'
      ? 'w-full px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer'
      : variant === 'compact'
      ? 'px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg inline-flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-2xs'
      : 'px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg inline-flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-2xs';

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={buttonClasses}
        title={
          isEn
            ? 'Install Global Climate Observatory App (PWA)'
            : 'Télécharger l’application Observatoire Climatique (PWA)'
        }
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>
          {variant === 'compact'
            ? isEn
              ? 'Install App'
              : 'Installer l’Appli'
            : isEn
            ? 'Install App (PWA)'
            : 'Télécharger l’Appli'}
        </span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xl text-slate-900">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="pwa-modal-title" className="text-base font-bold text-slate-900">
                    {isEn
                      ? 'Install Global Climate Observatory'
                      : 'Installer l’Observatoire Climatique (PWA)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? 'Fast home screen access & offline scientific cache'
                      : 'Accès direct sur l’écran d’accueil & mode hors-ligne'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                aria-label={isEn ? 'Close' : 'Fermer'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700">
              {isIOS ? (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Share className="w-4 h-4 text-emerald-700" />
                    <span>{isEn ? 'On iPhone / iPad (Safari):' : 'Sur iPhone / iPad (Safari) :'}</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>
                      {isEn ? (
                        <>
                          Tap the <strong>Share</strong> icon in the bottom Safari toolbar.
                        </>
                      ) : (
                        <>
                          Appuyez sur le bouton <strong>Partager</strong> dans la barre d’outils Safari.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn ? (
                        <>
                          Scroll down and select <strong>Add to Home Screen</strong>.
                        </>
                      ) : (
                        <>
                          Faites défiler et appuyez sur <strong>Sur l’écran d’accueil</strong>.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn ? (
                        <>
                          Tap <strong>Add</strong> in the top right corner to launch in full screen.
                        </>
                      ) : (
                        <>
                          Validez avec <strong>Ajouter</strong> en haut à droite pour l’ouvrir comme une vraie application.
                        </>
                      )}
                    </li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <PlusSquare className="w-4 h-4 text-emerald-700" />
                      <span>
                        {isEn
                          ? 'On Android, Chrome, Edge or Brave:'
                          : 'Sur Téléphone Android, Chrome, Edge ou Brave :'}
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                      <li>
                        {isEn ? (
                          <>
                            Tap the browser menu <strong>⋮</strong> (or the install icon in the address bar).
                          </>
                        ) : (
                          <>
                            Ouvrez le menu du navigateur <strong>⋮</strong> (ou l’icône d’installation dans la barre d’adresse).
                          </>
                        )}
                      </li>
                      <li>
                        {isEn ? (
                          <>
                            Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                          </>
                        ) : (
                          <>
                            Sélectionnez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.
                          </>
                        )}
                      </li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? 'Also on iPhone/iPad (Safari): tap Share → Add to Home Screen.'
                        : 'Sur iPhone / iPad (Safari) : appuyez sur Partager → Sur l’écran d’accueil.'}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              {isInstallable && (
                <button
                  type="button"
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {isEn ? 'Install Now' : 'Lancer l’installation'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                {isEn ? 'Got it' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC<{ lang?: 'fr' | 'en' }> = ({ lang = 'fr' }) => {
  const isOnline = useOnlineStatus();
  const isEn = lang === 'en';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>
        {isEn
          ? 'Offline Mode — Cached scientific data is active.'
          : 'Mode Hors-Ligne — Les données scientifiques en cache sont utilisées.'}
      </span>
    </div>
  );
};
