import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface GithubTokenSetupProps {
  onSetupComplete?: () => void;
  onCancel?: () => void;
  allowCancel?: boolean;
}

const GithubTokenSetup: React.FC<GithubTokenSetupProps> = ({ onSetupComplete, onCancel, allowCancel = false }) => {
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    error?: string;
  } | null>(null);
  const [tokenStatus, setTokenStatus] = useState<{
    hasToken: boolean;
    isValidated: boolean;
    lastValidatedAt?: string;
  } | null>(null);

  useEffect(() => {
    loadTokenStatus();
  }, []);

  const loadTokenStatus = async () => {
    const status = await window.electronAPI.getGithubTokenStatus();
    setTokenStatus(status);
  };

  const handleSaveAndValidate = async () => {
    if (!token || token.length < 10) {
      setValidationResult({
        isValid: false,
        error: 'El token debe tener al menos 10 caracteres'
      });
      return;
    }

    setIsSaving(true);
    setValidationResult(null);

    try {
      // Guardar el token
      await window.electronAPI.saveGithubToken(token);
      
      // Validar inmediatamente
      setIsValidating(true);
      const result = await window.electronAPI.validateGithubToken();
      setValidationResult(result);

      if (result.isValid) {
        // Token válido, limpiar el input
        setToken('');
        // Recargar estado
        await loadTokenStatus();
        // Notificar completado
        if (onSetupComplete) {
          onSetupComplete();
        }
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'Error al guardar el token. Inténtalo de nuevo.'
      });
    } finally {
      setIsSaving(false);
      setIsValidating(false);
    }
  };

  const handleClearToken = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar el token configurado?')) {
      await window.electronAPI.clearGithubToken();
      setValidationResult(null);
      await loadTokenStatus();
    }
  };

  const formatLastValidatedAt = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Key className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Configuración de GitHub</h2>
            <p className="text-sm text-gray-500">Token de acceso personal para autenticación Git</p>
          </div>
        </div>

        {/* Estado actual del token */}
        {tokenStatus && tokenStatus.hasToken && (
          <div className={`mb-6 p-4 rounded-xl border ${
            tokenStatus.isValidated 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              {tokenStatus.isValidated ? (
                <CheckCircle className="text-emerald-600 mt-0.5" size={20} />
              ) : (
                <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  tokenStatus.isValidated 
                    ? 'text-emerald-800' 
                    : 'text-amber-800'
                }`}>
                  {tokenStatus.isValidated 
                    ? 'Token configurado y validado' 
                    : 'Token configurado pero no validado'}
                </p>
                <p className={`text-sm mt-1 ${
                  tokenStatus.isValidated 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
                }`}>
                  Última validación: {formatLastValidatedAt(tokenStatus.lastValidatedAt)}
                </p>
              </div>
              <button
                onClick={handleClearToken}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        {/* Formulario de ingreso del token */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
              disabled={isSaving || isValidating}
            />
            <p className="mt-2 text-xs text-gray-500">
              El token se guarda de forma segura en tu equipo y se usa para autenticar operaciones Git automáticamente.
            </p>
          </div>

          {/* Resultado de validación */}
          {validationResult && (
            <div className={`p-4 rounded-xl border ${
              validationResult.isValid 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {validationResult.isValid ? (
                  <CheckCircle className="text-emerald-600 mt-0.5" size={20} />
                ) : (
                  <XCircle className="text-red-600 mt-0.5" size={20} />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${
                    validationResult.isValid 
                      ? 'text-emerald-800' 
                      : 'text-red-800'
                  }`}>
                    {validationResult.isValid 
                      ? `¡Token válido! Bienvenido, ${validationResult.username}` 
                      : 'Token inválido'}
                  </p>
                  {validationResult.error && (
                    <p className="text-sm text-red-600 mt-1">
                      {validationResult.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            {allowCancel && (
              <button
                onClick={onCancel}
                type="button"
                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Atrás
              </button>
            )}
            <button
              onClick={handleSaveAndValidate}
              disabled={isSaving || isValidating || !token}
              className={`${allowCancel ? 'w-2/3' : 'w-full'} bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
            {isSaving || isValidating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {isValidating ? 'Validando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Guardar y Validar Token
              </>
            )}
          </button>
          </div>

          {/* Instrucciones */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">
              ¿Cómo obtener tu Personal Access Token?
            </h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">1.</span>
                Ve a <strong className="text-gray-800">GitHub Settings</strong> → <strong className="text-gray-800">Developer settings</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">2.</span>
                Selecciona <strong className="text-gray-800">Personal access tokens</strong> → <strong className="text-gray-800">Tokens (classic)</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">3.</span>
                Haz clic en <strong className="text-gray-800">Generate new token (classic)</strong>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">4.</span>
                Selecciona los scopes: <strong className="text-gray-800">repo</strong> (para acceso completo a repositorios)
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gray-800">5.</span>
                Genera el token y cópialo (solo se muestra una vez)
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubTokenSetup;
