import React, { useState, useEffect } from 'react';
import { 
  Sliders, Plus, Edit2, Trash2, 
  CheckCircle, X, Image as ImageIcon,
  ChevronLeft, ChevronRight, Eye, Languages, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Slide } from './types';
import { dataService, type SliderSlideInput } from '../../services/dataService';
import ImageUploader from './ImageUploader';
import LanguageTabs, { LANGS } from './LanguageTabs';
import { useTranslation } from '../../i18n/LanguageContext';

interface SliderManagementProps {
  slides: Slide[];
  onSaveSlide: (slide: Slide) => void;
  onDeleteSlide: (id: string) => void;
}

export default function SliderManagement({
  slides,
  onSaveSlide,
  onDeleteSlide
}: SliderManagementProps) {
  const { t } = useTranslation();
  
  // Tab type state
  const [sliderType, setSliderType] = useState<'hero' | 'footer'>('hero');
  const [bottomSlides, setBottomSlides] = useState<SliderSlideInput[]>(() => dataService.getBottomSliderSlides());

  // Interactive preview state
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SliderSlideInput | Slide | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Ver Destinos');
  const [link, setLink] = useState('#admin');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState('');

  // Multilingual state (ES source + EN/PT auto-translated)
  const [activeLang, setActiveLang] = useState<string>('es');
  const [translations, setTranslations] = useState<Record<string, { title: string; subtitle: string; description: string; ctaText: string }>>({
    es: { title: '', subtitle: '', description: '', ctaText: '' },
    en: { title: '', subtitle: '', description: '', ctaText: '' },
    pt: { title: '', subtitle: '', description: '', ctaText: '' },
  });

  const currentTrans = translations[activeLang] || { title: '', subtitle: '', description: '', ctaText: '' };

  const setTranslatedField = (field: 'title' | 'subtitle' | 'description' | 'ctaText', value: string) => {
    if (activeLang === 'es') {
      if (field === 'title') setTitle(value);
      if (field === 'subtitle') setSubtitle(value);
      if (field === 'description') setDescription(value);
      if (field === 'ctaText') setCtaText(value);
    }
    setTranslations((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));
  };

  const handleAutoTranslate = async () => {
    const sourceFields: Record<string, string> = {
      title: translations.es.title || title,
      subtitle: translations.es.subtitle || subtitle,
      description: translations.es.description || description,
      ctaText: translations.es.ctaText || ctaText,
    };
    if (!sourceFields.title && !sourceFields.subtitle && !sourceFields.description && !sourceFields.ctaText) return;
    const targets = LANGS.map((l) => l.code).filter((c) => c !== activeLang);
    const result = await dataService.translateContent(activeLang, targets, sourceFields);
    setTranslations((prev) => {
      const next = { ...prev };
      for (const lang of targets) {
        if (result[lang]) next[lang] = { ...next[lang], ...result[lang] };
      }
      return next;
    });
  };

  const handleOpenFormForCreate = () => {
    setEditingSlide(null);
    if (sliderType === 'footer') {
      setTitle('Slide de Fondo');
      setSubtitle('');
      setCtaText('');
      setLink('');
      setImage('https://images.unsplash.com/photo-1517086822157-2b0358e7684a?w=1200');
      setOrder(bottomSlides.length + 1);
      setActive(true);
    } else {
      setTitle('');
      setSubtitle('');
      setCtaText('Explorar Ruta');
      setLink('#admin');
      setImage('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200');
      setOrder(slides.length + 1);
      setActive(true);
    }

    setDescription('');
    setActiveLang('es');
    setTranslations({
      es: { title: sliderType === 'footer' ? 'Slide de Fondo' : '', subtitle: '', description: '', ctaText: sliderType === 'footer' ? '' : 'Explorar Ruta' },
      en: { title: '', subtitle: '', description: '', ctaText: '' },
      pt: { title: '', subtitle: '', description: '', ctaText: '' },
    });

    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (slide: SliderSlideInput | Slide) => {
    setEditingSlide(slide);
    setTitle(slide.title || 'Slide de Fondo');
    setSubtitle(slide.subtitle || '');
    setCtaText(slide.ctaText || '');
    setLink(slide.link || '');
    setImage(slide.image);
    setOrder(slide.order);
    setActive(slide.active);
    
    const desc = (slide as Record<string, unknown>).description as string || '';
    setDescription(desc);

    setActiveLang('es');
    
    // Parse slide translations
    const slideTrans = (slide.translations as Record<string, Record<string, string>>) || {};
    setTranslations({
      es: {
        title: slide.title || 'Slide de Fondo',
        subtitle: slide.subtitle || '',
        description: desc,
        ctaText: slide.ctaText || '',
      },
      en: (slideTrans.en as unknown as { title: string; subtitle: string; description: string; ctaText: string }) || { title: '', subtitle: '', description: '', ctaText: '' },
      pt: (slideTrans.pt as unknown as { title: string; subtitle: string; description: string; ctaText: string }) || { title: '', subtitle: '', description: '', ctaText: '' },
    });

    setIsFormOpen(true);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) {
      alert(t('slider.alertUrl', 'Por favor ingresa la URL de la imagen.'));
      return;
    }

    if (sliderType === 'footer') {
      const saved: SliderSlideInput = {
        id: editingSlide?.id || `bsl-${Date.now()}`,
        image,
        order,
        active,
        title: 'Slide de Fondo',
        subtitle: '',
        ctaText: '',
        link: '',
        translations: {
          es: { title: 'Slide de Fondo', subtitle: '', description: '', ctaText: '' },
          en: translations.en || {},
          pt: translations.pt || {},
        }
      };

      let updated: SliderSlideInput[];
      const exists = bottomSlides.some(s => s.id === saved.id);
      if (exists) {
        updated = bottomSlides.map(s => s.id === saved.id ? saved : s);
      } else {
        updated = [...bottomSlides, saved];
      }
      setBottomSlides(updated);
      dataService.saveBottomSliderSlides(updated);
      
      // Dispatch custom event to notify PreFooterSlider of changes instantly
      window.dispatchEvent(new Event('bottom-slider-updated'));
    } else {
      if (!title.trim()) {
        alert('Por favor completa el campo de título.');
        return;
      }
      const saved: Slide = {
        id: editingSlide?.id || `sl-${Date.now()}`,
        title,
        subtitle,
        ctaText,
        link,
        image,
        order,
        active,
        description,
        translations: {
          es: { title, subtitle, description, ctaText },
          en: translations.en || {},
          pt: translations.pt || {},
        }
      };
      onSaveSlide(saved);
    }
    setIsFormOpen(false);
  };

  const handleNextPreview = () => {
    const activeList = sliderType === 'hero' 
      ? slides.filter(s => s.active)
      : bottomSlides.filter(s => s.active);
    if (activeList.length === 0) return;
    setActivePreviewIdx((prev) => (prev + 1) % activeList.length);
  };

  const handlePrevPreview = () => {
    const activeList = sliderType === 'hero'
      ? slides.filter(s => s.active)
      : bottomSlides.filter(s => s.active);
    if (activeList.length === 0) return;
    setActivePreviewIdx((prev) => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleDeleteSlide = (id: string) => {
    if (sliderType === 'footer') {
      const updated = bottomSlides.filter((s) => s.id !== id);
      setBottomSlides(updated);
      dataService.saveBottomSliderSlides(updated);
      window.dispatchEvent(new Event('bottom-slider-updated'));
    } else {
      onDeleteSlide(id);
    }
  };

  const activeSlidesToShow = sliderType === 'hero'
    ? slides.filter(s => s.active).sort((a, b) => a.order - b.order)
    : bottomSlides.filter(s => s.active).sort((a, b) => a.order - b.order);

  const slidesListToRender = sliderType === 'hero'
    ? [...slides].sort((a, b) => a.order - b.order)
    : [...bottomSlides].sort((a, b) => a.order - b.order);

  // Reset activePreviewIdx when switching sliderType or activeList changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivePreviewIdx(0);
  }, [sliderType, activeSlidesToShow.length]);

  return (
    <div id="bt-slider-management">
      <div className="space-y-6 animate-fade-in">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <Sliders size={20} className="text-amber-500" />
               {t('slider.configTitle', 'Configurador de Contenido Dinámico / Sliders')}
            </h3>
            <p className="text-slate-400 text-xs">
               {t('slider.configSub', 'Administra las diapositivas de la portada superior o las imágenes del slider de fondo del pie de página.')}
            </p>
          </div>

          <button
            id="btn-create-slide"
            onClick={handleOpenFormForCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 self-start md:self-auto"
          >
            <Plus size={15} />
            <span>{t('sliderAddSlide', 'Agregar Diapositiva')}</span>
          </button>
        </div>

        {/* Tabs Selector */}
        <div className="flex gap-2 border-b border-white/5 pb-px">
          <button
            onClick={() => setSliderType('hero')}
            className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors ${
              sliderType === 'hero' ? 'border-amber-500 text-amber-500 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
             {t('slider.tabHero', 'Slider Principal (Hero)')}
           </button>
          <button
            onClick={() => setSliderType('footer')}
            className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors ${
              sliderType === 'footer' ? 'border-amber-500 text-amber-500 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
             {t('slider.tabFooter', 'Slider de Fondo (Footer)')}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left column: List of slides (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                 {t('slider.saved', 'Diapositivas Guardadas')}
               </h4>

              <div className="space-y-3">
                {slidesListToRender.length > 0 ? (
                  slidesListToRender.map((slide) => (
                    <div 
                      key={slide.id} 
                      id={`slide-row-${slide.id}`}
                      className="bg-slate-950/50 p-4 border border-white/5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        {/* Tiny thumbnail */}
                        <div className="w-16 h-12 rounded-[5px] overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                          <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-[10px] font-mono font-bold">
                              {slide.order}
                            </span>
                            <h5 className="font-display font-bold text-sm text-white truncate max-w-[200px]">
                               {slide.title || t('slider.bgFallback', 'Slide de Fondo')}
                            </h5>
                          </div>
                          <p className="text-slate-400 text-xs truncate max-w-[240px] mt-0.5">
                             {slide.subtitle || t('slider.carouselFallback', 'Carrusel de imágenes de pie de página')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {/* Active toggle indicator */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          slide.active 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-500/15 text-slate-400 border border-white/5'
                        }`}>
                          {slide.active ? t('slider.active', 'ACTIVO') : t('slider.paused', 'PAUSADO')}
                        </span>

                        <button
                          id={`btn-edit-slide-${slide.id}`}
                          onClick={() => handleOpenFormForEdit(slide)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded hover:text-white"
                          title={t('slider.edit', 'Editar Diapositiva')}
                        >
                          <Edit2 size={12} />
                        </button>

                        <button
                          id={`btn-delete-slide-${slide.id}`}
                          onClick={() => {
                            if (confirm(t('slider.confirmDelete', '¿Deseas eliminar este slide de la lista?'))) {
                              handleDeleteSlide(slide.id);
                            }
                          }}
                          className="p-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/10 text-rose-400 rounded hover:text-rose-300"
                          title={t('slider.delete', 'Eliminar Diapositiva')}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No hay diapositivas en este slider.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Interactive LIVE preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={14} className="text-amber-500" />
                   {t('slider.livePreview', 'Live Preview Simulador Web')}
                </h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">PUBLIC VIEW</span>
              </div>

              {/* Slider Widget Emulator */}
              <div className="slider-emulator-wrapper">
                {activeSlidesToShow.length > 0 ? (
                  <div className="relative aspect-[16/10] rounded-2xl bg-slate-950 overflow-hidden border border-white/10 group">
                    {/* Active Slide Image */}
                    <div className="absolute inset-0">
                      <img
                        key={activePreviewIdx}
                        src={activeSlidesToShow[activePreviewIdx]?.image}
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>

                    {/* Cover overlay */}
                    {sliderType === 'hero' ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    ) : (
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/60" />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                    )}

                    {/* Slider textual content overlays */}
                    {sliderType === 'hero' ? (
                      <div key="hero-preview-overlay" className="absolute bottom-5 left-5 right-5 space-y-2">
                        <div className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full font-mono">
                          <span>SLIDE {activeSlidesToShow[activePreviewIdx]?.order || 0} / {activeSlidesToShow.length}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-display font-black text-sm md:text-base text-white tracking-tight leading-tight">
                            {activeSlidesToShow[activePreviewIdx]?.title || ''}
                          </h5>
                          <p className="text-slate-300 text-[11px] leading-snug max-w-sm">
                            {activeSlidesToShow[activePreviewIdx]?.subtitle || ''}
                          </p>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <a
                            href={activeSlidesToShow[activePreviewIdx]?.link || '#'}
                            target={activeSlidesToShow[activePreviewIdx]?.link?.startsWith('http') ? '_blank' : undefined}
                            rel={activeSlidesToShow[activePreviewIdx]?.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            onClick={(e) => {
                              const slideLink = activeSlidesToShow[activePreviewIdx]?.link;
                              const hasLink = Boolean(slideLink) && slideLink !== '#admin';
                              if (!hasLink) e.preventDefault();
                            }}
                            className={`px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded text-[10px] shadow-lg flex items-center gap-1 ${
                              (Boolean(activeSlidesToShow[activePreviewIdx]?.link) && activeSlidesToShow[activePreviewIdx]?.link !== '#admin') ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'
                            }`}
                          >
                            <span>{activeSlidesToShow[activePreviewIdx]?.ctaText || t('verMas')}</span>
                            <ChevronRightIcon size={10} />
                          </a>

                          {/* Pagination indicators dots */}
                          <div className="flex gap-1.5">
                            {activeSlidesToShow.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActivePreviewIdx(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  idx === activePreviewIdx ? 'bg-amber-500 w-3' : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Bottom slider footer simulation */
                      <div key="footer-preview-overlay" className="absolute inset-0 flex flex-col justify-end p-4 space-y-2 z-10">
                        <div className="flex gap-2">
                          <div className="flex-1 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm text-[8px] space-y-1">
                            <span className="font-bold text-white block">{t('slider.questions', '¿Dudas?')}</span>
                            <span className="text-slate-300 block leading-tight">{t('slider.talkExperts', 'Habla con expertos locales.')}</span>
                          </div>
                          <div className="flex-1 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm text-[8px] space-y-1">
                            <span className="font-bold text-white block">{t('slider.newsletter', 'Boletín')}</span>
                            <span className="text-slate-300 block leading-tight">{t('slider.subscribeOffers', 'Inscríbete para ofertas.')}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-slate-400 border-t border-white/5 pt-1.5 font-mono">
                          <span>© BuscaTours 2026</span>
                          <span>{t('slider.fadeBg', 'Fondo Desvanecido')}</span>
                        </div>
                        
                        {/* Pagination indicators dots */}
                        <div className="absolute bottom-2 right-4 flex gap-1">
                          {activeSlidesToShow.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePreviewIdx(idx)}
                              className={`w-1 h-1 rounded-full transition-all ${
                                idx === activePreviewIdx ? 'bg-amber-500 w-2.5' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Left/Right controls indicators on hover */}
                    <button
                      id="btn-prev-preview-slide"
                      onClick={handlePrevPreview}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-950/80 border border-white/5 hover:bg-slate-900 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      id="btn-next-preview-slide"
                      onClick={handleNextPreview}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-950/80 border border-white/5 hover:bg-slate-900 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-white/5 text-center text-slate-500 p-4">
                    <ImageIcon size={24} className="text-slate-700 mb-1" />
                    <span className="text-xs">{t('slider.noActive', 'No hay diapositivas activas configuradas.')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slide-over or Modal edit/create */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            
            {/* Header Form */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="font-display font-black text-base text-white tracking-tight">
                  {editingSlide ? t('slider.editTitle', 'Editar Diapositiva') : (sliderType === 'footer' ? t('slider.newFooter', 'Nueva Diapositiva Fondo') : t('slider.newCover', 'Nueva Diapositiva Portada'))}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {sliderType === 'footer' ? t('slider.footerSub', 'Añade una imagen al fondo del pie de página.') : t('slider.coverSub', 'Añade un banner publicitario estacional o de oferta.')}
                </p>
              </div>

              <button
                id="btn-close-slide-form"
                onClick={() => setIsFormOpen(false)}
                className="relative z-10 p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-white/5 rounded"
              >
                <X size={14} />
              </button>
            </div>

            {/* Slider Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
               {/* Imagen: común a Hero y Footer */}
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblImage', 'IMAGEN (URL o subir)')}</label>
                 <input
                   id="form-slide-image"
                   type="text"
                   value={image}
                   onChange={(e) => setImage(e.target.value)}
                   placeholder={t('slider.phImage', 'https://images.unsplash.com/photo...')}
                   className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                 />
                 <ImageUploader
                   value={image}
                   onChange={setImage}
                   folder="slider"
                   recommended="1920x1080"
                   label={t('slider.lblUpload', 'O SUBIR DESDE EQUIPO (SE CONVIERTE A WEBP)')}
                 />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <LanguageTabs active={activeLang} onChange={setActiveLang} />
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded text-xs text-amber-300 font-bold flex items-center gap-1.5"
                  >
                    <Languages size={13} /> {t('translateAuto', 'Traducir a EN/PT')}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblTitle', 'TÍTULO *')}</label>
                  <input
                    id="form-slide-title"
                    type="text"
                    required
                    value={currentTrans.title}
                    onChange={(e) => setTranslatedField('title', e.target.value)}
                    onBlur={handleAutoTranslate}
                    placeholder={t('slider.phTitle', 'Ej: Aventura al Límite en Patagonia')}
                    className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblSubtitle', 'SUBTÍTULO')}</label>
                  <input
                    id="form-slide-subtitle"
                    type="text"
                    value={currentTrans.subtitle}
                    onChange={(e) => setTranslatedField('subtitle', e.target.value)}
                    onBlur={handleAutoTranslate}
                    placeholder="Ej: Explora Sudamérica"
                    className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblDescription', 'DESCRIPCIÓN')}</label>
                  <textarea
                    id="form-slide-description"
                    rows={2}
                    value={currentTrans.description}
                    onChange={(e) => setTranslatedField('description', e.target.value)}
                    onBlur={handleAutoTranslate}
                    placeholder="Texto descriptivo del banner"
                    className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblCta', 'TEXTO DEL BOTÓN (CTA)')}</label>
                  <input
                    id="form-slide-cta"
                    type="text"
                    value={currentTrans.ctaText}
                    onChange={(e) => setTranslatedField('ctaText', e.target.value)}
                    onBlur={handleAutoTranslate}
                    placeholder="Ej: Ver tours"
                    className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                  />
                </div>

                {sliderType === 'hero' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblLink', 'ENLACE (LINK)')}</label>
                    <input
                      id="form-slide-link"
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="#tours"
                      className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 font-mono">{t('slider.lblOrder', 'ORDEN VISUAL *')}</label>
                     <input
                       id="form-slide-order"
                       type="number"
                       required
                       min="1"
                       value={order}
                       onChange={(e) => setOrder(Number(e.target.value))}
                       className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs font-mono"
                     />
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <input
                      id="form-slide-active"
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                    />
                    <label className="text-[10px] font-bold text-slate-400 font-mono cursor-pointer select-none">{t('slider.activeNow', 'ACTIVO INMEDIATAMENTE')}</label>
                  </div>
                </div>

                {/* Submit Slide */}
                <div className="pt-4">
                  <button
                    id="btn-save-slide"
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs transition-all duration-300 shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={15} />
                    <span>{t('sliderSaveSlide', 'Guardar Diapositiva')}</span>
                  </button>
                </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
