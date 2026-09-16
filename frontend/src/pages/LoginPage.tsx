import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'client' | 'pos'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Usamos el servicio de auth
      const response = await authService.login(email, password);
      // Simular comportamiento: Si no hay backend, usaremos valores por defecto
      if (response && response.role === 'cajero') {
        navigate('/pos/devoluciones-omnicanal');
      } else {
        navigate('/cliente/pedidos');
      }
    } catch (err: any) {
      // Como fallback para desarrollo sin backend, vamos a redirigir según el tab
      // Esto es solo para que el flujo UI funcione mientras no hay API real.
      console.warn("Fallo el login por API, simulando redirect local:", err);
      if (activeTab === 'pos') {
        navigate('/pos/devoluciones-omnicanal');
      } else {
        navigate('/cliente/pedidos');
      }
    } finally {
      setLoading(false);
    }
  };

  const activeClasses = 'bg-surface-container-lowest text-[#059669] shadow-sm font-semibold border-b-2 border-[#059669]';
  const inactiveClasses = 'text-on-surface-variant border-b-2 border-transparent font-medium hover:text-on-surface';

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-container selection:text-on-secondary-container">
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-surface-container-high/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="h-16 w-full max-w-[80rem] mx-auto px-gutter-desktop flex items-center justify-between gap-space-4">
          <div className="flex items-center gap-space-5">
            <div className="flex items-center gap-space-3">
              <img alt="Mercado Viva" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WMJIou-xHVciQQAE3aGtb3KIsPIxSIV_J_I2z85th4BfBRvgZtwI-5kVVKsc1gNBt--rbKD4tkE-y8Ti_kMqiA0VF4qRpsGB906llTXnaTC3MBZcY0NWX1Ox8qD4O53Al-V2PEWHsZfevXvVTzuF_dl8N0MUCCSASjkb45SlQHuy-1q1RVsNVdxj4rMHRg0RvyjEQiebztxgY_PT6ekCnyg7yGW7rNDbPP5KzPKwMQ24WlK-iENLULqXvy" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none tracking-tight font-semibold">Mercado Viva</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5">Portal Corporativo</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-3">
            <button className="flex items-center gap-space-1 px-space-2 py-space-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button">
              <span className="material-symbols-outlined text-[18px]">translate</span>
              <span className="font-label-md text-label-md uppercase font-medium">ES</span>
            </button>
            <button className="flex items-center gap-space-1 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="Soporte corporativo" type="button">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 flex-1 bg-surface flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-space-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow p-space-6 md:p-space-8 border border-surface-container-high/80">
            <div className="text-center mb-space-6">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-1">Iniciar Sesión</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Accede a tus servicios o terminal de operaciones</p>
            </div>

            <div className="flex bg-surface-container-low p-1 rounded-xl mb-space-6 border border-surface-container-high/40" role="tablist">
              <button 
                onClick={() => setActiveTab('client')}
                className={`flex-1 py-2 px-3 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'client' ? activeClasses : inactiveClasses}`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Portal Cliente</span>
              </button>
              <button 
                onClick={() => setActiveTab('pos')}
                className={`flex-1 py-2 px-3 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'pos' ? activeClasses : inactiveClasses}`}
              >
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                <span>Cajero / POS</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-space-4">
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md font-medium text-on-surface">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent border border-surface-container-high transition-all duration-150" 
                  placeholder={activeTab === 'client' ? "nombre@correo.cl" : "cajero.sucursal@mercadoviva.cl"} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md font-medium text-on-surface">Contraseña</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3.5 pr-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent border border-surface-container-high transition-all duration-150" 
                    placeholder="••••••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-error text-sm mt-2">{error}</div>
              )}

              <button disabled={loading} type="submit" className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-label-lg text-label-lg font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-70">
                {activeTab === 'client' ? (
                  <>
                    <span>Continuar</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>Ingresar a Terminal POS</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-space-5 text-center">
              <a className="font-body-xs text-body-xs text-[#059669] hover:underline transition-colors block" href="#">¿Olvidaste tu contraseña o requieres autorización del supervisor?</a>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high/60 shadow-[0_-1px_6px_rgba(0,0,0,0.01)]">
        <div className="max-w-[80rem] mx-auto px-gutter-desktop py-space-6 flex flex-col md:flex-row items-center justify-between gap-space-4">
          <div className="flex items-center gap-space-4">
            <span className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Mercado Viva Retail S.A. Todos los derechos reservados.</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-surface-container-highest"></span>
          </div>
          <div className="flex items-center gap-space-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Políticas de Privacidad</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Términos de Acceso Omnicanal</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Línea Ética y Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
