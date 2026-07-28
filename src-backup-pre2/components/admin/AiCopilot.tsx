import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Loader2, ShieldCheck
} from 'lucide-react';
import { Tour } from './types';
import { useTranslation } from '../../i18n/LanguageContext';

interface AiCopilotProps {
  onAddGeneratedTour: (tour: Tour) => void;
}

export default function AiCopilot({ onAddGeneratedTour }: AiCopilotProps) {
  const { t } = useTranslation();
  const [draftText, setDraftText] = useState('');
  const [tone, setTone] = useState<'Aventurero' | 'Lujoso' | 'Familiar' | 'Eco-friendly'>('Aventurero');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    { label: t('ai.stepAnalyze', '🔍 Analizando ubicación...'), status: 'idle' },
    { label: t('ai.stepWriteSeo', '✍️ Redactando descripción SEO...'), status: 'idle' },
    { label: t('ai.stepTranslate', '🌎 Traduciendo EN/PT...'), status: 'idle' },
    { label: t('ai.stepPrice', '🎨 Precio inteligente...'), status: 'idle' }
  ]);

  const [generatedTour, setGeneratedTour] = useState<Tour | null>(null);

  const genIntervalRef = useRef<number | null>(null);
  const genTimeoutRef = useRef<number | null>(null);

  // Clean up any pending generation timers on unmount
  useEffect(() => {
    return () => {
      if (genIntervalRef.current) clearInterval(genIntervalRef.current);
      if (genTimeoutRef.current) clearTimeout(genTimeoutRef.current);
    };
  }, []);

  const startGeneration = () => {
    if (!draftText.trim()) return;

    if (genIntervalRef.current) clearInterval(genIntervalRef.current);
    if (genTimeoutRef.current) clearTimeout(genTimeoutRef.current);

    setIsGenerating(true);
    setGeneratedTour(null);
    setCurrentStep(0);
    
    // Reset steps state
    setSteps([
      { label: t('ai.stepAnalyze', '🔍 Analizando ubicación...'), status: 'loading' },
      { label: t('ai.stepWriteSeo', '✍️ Redactando descripción SEO...'), status: 'idle' },
      { label: t('ai.stepTranslate', '🌎 Traduciendo EN/PT...'), status: 'idle' },
      { label: t('ai.stepPrice', '🎨 Precio inteligente...'), status: 'idle' }
    ]);

    // Interval animation for 4 steps (700ms each)
    let stepCount = 0;
    genIntervalRef.current = setInterval(() => {
      stepCount++;
      setCurrentStep(stepCount);

      setSteps(prev => {
        const next = [...prev];
        // Mark previous as completed
        if (stepCount - 1 < next.length) {
          next[stepCount - 1].status = 'completed';
        }
        // Mark current as loading
        if (stepCount < next.length) {
          next[stepCount].status = 'loading';
        }
        return next;
      });

      if (stepCount >= 4) {
        clearInterval(genIntervalRef.current!);
        
        // Finalize generation with realistic custom data parser
        genTimeoutRef.current = setTimeout(() => {
          generateMockTour();
          setIsGenerating(false);
        }, 300);
      }
    }, 700);
  };

  const generateMockTour = () => {
    const textLower = draftText.toLowerCase();
    
    // Default Fallback values
    let title = 'Trek de Aventura Exclusivo LATAM';
    let location = 'Patagonia, Chile';
    let country: 'Chile' | 'Perú' | 'Colombia' | 'México' | 'Argentina' | 'Ecuador' | 'Bolivia' | 'Brasil' = 'Chile';
    let category: Tour['category'] = 'Aventura';
    let description = 'Un tour espectacular diseñado de forma personalizada con el Copiloto de Inteligencia Artificial para ofrecer un itinerario de alto impacto visual y seguridad certificada.';
    let price = 350;
    let originalPrice = 450;
    let duration = '3 días / 2 noches';
    let durationHours = 72;
    let mainImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';
    let guideId = 'gd-1';
    let vehicleId = 'vh-1';
    let lat = -51.2500;
    let lng = -73.1500;
    
    let vibeScores = {
      adrenalina: 70,
      relax: 40,
      cultura: 50,
      familia: 30
    };

    // Keyword checking
    if (textLower.includes('glaciar') || textLower.includes('hielo') || textLower.includes('patagonia') || textLower.includes('grey')) {
      title = 'Aventura Glaciar Glacial & Trek sobre Hielo';
      location = 'Torres del Paine, Chile';
      country = 'Chile';
      category = 'Glaciar';
      price = 590;
      originalPrice = 690;
      duration = '2 días / 1 noche';
      durationHours = 36;
      mainImage = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800';
      guideId = 'gd-2';
      vehicleId = 'vh-2';
      lat = -51.2530;
      lng = -73.1210;
      vibeScores = { adrenalina: 95, relax: 20, cultura: 15, familia: 20 };
      description = `Travesía premium por hielos continentales patagónicos. Incluye el arriendo de crampones técnicos homologados por la UIAA, ración de marcha de alta montaña, guiado especializado y traslado privado de ida y regreso.`;
    } else if (textLower.includes('selva') || textLower.includes('amazonas') || textLower.includes('río') || textLower.includes('caimán')) {
      title = 'Safari Ecológico del Amazonas Profundo';
      location = 'Leticia, Colombia';
      country = 'Colombia';
      category = 'Selva';
      price = 280;
      originalPrice = 350;
      duration = '3 días / 2 noches';
      durationHours = 72;
      mainImage = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800';
      guideId = 'gd-3';
      vehicleId = 'vh-3';
      lat = -4.2120;
      lng = -69.9400;
      vibeScores = { adrenalina: 85, relax: 40, cultura: 60, familia: 50 };
      description = `Explora el corazón de la cuenca amazónica. Caminatas de avistamiento de primates y ranas dardo, observación de delfines rosados de río y pernoctación en cabañas construidas sobre pilotes a orillas del río Yarapa.`;
    } else if (textLower.includes('ruinas') || textLower.includes('machu') || textLower.includes('peru') || textLower.includes('inca') || textLower.includes('cusco')) {
      title = 'Inca Sacred Pass & Machu Picchu Premium Explorer';
      location = 'Valle Sagrado, Perú';
      country = 'Perú';
      category = 'Cultural';
      price = 420;
      originalPrice = 520;
      duration = '4 días / 3 noches';
      durationHours = 96;
      mainImage = 'https://images.unsplash.com/photo-1587595431973-160d0d94adb1?w=800';
      guideId = 'gd-1';
      vehicleId = 'vh-1';
      lat = -13.1630;
      lng = -72.5450;
      vibeScores = { adrenalina: 40, relax: 50, cultura: 100, familia: 65 };
      description = `Itinerario de inmersión cultural andina. Visita Ollantaytambo, Pisaq y pernocta en el pueblo de Aguas Calientes para ascender de madrugada en buses ecológicos a la legendaria ciudadela sagrada de Machu Picchu.`;
    }

    // Apply tone styling to description
    if (tone === 'Lujoso') {
      title = `VIP Exclusive: ${title}`;
      price = Math.round(price * 1.5);
      originalPrice = Math.round(originalPrice * 1.5);
      description = `[Tono Lujoso Premium] Una experiencia exclusiva de altísima fidelidad. ${description} Incluye champagne de bienvenida en el lodge, traslados en helicóptero u helicópteros de apoyo privado y acomodación en resorts de 5 estrellas.`;
      vibeScores.relax += 20;
    } else if (tone === 'Familiar') {
      title = `${title} (Familiar & Confort)`;
      description = `[Tono Familiar] Diversión y confort garantizado para todas las edades. Itinerarios adaptados de baja exigencia física, snacks infantiles y paradas programadas de descanso. ${description}`;
      vibeScores.familia = 95;
      vibeScores.adrenalina -= 20;
    } else if (tone === 'Eco-friendly') {
      title = `${title} (100% Ecológico & Carbono Neutro)`;
      description = `[Tono Sostenible] Experiencia con impacto ambiental compensado y reforestación comunitaria. ${description} Apoyamos de forma directa a 4 comunidades originarias de la zona y evitamos el uso de plásticos descartables.`;
      vibeScores.relax += 10;
    }

    const newTour: Tour = {
      id: `tr-gen-${Date.now()}`,
      title,
      location,
      price,
      originalPrice,
      discount: originalPrice - price,
      duration,
      durationHours,
      category,
      description,
      image: mainImage,
      oneDay: durationHours <= 24,
      popular: true,
      guideId,
      vehicleId,
      operator: 'Andes Expeditions',
      vibeScores,
      destinationCountry: country,
      lat,
      lng,
      heroImages: [mainImage],
      bgPosition: 'center',
      status: 'DRAFT'
    };

    setGeneratedTour(newTour);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="bt-ai-copilot">
      
      <div className="glass-card p-6 relative overflow-hidden">
        {/* Glowing background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-white tracking-tight">
              {t('ai.title', 'Copiloto de IA BuscaTours')}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {t('ai.subtitle', 'Crea itinerarios, tarifas dinámicas, y configuraciones completas de tours ingresando un borrador informal en lenguaje natural.')}
            </p>
          </div>
        </div>

        {/* Form elements for draft input */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono">
              {t('ai.draftLabel', 'BORRADOR O IDEA DEL TOUR')}
            </label>
            <textarea
              id="ai-draft-input"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={t('ai.draftPlaceholder', "Ejemplo: 'Quiero un trekking de 2 días por Torres del Paine sobre el glaciar Grey para caminantes aventureros con pernocte en un campamento de montaña'")}
              rows={4}
              className="w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-amber-500/60 focus:outline-none transition-all placeholder:text-slate-600 font-sans leading-relaxed"
            />
            <div className="flex gap-2 pt-1 flex-wrap">
               <button 
                 type="button"
                 onClick={() => setDraftText('Quiero un tour al amanecer en las ruinas de Machu Picchu con inmersión histórica inca y pernoctación en Aguas Calientes.')}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded border border-white/5 transition-all font-mono"
                >
                 {t('ai.exampleMachu', '💡 Ejemplo: Machu Picchu')}
               </button>
               <button 
                 type="button"
                 onClick={() => setDraftText('Expedición de 3 días por el río Amazonas saliendo en lancha tracker desde Leticia, buscando delfines rosados y caimanes de noche.')}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded border border-white/5 transition-all font-mono"
                >
                 {t('ai.exampleAmazon', '💡 Ejemplo: Amazonas')}
               </button>
               <button 
                 type="button"
                 onClick={() => setDraftText('Trek de 2 días sobre crampones por el Glaciar Grey en Patagonia con guías técnicos certificados Torres del Paine.')}
                  className="bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded border border-white/5 transition-all font-mono"
                >
                 {t('ai.exampleGlacier', '💡 Ejemplo: Glaciar Grey')}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tone selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono block">
                {t('ai.toneLabel', 'TONO DE CONTENIDO Y REDACCIÓN')}
              </label>
               <select
                  id="ai-tone-select"
                  value={tone}
                   onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/5 rounded px-4 py-3 text-slate-200 text-xs focus:border-amber-500/60 focus:outline-none transition-all font-semibold"
                >
                 <option value="Aventurero">{t('ai.toneAventurero', '⚔ Aventurero / Desafiante')}</option>
                 <option value="Lujoso">{t('ai.toneLujoso', '💎 Lujoso / VIP Confort')}</option>
                 <option value="Familiar">{t('ai.toneFamiliar', '👨‍👩‍👦 Familiar / Confortable')}</option>
                 <option value="Eco-friendly">{t('ai.toneEco', '🌿 Eco-friendly / Sostenible')}</option>
               </select>
            </div>

            {/* Language Selection (Disabled default Spanish auto-translate) */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-bold text-slate-300 font-mono block">
                {t('ai.langLabel', 'IDIOMA DE TRADUCCIÓN SIMULTÁNEA')}
              </label>
               <select
                  disabled
                  className="w-full bg-slate-950/80 border border-white/5 rounded px-4 py-3 text-slate-400 text-xs focus:outline-none font-semibold cursor-not-allowed"
                >
                 <option>{t('ai.langOption', 'Español (Auto-traducir a EN/PT activo)')}</option>
               </select>
            </div>
          </div>

          {/* Generate button */}
          <div className="pt-2">
             <button
               id="btn-generate-ai"
               type="button"
               disabled={isGenerating || !draftText.trim()}
               onClick={startGeneration}
               className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded transition-all duration-300 shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 text-sm"
             >
               {isGenerating ? (
                 <>
                   <Loader2 size={16} className="animate-spin" />
                   <span>{t('ai.processing', 'Procesando con Gemini AI...')}</span>
                 </>
               ) : (
                 <>
                   <Sparkles size={16} />
                   <span>{t('ai.generateBtn', 'Generar Estructura Completa de Tour')}</span>
                 </>
               )}
            </button>
          </div>
        </div>

      </div>

      {/* Steps indicators overlay / generated result */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Steps display (4 cols) */}
        <div className="md:col-span-4 glass-card p-5 space-y-4">
           <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            {t('ai.orchestrationSeq', 'Secuencia de Orquestación')}
          </h4>

          <div className="space-y-3.5">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold ${
                  step.status === 'completed' 
                    ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400' 
                    : step.status === 'loading'
                      ? 'bg-amber-500/5 border-amber-500/15 text-amber-400 animate-pulse'
                      : 'bg-slate-950/20 border-white/5 text-slate-500'
                }`}
              >
                {step.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-400" />}
                {step.status === 'loading' && <Loader2 size={14} className="animate-spin text-amber-400" />}
                {step.status === 'idle' && <div className="w-3.5 h-3.5 rounded-full bg-slate-800" />}
                
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl text-[10px] text-slate-500 leading-relaxed font-mono">
            <strong>{t('ai.callingTo', 'Llamando a:')}</strong> Cloud Function <code>generateTourWithAI</code> {t('ai.withModel', 'con modelo')} <code>gemini-3.5-flash</code>.
          </div>
        </div>

        {/* Result Preview (8 cols) */}
        <div className="md:col-span-8">
          {isGenerating ? (
            <div 
              key="generating"
              className="w-full h-full min-h-[300px] glass-card flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3"
            >
                <Loader2 size={40} className="animate-spin text-amber-500" />
                 <div className="space-y-1">
                  <span className="font-semibold block text-sm text-white">{t('ai.structuring', 'Estructurando borrador...')}</span>
                  <span className="text-xs font-mono block">{t('ai.processingDesc', 'Procesando traducción, puntuaciones de vibe y asignación de vehículos')}</span>
                </div>
              </div>
            ) : generatedTour ? (
              <div
                key="result"
                className="glass-card overflow-hidden flex flex-col justify-between h-full border-2 border-amber-500/20 shadow-2xl shadow-amber-500/5"
              >
                {/* Header Image banner */}
                <div className="relative h-44 bg-slate-950">
                  <img 
                    src={generatedTour.image} 
                    alt={generatedTour.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  
                   <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-full font-mono">
                    {t('ai.generationSuccess', 'GENERACIÓN EXITOSA')}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest">{generatedTour.category} | {generatedTour.location}</span>
                    <h4 className="font-display font-black text-lg text-white mt-0.5 leading-tight">{generatedTour.title}</h4>
                  </div>
                </div>

                {/* Form Specs review */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Prices & Duration Row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-950/40 p-2.5 border border-white/5 rounded-xl">
                       <span className="text-[9px] text-slate-500 font-mono block">{t('ai.priceIa', 'Precio IA')}</span>
                      <strong className="text-xs text-white">${generatedTour.price} USD</strong>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 border border-white/5 rounded-xl">
                       <span className="text-[9px] text-slate-500 font-mono block">{t('ai.priceOriginal', 'Precio Original')}</span>
                      <strong className="text-xs text-slate-400 line-through">${generatedTour.originalPrice} USD</strong>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 border border-white/5 rounded-xl">
                       <span className="text-[9px] text-slate-500 font-mono block">{t('ai.duration', 'Duración')}</span>
                      <strong className="text-xs text-amber-500 truncate block">{generatedTour.duration}</strong>
                    </div>
                  </div>

                  {/* Vibe scores review */}
                  <div className="space-y-2">
                     <span className="text-[10px] text-slate-400 font-bold font-mono uppercase block">{t('ai.vibeScores', 'Puntajes de Vibe Scores Calculados:')}</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-300">
                      <div className="bg-slate-950/60 p-1.5 border border-white/5 rounded-lg">
                         <span className="block text-slate-500">{t('toursVibeAdrenalina')}</span>
                        <strong className="text-rose-400">{generatedTour.vibeScores.adrenalina}/100</strong>
                      </div>
                      <div className="bg-slate-950/60 p-1.5 border border-white/5 rounded-lg">
                         <span className="block text-slate-500">{t('toursVibeRelax')}</span>
                        <strong className="text-sky-400">{generatedTour.vibeScores.relax}/100</strong>
                      </div>
                      <div className="bg-slate-950/60 p-1.5 border border-white/5 rounded-lg">
                         <span className="block text-slate-500">{t('toursVibeCultura')}</span>
                        <strong className="text-amber-400">{generatedTour.vibeScores.cultura}/100</strong>
                      </div>
                      <div className="bg-slate-950/60 p-1.5 border border-white/5 rounded-lg">
                         <span className="block text-slate-500">{t('toursVibeFamilia')}</span>
                        <strong className="text-emerald-400">{generatedTour.vibeScores.familia}/100</strong>
                      </div>
                    </div>
                  </div>

                  {/* Description SEO */}
                  <div className="space-y-1">
                     <span className="text-[10px] text-slate-500 font-bold font-mono uppercase block">{t('ai.generatedDesc', 'Descripción Generada:')}</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-white/5 max-h-[88px] overflow-y-auto">
                      {generatedTour.description}
                    </p>
                  </div>

                </div>

                {/* Footer Save Action */}
                <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <ShieldCheck size={14} />
                    <span>{t('ai.readyCatalog', 'Listo para el Catálogo')}</span>
                  </div>

                  <button
                    id="btn-save-generated-tour"
                    onClick={() => {
                      onAddGeneratedTour(generatedTour);
                      setGeneratedTour(null);
                      setDraftText('');
                    }}
                     className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded transition-all duration-300 shadow-md text-xs flex items-center gap-1.5"
                  >
                     <span>{t('ai.insertTour', 'Insertar Tour en Formulario')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div key="empty" className="w-full h-full min-h-[300px] glass-card flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <Sparkles size={28} className="text-slate-700" />
                <div className="space-y-1">
                   <span className="font-semibold block text-sm text-slate-400">{t('ai.noPreview', 'Sin vista previa disponible')}</span>
                   <span className="text-xs block">{t('ai.noPreviewHint', 'Escribe tu idea arriba y haz clic en "Generar Estructura Completa"')}</span>
                </div>
              </div>
            )}
        </div>

      </div>

    </div>
  );
}
