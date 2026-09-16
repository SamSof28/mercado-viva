import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { ClientOrder, ClientOrderItem } from '../types';

export const ClientOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<ClientOrder | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Views: 'action' (initial), 'form' (select reason/method), 'ticket' (success)
  const [view, setView] = useState<'action' | 'form' | 'ticket'>('action');
  
  // Form state
  const [selectedReason, setSelectedReason] = useState('Producto defectuoso');
  const [selectedMethod, setSelectedMethod] = useState<'original_card' | 'store_credit' | 'cash'>('original_card');
  const [returnCode, setReturnCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // En un entorno real, clientId vendría de la sesión o token
        const data = await clientService.getClientOrder('current-user');
        setOrder(data);
      } catch (error) {
        console.warn("API falló, usando datos de fallback para desarrollo:", error);
        // Fallback data matching HTML
        setOrder({
          id: 'MV-8492',
          date: '14 de Octubre, 2024',
          total: 34850,
          status: 'entregado',
          paymentMethod: { type: 'Tarjeta Débito', last4: '4921' },
          items: [
            {
              id: 'ITEM-1',
              sku: 'SKU-1',
              name: 'Aceite de Oliva Extra Virgen 500ml',
              brand: 'De Cecco',
              quantity: 1,
              unitPrice: 9890,
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFS5AU6lVIe3HXPt62yHEbBwKK24Y7VoSW1VXpomxpHqi6mvvglj2-IEzuQJVw-y0dSrhxTwiAk9sc45AejtkYUON87bi6C10QlA3o48ln26UTjRrthaI-VAtv_a-kXI29JkVd2h32y8ZmKb_P1RkwxnK79gKn8_YHXS2qAyy5e353Gg_1oEI4Iy00LUCQLGvfeSkS2zbRc1Rfxq-rjEnt7xdf0o77JElnd4M3IQHzTg25REW7cxpvhw'
            },
            {
              id: 'ITEM-2',
              sku: 'SKU-2',
              name: 'Café Molido Premium Tueste Intenso 250g',
              brand: 'Juan Valdez',
              quantity: 2,
              unitPrice: 12580,
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGemjt653p6P3mQwNGM-QAqbEWxElIlumXkv73kXvvAHdrNfNqCexQkaWU846-O788aJqQpHI6WaJAm-ozwy0bLisZLxMrXAIvH4MdHKkRk9fHL5DEGJCVugX4g97SHTacx8o2NbgJgiiaaeK5NwrZ8r9P42MWXSnDycTSWcvyQKwI2WVLhVFw8kqB4gVuKsI05rHe8NLAzvxJeucGQma3mOBy22o_yfZaFLJaSZxlydY8cF9tm_NM7A'
            },
            {
              id: 'ITEM-3',
              sku: 'SKU-3',
              name: 'Detergente Líquido Hipoalergénico 3L',
              brand: 'BioFrescura',
              quantity: 1,
              unitPrice: 12380,
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABkhNe75BlbeJoXuIsCxx0i0oKqbEiKSOeHARL5Rz0dzHE1trYHfT7YI-GW0q804JKXCWJkFQphIBdD1SZTutUwKYCBwzpz2QL7H1TFZgjiWj8rZ1e9fKY-QTcrC9vU_L3uEiUEIYRzefDVH7YxvsWhJcdpuWFNz-GQ8lLe8yXGBXs_NzlXi5Z8Rc5jBaLZv9guwHRLQv7zDISf2C-gKXn-P2W9Rx1TLb97GBzZx_yz3t-ruuPlwPxNQ'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmitting(true);
    try {
      const response = await clientService.createReturn({
        orderId: order.id,
        items: order.items.map(i => ({ id: i.id, quantity: i.quantity })),
        reason: selectedReason,
        method: selectedMethod
      });
      setReturnCode(response.returnCode);
      setView('ticket');
    } catch (error) {
      console.warn("API falló, simulando creación de ticket:", error);
      setReturnCode("DEV-8492");
      setView('ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (returnCode) {
      navigator.clipboard.writeText(returnCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface">Cargando...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-error">No se encontró el pedido</div>;
  }

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex flex-col min-h-screen pb-[env(safe-area-inset-bottom,0px)]">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-[env(safe-area-inset-top,0px)]">
        <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-2">
          <div className="flex items-center gap-space-2 min-w-0">
            <button 
              onClick={() => navigate('/')} 
              aria-label="Cerrar sesión / Volver" 
              className="w-11 h-11 -ml-space-2 flex items-center justify-center rounded-full text-on-surface hover:text-primary transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img alt="Mercado Viva Logo" className="h-7 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1Vonrg-j7voXFqk9a-nu6b9NvL73bqxr43I95UrQ17DcDaaUrU4gQe4HqZEZ65cXDhEVtm6Yn7TAy6-07xa68w7pNY3OiNcCN9cHU9L3mbMEr4t2dV_B35HssxLKDYsBoOB1GcKWcxC-4MXWcAx8iM0gkvspLjTJsrC3p3JsQA-NUydwApgd2dnNZwkl6IeroqSkKZ7rZHUqkm_BxFJqjYDREBlcQOB9_Kn1OqsCxLmsyJETtUCgHbXqA0q" />
            <h1 className="font-headline-sm text-headline-sm text-on-surface truncate leading-tight min-w-0">Detalle De Pedido</h1>
          </div>
          <div className="flex items-center gap-space-1 flex-shrink-0">
            <button aria-label="Notificaciones" className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-1">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        <div className="flex flex-col w-full pb-space-12 space-y-space-4">
          
          <div className="px-gutter-mobile pt-space-3 flex items-center justify-between gap-space-2">
            <div className="flex items-center gap-space-1 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant flex-shrink-0">arrow_back_ios</span>
              <span className="font-label-md text-label-md text-on-surface-variant truncate">Mis Pedidos</span>
              <span className="text-outline-variant text-[12px]">/</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">#{order.id}</span>
            </div>
            <div className="bg-secondary-container text-on-secondary-fixed flex-shrink-0 px-space-2 py-space-1 rounded-full flex items-center gap-space-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="font-label-sm text-label-sm">Entregado ayer, 16:45</span>
            </div>
          </div>

          <div className="px-gutter-mobile">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="p-space-4 bg-surface-container-low flex flex-col gap-space-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Fecha de Entrega</p>
                    <p className="font-headline-sm text-headline-sm text-on-surface">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Total Pagado</p>
                    <p className="font-headline-sm text-headline-sm text-primary font-bold">${order.total.toLocaleString('es-CL')} CLP</p>
                  </div>
                </div>
                <div className="flex items-center gap-space-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span className="font-body-xs text-body-xs">{order.paymentMethod.type} terminada en •••• {order.paymentMethod.last4}</span>
                </div>
              </div>

              <div className="p-space-4 space-y-space-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Productos Incluidos ({order.items.length})</p>
                {order.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex items-center gap-space-3 py-space-1">
                      <div className="w-14 h-14 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-label-lg text-label-lg text-on-surface font-semibold truncate">{item.name}</h2>
                        <p className="font-body-xs text-body-xs text-on-surface-variant truncate">{item.brand} • {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}</p>
                        <p className="font-data-mono text-data-mono text-on-surface font-medium mt-space-1">${item.unitPrice.toLocaleString('es-CL')}</p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <div className="h-[1px] bg-surface-container"></div>}
                  </React.Fragment>
                ))}
              </div>

              <div className="mx-space-4 mb-space-4 p-space-3 bg-secondary-container/40 rounded-lg flex items-start gap-space-2">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
                <p className="font-body-xs text-body-xs text-on-secondary-fixed-variant leading-relaxed">
                  Tienes <span className="font-semibold text-on-secondary-fixed">10 días</span> para solicitar cambio o devolución sin costo en cualquiera de nuestras <span className="font-semibold text-on-secondary-fixed">48 tiendas físicas</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="px-gutter-mobile">
            <div className="bg-surface-container p-space-1 rounded-xl flex">
              <button 
                className={`flex-1 py-space-2 px-space-3 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-space-1 ${view !== 'ticket' ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setView('action')}
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Iniciar Devolución
              </button>
              <button 
                className={`flex-1 py-space-2 px-space-3 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-space-1 ${view === 'ticket' ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setView('ticket')}
                disabled={!returnCode} // Disable if no ticket exists
              >
                <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                Ticket Generado
              </button>
            </div>
          </div>

          {view === 'action' && (
            <div className="px-gutter-mobile space-y-space-3">
              <div className="bg-surface-container-lowest p-space-5 rounded-xl shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-space-3">
                  <span className="material-symbols-outlined text-[28px]">cached</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-1">Devolución Rápida Omnicanal</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-5 max-w-xs">
                  Evita esperas de paquetería o costos adicionales. Lleva tus artículos directamente a caja en tu sucursal más cercana.
                </p>
                <button 
                  className="w-full bg-primary active:bg-primary-container text-on-primary py-space-3 px-space-4 rounded-xl shadow-sm flex items-center justify-center gap-space-3 transition-transform active:scale-[0.99]"
                  onClick={() => setView('form')}
                >
                  <div className="w-9 h-9 rounded-full bg-surface-container-lowest/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-on-primary">storefront</span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg font-semibold leading-snug">Devolver en Tienda Física</p>
                    <p className="font-body-xs text-body-xs text-on-primary-container opacity-90 truncate">Reembolso inmediato en caja sin costo de envío</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-on-primary">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-space-2">
                <div className="bg-surface-container-low p-space-3 rounded-lg flex items-center gap-space-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">Reintegro Inmediato</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant truncate">En tu tarjeta original</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-space-3 rounded-lg flex items-center gap-space-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">48 Sucursales</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant truncate">Red nacional Viva</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'form' && (
            <div className="px-gutter-mobile space-y-space-3">
              <form onSubmit={handleSubmitReturn} className="bg-surface-container-lowest p-space-5 rounded-xl shadow-sm flex flex-col gap-space-4">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Motivo de devolución</label>
                  <select 
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface font-body-md border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Producto defectuoso">Producto defectuoso</option>
                    <option value="No es lo que esperaba">No es lo que esperaba</option>
                    <option value="Error en el pedido">Error en el pedido</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Método de reembolso preferido</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-container-high bg-surface-container-low cursor-pointer">
                      <input 
                        type="radio" 
                        name="method" 
                        value="original_card"
                        checked={selectedMethod === 'original_card'}
                        onChange={() => setSelectedMethod('original_card')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="font-body-md text-on-surface">Reverso a tarjeta original</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-container-high bg-surface-container-low cursor-pointer">
                      <input 
                        type="radio" 
                        name="method" 
                        value="store_credit"
                        checked={selectedMethod === 'store_credit'}
                        onChange={() => setSelectedMethod('store_credit')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="font-body-md text-on-surface">Crédito en tienda (Gift Card)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setView('action')}
                    className="flex-1 py-3 px-4 rounded-xl font-label-md text-primary bg-surface-container hover:bg-surface-container-high transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl font-label-md text-on-primary bg-primary hover:bg-[#047857] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === 'ticket' && (
            <div className="px-gutter-mobile space-y-space-3">
              <div className="bg-secondary-container/50 rounded-xl p-space-4 flex items-center gap-space-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg font-bold text-on-secondary-fixed leading-tight">¡Solicitud Generada con Éxito!</p>
                  <p className="font-body-xs text-body-xs text-on-secondary-fixed-variant mt-0.5">Válido hasta el 24 de Octubre de 2024</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden relative">
                <div className="p-space-4 bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-space-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">qr_code_scanner</span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface tracking-tight">Comprobante de Caja</span>
                  </div>
                  <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed font-semibold px-space-2 py-0.5 rounded">Activo</span>
                </div>
                <div className="p-space-5 flex flex-col items-center">
                  <p className="font-body-xs text-body-xs text-on-surface-variant uppercase font-semibold tracking-wider mb-space-1">Código de Devolución</p>
                  <div className="w-full bg-surface-container flex items-center justify-between px-space-4 py-space-3 rounded-xl mb-space-5">
                    <span className="font-data-mono text-[22px] font-bold tracking-widest text-primary">{returnCode}</span>
                    <button 
                      className="flex items-center gap-space-1 bg-surface-container-lowest text-primary px-space-3 py-space-1 rounded-lg font-label-sm text-label-sm shadow-sm active:scale-95 transition-transform" 
                      onClick={handleCopy}
                    >
                      <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-space-3 rounded-xl shadow-sm mb-space-4 flex flex-col items-center">
                    <svg className="w-44 h-44 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
                      <rect height="40" rx="4" width="40" x="10" y="10"></rect>
                      <rect fill="#ffffff" height="24" width="24" x="18" y="18"></rect>
                      <rect height="12" width="12" x="24" y="24"></rect>
                      <rect height="40" rx="4" width="40" x="110" y="10"></rect>
                      <rect fill="#ffffff" height="24" width="24" x="118" y="18"></rect>
                      <rect height="12" width="12" x="124" y="24"></rect>
                      <rect height="40" rx="4" width="40" x="10" y="110"></rect>
                      <rect fill="#ffffff" height="24" width="24" x="18" y="118"></rect>
                      <rect height="12" width="12" x="24" y="124"></rect>
                      <rect height="8" width="8" x="58" y="20"></rect>
                      <rect height="8" width="8" x="74" y="20"></rect>
                      <rect height="8" width="8" x="90" y="20"></rect>
                      <rect height="8" width="8" x="20" y="58"></rect>
                      <rect height="8" width="8" x="20" y="74"></rect>
                      <rect height="8" width="8" x="20" y="90"></rect>
                      <rect height="16" width="16" x="58" y="58"></rect>
                      <rect height="8" width="8" x="82" y="58"></rect>
                      <rect height="8" width="16" x="98" y="58"></rect>
                      <rect height="16" width="8" x="122" y="58"></rect>
                      <rect height="16" width="8" x="58" y="82"></rect>
                      <rect height="8" width="16" x="74" y="74"></rect>
                      <rect height="8" width="8" x="74" y="90"></rect>
                      <rect height="16" width="16" x="90" y="82"></rect>
                      <rect height="8" width="16" x="114" y="82"></rect>
                      <rect height="16" width="8" x="138" y="74"></rect>
                      <rect height="8" width="16" x="58" y="106"></rect>
                      <rect height="8" width="8" x="82" y="114"></rect>
                      <rect height="16" width="8" x="98" y="106"></rect>
                      <rect height="8" width="16" x="114" y="114"></rect>
                      <rect height="16" width="8" x="138" y="106"></rect>
                      <rect height="16" width="8" x="58" y="122"></rect>
                      <rect height="8" width="16" x="74" y="130"></rect>
                      <rect height="8" width="8" x="98" y="130"></rect>
                      <rect height="16" width="8" x="114" y="130"></rect>
                      <rect height="8" width="16" x="130" y="130"></rect>
                    </svg>
                    <span className="font-body-xs text-body-xs text-on-surface-variant mt-space-1">Escanear para autenticar devolución</span>
                  </div>

                  <div className="w-full flex flex-col items-center bg-surface-container-low py-space-3 px-space-4 rounded-lg">
                    <svg className="w-full h-12" fill="currentColor" viewBox="0 0 240 48">
                      <rect height="40" width="3" x="8" y="4"></rect>
                      <rect height="40" width="2" x="14" y="4"></rect>
                      <rect height="40" width="4" x="20" y="4"></rect>
                      <rect height="40" width="1" x="27" y="4"></rect>
                      <rect height="40" width="5" x="31" y="4"></rect>
                      <rect height="40" width="2" x="39" y="4"></rect>
                      <rect height="40" width="3" x="44" y="4"></rect>
                      <rect height="40" width="1" x="51" y="4"></rect>
                      <rect height="40" width="4" x="55" y="4"></rect>
                      <rect height="40" width="2" x="62" y="4"></rect>
                      <rect height="40" width="5" x="67" y="4"></rect>
                      <rect height="40" width="2" x="76" y="4"></rect>
                      <rect height="40" width="1" x="81" y="4"></rect>
                      <rect height="40" width="4" x="85" y="4"></rect>
                      <rect height="40" width="3" x="92" y="4"></rect>
                      <rect height="40" width="2" x="98" y="4"></rect>
                      <rect height="40" width="5" x="103" y="4"></rect>
                      <rect height="40" width="1" x="111" y="4"></rect>
                      <rect height="40" width="4" x="115" y="4"></rect>
                      <rect height="40" width="2" x="122" y="4"></rect>
                      <rect height="40" width="4" x="127" y="4"></rect>
                      <rect height="40" width="1" x="134" y="4"></rect>
                      <rect height="40" width="3" x="138" y="4"></rect>
                      <rect height="40" width="5" x="144" y="4"></rect>
                      <rect height="40" width="2" x="152" y="4"></rect>
                      <rect height="40" width="3" x="157" y="4"></rect>
                      <rect height="40" width="1" x="163" y="4"></rect>
                      <rect height="40" width="4" x="167" y="4"></rect>
                      <rect height="40" width="2" x="174" y="4"></rect>
                      <rect height="40" width="5" x="179" y="4"></rect>
                      <rect height="40" width="1" x="187" y="4"></rect>
                      <rect height="40" width="4" x="191" y="4"></rect>
                      <rect height="40" width="3" x="198" y="4"></rect>
                      <rect height="40" width="2" x="204" y="4"></rect>
                      <rect height="40" width="4" x="209" y="4"></rect>
                      <rect height="40" width="1" x="216" y="4"></rect>
                      <rect height="40" width="5" x="220" y="4"></rect>
                      <rect height="40" width="2" x="228" y="4"></rect>
                    </svg>
                    <span className="font-data-mono text-body-xs text-on-surface font-semibold tracking-widest mt-1">7809420084920</span>
                  </div>
                </div>

                <div className="p-space-4 bg-surface-container-low space-y-space-3">
                  <p className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-space-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                    Pasos a seguir en sucursal
                  </p>
                  <div className="flex items-start gap-space-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed">
                      Acércate a la <strong className="text-on-surface">Caja 03</strong> o al módulo de <strong className="text-on-surface">Servicio al Cliente</strong> en cualquier sucursal de Mercado Viva.
                    </p>
                  </div>
                  <div className="flex items-start gap-space-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed">
                      Presenta este código en pantalla junto a los productos en su empaque original y buen estado.
                    </p>
                  </div>
                  <div className="flex items-start gap-space-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed">
                      El cajero escaneará el ticket y validará tu reembolso en el acto a tu medio de pago original.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-space-2 pt-space-1">
                <button className="flex-1 bg-surface-container-lowest text-on-surface font-label-md text-label-md py-space-3 px-space-2 rounded-xl shadow-sm flex items-center justify-center gap-space-1 active:bg-surface-container">
                  <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                  Descargar PDF
                </button>
                <button className="flex-1 bg-surface-container-lowest text-on-surface font-label-md text-label-md py-space-3 px-space-2 rounded-xl shadow-sm flex items-center justify-center gap-space-1 active:bg-surface-container">
                  <span className="material-symbols-outlined text-[18px] text-primary">near_me</span>
                  Tiendas Cercanas
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
