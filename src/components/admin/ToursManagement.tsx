import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Compass, MapPin, X, 
  Mountain, Parasol, Amphora, Heart, CheckCircle, AlertTriangle, Languages
} from 'lucide-react';
import { Tour, Guide, Vehicle, UserRole } from './types';
import ImageUploader from './ImageUploader';
import LanguageTabs, { LANGS } from './LanguageTabs';
import { dataService } from '../../services/dataService';
import { useTranslation } from '../../i18n/LanguageContext';

interface ToursManagementProps {
  tours: Tour[];
  onSaveTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
  guides: Guide[];
  vehicles: Vehicle[];
  currentRole: UserRole;
  currentOperator: string;
  prefilledTour: Tour | null;
  onClearPrefilledTour: () => void;
}

export default function ToursManagement({
  tours: _tours,
  onSaveTour,
  onDeleteTour,
  guides: _guides,
  vehicles: _vehicles,
  currentRole,
  currentOperator,
  prefilledTour,
  onClearPrefilledTour
}: ToursManagementProps) {  // Search & Filter state
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOperator, setSelectedOperator] = useState<string>('All');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(150);
  const [originalPrice, setOriginalPrice] = useState(199);
  const [discount, setDiscount] = useState(49);
  const [duration, setDuration] = useState('1 día / 8 horas');
  const [durationHours, setDurationHours] = useState(8);
  const [category, setCategory] = useState<Tour['category']>('Cultural');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [oneDay, setOneDay] = useState(true);
  const [popular, setPopular] = useState(false);
  const [guideId, setGuideId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [operator, setOperator] = useState('Andes Expeditions');
  const [adrenalina, setAdrenalina] = useState(50);
  const [relax, setRelax] = useState(50);
  const [cultura, setCultura] = useState(50);
  const [familia, setFamilia] = useState(50);
  const [destinationCountry, setDestinationCountry] = useState<Tour['destinationCountry']>('Perú');
  const [lat, setLat] = useState(-13.163);
  const [lng, setLng] = useState(-72.545);
  const [heroImagesText, setHeroImagesText] = useState('');
  const [bgPosition, setBgPosition] = useState<Tour['bgPosition']>('center');
  const [status, setStatus] = useState<Tour['status']>('DRAFT');

  // Professional tour details
  const [minAge, setMinAge] = useState(12);
  const [maxPassengers, setMaxPassengers] = useState(15);
  const [difficulty, setDifficulty] = useState('MODERATE');
  const [seasonality, setSeasonality] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [galleryImagesText, setGalleryImagesText] = useState('');
  const [includesText, setIncludesText] = useState('');
  const [excludesText, setExcludesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [pickupInfo, setPickupInfo] = useState('');
  const [languagesText, setLanguagesText] = useState('');
  const [groupType, setGroupType] = useState('SHARED');
  const [itineraryDays, setItineraryDays] = useState<Array<{ title: string; content: string }>>([{ title: '', content: '' }]);

  // Multilingual state (ES source + EN/PT auto-translated)
  const [activeLang, setActiveLang] = useState<string>('es');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    es: { title: '', location: '', description: '' },
    en: { title: '', location: '', description: '' },
    pt: { title: '', location: '', description: '' },
  });

  const currentTrans = translations[activeLang] || { title: '', location: '', description: '' };

  const setTranslatedField = (field: 'title' | 'location' | 'description', value: string) => {
    if (activeLang === 'es') {
      if (field === 'title') setTitle(value);
      if (field === 'location') setLocation(value);
      if (field === 'description') setDescription(value);
    }
    setTranslations((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));
  };

  const handleAutoTranslate = async () => {
    const sourceFields: Record<string, string> = {
      title: currentTrans.title,
      location: currentTrans.location,
      description: currentTrans.description,
    };
    if (!sourceFields.title && !sourceFields.location && !sourceFields.description) return;
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

  // Derived discount value — useMemo is correct here, not useEffect
  const computedDiscount = React.useMemo(() => {
    const diff = originalPrice - price;
    return diff > 0 ? diff : 0;
  }, [price, originalPrice]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscount(computedDiscount);
  }, [computedDiscount]);

  // handleOpenFormForCreate declared BEFORE useEffect that calls it
  const handleOpenFormForCreate = useCallback((initData?: Tour) => {
    setEditingTour(null);
    setTitle(initData?.title || '');
    setLocation(initData?.location || '');
    setPrice(initData?.price || 199);
    setOriginalPrice(initData?.originalPrice || 249);
    setDiscount(initData?.discount || 50);
    setDuration(initData?.duration || '1 día / 8 horas');
    setDurationHours(initData?.durationHours || 8);
    setCategory(initData?.category || 'Cultural');
    setDescription(initData?.description || '');
    setImage(initData?.image || 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800');
    setOneDay(initData?.oneDay !== undefined ? initData.oneDay : true);
    setPopular(initData?.popular || false);
    setGuideId(initData?.guideId || _guides[0]?.id || '');
    setVehicleId(initData?.vehicleId || _vehicles[0]?.id || '');

    if (currentRole === 'operator') {
      setOperator(currentOperator);
    } else {
      setOperator(initData?.operator || 'Andes Expeditions');
    }

    setAdrenalina(initData?.vibeScores?.adrenalina || 50);
    setRelax(initData?.vibeScores?.relax || 50);
    setCultura(initData?.vibeScores?.cultura || 50);
    setFamilia(initData?.vibeScores?.familia || 50);
    setDestinationCountry(initData?.destinationCountry || 'Perú');
    setLat(initData?.lat || -12.04637);
    setLng(initData?.lng || -77.04279);
    setHeroImagesText(initData?.heroImages?.join(', ') || initData?.image || '');
    setBgPosition(initData?.bgPosition || 'center');

    setActiveLang('es');
    setTranslations({
      es: {
        title: initData?.title || '',
        location: initData?.location || '',
        description: initData?.description || '',
      },
      en: (initData?.translations?.en as Record<string, string>) || {},
      pt: (initData?.translations?.pt as Record<string, string>) || {},
    });

    setMinAge(initData?.minAge || 12);
    setMaxPassengers(initData?.maxPassengers || 15);
    setDifficulty(initData?.difficulty || 'MODERATE');
    setSeasonality(Array.isArray(initData?.seasonality) ? initData.seasonality.join(', ') : '');
    setTrailerUrl(initData?.trailerUrl || '');
    setGalleryImagesText(Array.isArray(initData?.galleryImages) ? initData.galleryImages.join(', ') : '');
    setIncludesText(Array.isArray(initData?.includes) ? initData.includes.join('\n') : '');
    setExcludesText(Array.isArray(initData?.excludes) ? initData.excludes.join('\n') : '');
    setRequirementsText(Array.isArray(initData?.requirements) ? initData.requirements.join('\n') : '');
    setCancellationPolicy(initData?.cancellationPolicy || '');
    setPickupInfo(initData?.pickupInfo || '');
    setLanguagesText(Array.isArray(initData?.languages) ? initData.languages.join(', ') : '');
    setGroupType(initData?.groupType || 'SHARED');
    setItineraryDays(
      Array.isArray(initData?.itinerary) && initData.itinerary.length > 0
        ? initData.itinerary.map((d: any) => ({ title: d.title || '', content: d.content || '' }))
        : [{ title: '', content: '' }]
    );

    if (currentRole === 'operator') {
      setStatus('DRAFT');
    } else {
      setStatus(initData?.status || 'DRAFT');
    }

    setIsFormOpen(true);
  }, [
    _guides, _vehicles, currentRole, currentOperator,
    setEditingTour, setTitle, setLocation, setPrice, setOriginalPrice,
    setDiscount, setDuration, setDurationHours, setCategory, setDescription,
    setImage, setOneDay, setPopular, setGuideId, setVehicleId, setOperator,
    setAdrenalina, setRelax, setCultura, setFamilia, setDestinationCountry,
    setLat, setLng, setHeroImagesText, setBgPosition, setStatus, setIsFormOpen,
    setActiveLang, setTranslations,
    setMinAge, setMaxPassengers, setDifficulty, setSeasonality, setTrailerUrl,
    setGalleryImagesText, setIncludesText, setExcludesText, setRequirementsText,
    setCancellationPolicy, setPickupInfo, setLanguagesText, setGroupType, setItineraryDays
  ]);

  // Load prefills (e.g. from AI)
  useEffect(() => {
    if (prefilledTour) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleOpenFormForCreate(prefilledTour);
      onClearPrefilledTour();
    }
  }, [prefilledTour, handleOpenFormForCreate, onClearPrefilledTour]);

  const handleOpenFormForEdit = (tour: Tour) => {
    setEditingTour(tour);
    setTitle(tour.title);
    setLocation(tour.location);
    setPrice(tour.price);
    setOriginalPrice(tour.originalPrice);
    setDiscount(tour.discount);
    setDuration(tour.duration);
    setDurationHours(tour.durationHours);
    setCategory(tour.category);
    setDescription(tour.description);
    setImage(tour.image);
    setOneDay(tour.oneDay);
    setPopular(tour.popular);
    setGuideId(tour.guideId);
    setVehicleId(tour.vehicleId);
    setOperator(tour.operator);
    setAdrenalina(tour.vibeAdrenaline ?? tour.vibeScores?.adrenalina ?? 50);
    setRelax(tour.vibeRelax ?? tour.vibeScores?.relax ?? 50);
    setCultura(tour.vibeCulture ?? tour.vibeScores?.cultura ?? 50);
    setFamilia(tour.vibeFamily ?? tour.vibeScores?.familia ?? 50);
    setDestinationCountry(tour.destinationCountry);
    setLat(tour.lat);
    setLng(tour.lng);
    setHeroImagesText(tour.heroImages?.join(', ') || tour.image);
    setBgPosition(tour.bgPosition);
    setStatus(tour.status);
    setMinAge(tour.minAge || 12);
    setMaxPassengers(tour.maxPassengers || 15);
    setDifficulty(tour.difficulty || 'MODERATE');
    setSeasonality(Array.isArray(tour.seasonality) ? tour.seasonality.join(', ') : '');
    setTrailerUrl(tour.trailerUrl || '');
    setGalleryImagesText(Array.isArray(tour.galleryImages) ? tour.galleryImages.join(', ') : '');
    setIncludesText(Array.isArray(tour.includes) ? tour.includes.join('\n') : '');
    setExcludesText(Array.isArray(tour.excludes) ? tour.excludes.join('\n') : '');
    setRequirementsText(Array.isArray(tour.requirements) ? tour.requirements.join('\n') : '');
    setCancellationPolicy(tour.cancellationPolicy || '');
    setPickupInfo(tour.pickupInfo || '');
    setLanguagesText(Array.isArray(tour.languages) ? tour.languages.join(', ') : '');
    setGroupType(tour.groupType || 'SHARED');
    setItineraryDays(
      Array.isArray(tour.itinerary) && tour.itinerary.length > 0
        ? tour.itinerary.map((d: any) => ({ title: d.title || '', content: d.content || '' }))
        : [{ title: '', content: '' }]
    );
    setActiveLang('es');
    setTranslations({
      es: { title: tour.title, location: tour.location, description: tour.description },
      en: (tour.translations?.en as Record<string, string>) || {},
      pt: (tour.translations?.pt as Record<string, string>) || {},
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      alert(t('toursAlertRequired', 'Por favor completa los campos de título y ubicación.'));
      return;
    }

    const saved: Tour = {
      id: editingTour?.id || `tr-${Date.now()}`,
      title,
      location,
      price,
      originalPrice,
      discount,
      duration,
      durationHours,
      category,
      description,
      image: image || 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      oneDay,
      popular,
      guideId,
      vehicleId,
      operator,
      vibeScores: {
        adrenalina,
        relax,
        cultura,
        familia
      },
      destinationCountry,
      lat,
      lng,
      heroImages: heroImagesText.split(',').map(s => s.trim()).filter(s => s.length > 0),
      bgPosition,
      status,
      // Professional tour details
      durationDays: 1,
      featured: false,
      rating: 0,
      reviewsCount: 0,
      shortDescription: '',
      itinerary: itineraryDays.filter(d => d.title.trim() || d.content.trim()).map(d => ({ title: d.title.trim(), content: d.content.trim() })),
      minAge,
      maxPassengers,
      trailerUrl,
      galleryImages: galleryImagesText.split(',').map(s => s.trim()).filter(s => s.length > 0),
      mapCenterLat: lat,
      mapCenterLng: lng,
      mapZoom: 12,
      difficulty,
      seasonality: seasonality.split(',').map(s => s.trim()).filter(s => s.length > 0),
      includes: includesText.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      excludes: excludesText.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      requirements: requirementsText.split('\n').map(s => s.trim()).filter(s => s.length > 0),
      pickupInfo,
      cancellationPolicy,
      languages: languagesText.split(',').map(s => s.trim()).filter(s => s.length > 0),
      groupType,
      availableDates: {},
      translations: {
        es: { title, location, description },
        en: translations.en || {},
        pt: translations.pt || {},
      }
    };

    onSaveTour(saved);
    setIsFormOpen(false);
  };

  const formContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFormOpen && formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
  }, [isFormOpen]);

  // Filters application
  const filteredTours = _tours.filter(tour => {
    if (currentRole === 'operator' && tour.operator !== currentOperator) {
      return false;
    }
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.operator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
    const matchesOperator = selectedOperator === 'All' || tour.operator === selectedOperator;
    return matchesSearch && matchesCategory && matchesOperator;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="bt-tours-management">
      {isFormOpen ? (
        <div className="space-y-6 animate-fade-in" id="bt-tours-form-container" ref={formContainerRef}>
          {/* Form Header */}
          <div className="flex justify-between items-center pb-5 border-b border-white/5">
            <div>
              <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                <Compass size={20} className="text-amber-500" />
                {editingTour ? t('tours.editTitle', 'Editar Tour Existente') : t('tours.newTitle', 'Registrar Nuevo Tour')}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {t('toursFormSubtitle', 'Modifica los parámetros de cotización, localización, recursos y vibraciones.')}
              </p>
            </div>

            <button
              id="btn-close-tour-form"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <X size={14} />
              <span>{t('tours.backCatalog', 'Volver al Catálogo')}</span>
            </button>
          </div>

          {/* Master form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start bg-slate-900/40 p-6 border border-white/5 rounded-2xl">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4">
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
                    <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblTitle', 'TÍTULO DEL TOUR *')}</label>
                    <input
                      id="form-tour-title"
                      type="text"
                      required
                      value={currentTrans.title}
                      onChange={(e) => setTranslatedField('title', e.target.value)}
                      onBlur={handleAutoTranslate}
                      placeholder={t('tours.phTitle', 'Ej: Camino Inca Sagrado a Machu Picchu')}
                      className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblLocation', 'UBICACIÓN *')}</label>
                    <input
                      id="form-tour-location"
                      type="text"
                      required
                      value={currentTrans.location}
                      onChange={(e) => setTranslatedField('location', e.target.value)}
                      onBlur={handleAutoTranslate}
                      placeholder={t('tours.phLocation', 'Ej: Cusco, Perú')}
                      className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblDuration', 'DURACIÓN')}</label>
                    <input
                      id="form-tour-duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder={t('tours.phDuration', 'Ej: 4 días / 3 noches')}
                      className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <ImageUploader
                      value={image}
                      onChange={setImage}
                      folder="tours"
                      recommended="1600x900"
                      label={t('toursLblImage', 'IMAGEN PRINCIPAL')}
                    />
                  </div>

                  <div className="space-y-1">
                    <ImageUploader
                      value={heroImagesText}
                      onChange={setHeroImagesText}
                      folder="tours"
                      multiple
                      recommended="1280x720 (varias)"
                      label={t('toursLblImages', 'IMÁGENES HERO')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblDescription', 'DESCRIPCIÓN / SEO')}</label>
                    <textarea
                      id="form-tour-description"
                      value={currentTrans.description}
                      onChange={(e) => setTranslatedField('description', e.target.value)}
                      onBlur={handleAutoTranslate}
                      placeholder={t('tours.phSeo', 'Escribe el resumen SEO del tour...')}
                      rows={3}
                      className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>

                  {/* ===== SECCIÓN: DETALLES PROFESIONALES DEL TOUR ===== */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Compass size={16} className="text-amber-500" />
                      <h4 className="text-[11px] font-black text-amber-500 font-mono uppercase tracking-wider">Detalles Profesionales del Tour</h4>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblMinAge', 'EDAD MÍNIMA')}</label>
                        <input
                          type="number"
                          min="0"
                          value={minAge}
                          onChange={(e) => setMinAge(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblMaxPassengers', 'PASAJEROS MÁX.')}</label>
                        <input
                          type="number"
                          min="1"
                          value={maxPassengers}
                          onChange={(e) => setMaxPassengers(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblDifficulty', 'DIFICULTAD')}</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs"
                        >
                          <option value="EASY">Fácil</option>
                          <option value="MODERATE">Moderada</option>
                          <option value="CHALLENGING">Desafiante</option>
                          <option value="HARD">Difícil</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblGroupType', 'TIPO DE GRUPO')}</label>
                        <select
                          value={groupType}
                          onChange={(e) => setGroupType(e.target.value)}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs"
                        >
                          <option value="SHARED">Compartido</option>
                          <option value="PRIVATE">Privado</option>
                          <option value="GROUP">Grupo</option>
                        </select>
                      </div>
                    </div>

                    {/* Seasonality */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblSeasonality', 'DISPONIBILIDAD / TEMPORADA')}</label>
                      <input
                        type="text"
                        value={seasonality}
                        onChange={(e) => setSeasonality(e.target.value)}
                        placeholder={t('tours.phSeasonality', 'Ej: Todo el Año, Verano, Invierno...')}
                        className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                      />
                      <p className="text-[9px] text-slate-500">Separa múltiples temporadas con coma</p>
                    </div>

                    {/* Trailer URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblTrailer', 'URL DEL TRAILER (YouTube)')}</label>
                      <input
                        type="url"
                        value={trailerUrl}
                        onChange={(e) => setTrailerUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-1">
                      <ImageUploader
                        value={galleryImagesText}
                        onChange={setGalleryImagesText}
                        folder="tours"
                        multiple
                        recommended="1280x720 (varias)"
                        label={t('toursLblGallery', 'GALERÍA DE FOTOS')}
                      />
                    </div>

                    {/* Itinerary Editor */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblItinerary', 'ITINERARIO (DÍAS)')}</label>
                      <div className="space-y-3">
                        {itineraryDays.map((day, idx) => (
                          <div key={idx} className="space-y-2 p-3 bg-slate-900/40 border border-white/5 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-slate-500">DÍA {idx + 1}</span>
                              {itineraryDays.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setItineraryDays(days => days.filter((_, i) => i !== idx))}
                                  className="text-[9px] text-rose-400 hover:text-rose-300 font-bold"
                                >
                                  ✕ Quitar
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Título del día (Ej: Día 1: Llegada y Acomodación)"
                              value={day.title}
                              onChange={(e) => {
                                const newDays = [...itineraryDays];
                                newDays[idx] = { ...newDays[idx], title: e.target.value };
                                setItineraryDays(newDays);
                              }}
                              className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                            />
                            <textarea
                              placeholder="Descripción detallada del día..."
                              value={day.content}
                              onChange={(e) => {
                                const newDays = [...itineraryDays];
                                newDays[idx] = { ...newDays[idx], content: e.target.value };
                                setItineraryDays(newDays);
                              }}
                              rows={2}
                              className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setItineraryDays([...itineraryDays, { title: '', content: '' }])}
                          className="w-full py-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 border border-dashed border-white/10 rounded hover:border-amber-500/30 transition-all flex items-center justify-center gap-1"
                        >
                          + Agregar Día
                        </button>
                      </div>
                    </div>

                    {/* Includes / Excludes / Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblIncludes', 'INCLUYE')}</label>
                        <textarea
                          value={includesText}
                          onChange={(e) => setIncludesText(e.target.value)}
                          placeholder="Guía certificado, Transporte, Seguro..."
                          rows={3}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                        <p className="text-[8px] text-slate-600">Un ítem por línea</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblExcludes', 'NO INCLUYE')}</label>
                        <textarea
                          value={excludesText}
                          onChange={(e) => setExcludesText(e.target.value)}
                          placeholder="Entradas, Propinas, Equipamiento..."
                          rows={3}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                        <p className="text-[8px] text-slate-600">Un ítem por línea</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblRequirements', 'REQUISITOS')}</label>
                        <textarea
                          value={requirementsText}
                          onChange={(e) => setRequirementsText(e.target.value)}
                          placeholder="Edad mínima, Ropa recomendada, Documentos..."
                          rows={3}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                        <p className="text-[8px] text-slate-600">Un ítem por línea</p>
                      </div>
                    </div>

                    {/* Cancellation Policy & Pickup Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblCancellation', 'POLÍTICA DE CANCELACIÓN')}</label>
                        <textarea
                          value={cancellationPolicy}
                          onChange={(e) => setCancellationPolicy(e.target.value)}
                          placeholder="Cancelación gratuita hasta 48h antes..."
                          rows={2}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblPickup', 'INFO DE RECOJO')}</label>
                        <textarea
                          value={pickupInfo}
                          onChange={(e) => setPickupInfo(e.target.value)}
                          placeholder="Punto de encuentro: Av. Principal 123..."
                          rows={2}
                          className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblLanguages', 'IDIOMAS DEL TOUR')}</label>
                      <input
                        type="text"
                        value={languagesText}
                        onChange={(e) => setLanguagesText(e.target.value)}
                        placeholder="Español, Inglés, Portugués..."
                        className="w-full bg-slate-900 border border-white/5 rounded px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
                      />
                      <p className="text-[9px] text-slate-500">Separa múltiples idiomas con coma</p>
                    </div>
                  </div>
                </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="space-y-5">
              <div className="space-y-3.5 p-4 bg-slate-900/60 border border-white/5 rounded-xl">
                <span className="text-[10px] font-bold text-amber-500 font-mono uppercase block">{t('toursLblVibes', 'VIBRACIONES Y PERFIL DE VIBRA (0-100)')}</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Mountain size={11} className="text-rose-400" /> {t('toursVibeAdrenalina', 'Adrenalina')}
                      </span>
                      <span className="text-rose-400 font-bold">{adrenalina}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={adrenalina} onChange={(e) => setAdrenalina(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Parasol size={11} className="text-sky-400" /> {t('toursVibeRelax', 'Relax')}
                      </span>
                      <span className="text-sky-400 font-bold">{relax}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={relax} onChange={(e) => setRelax(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Amphora size={11} className="text-amber-400" /> {t('toursVibeCultura', 'Cultura')}
                      </span>
                      <span className="text-amber-400 font-bold">{cultura}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={cultura} onChange={(e) => setCultura(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Heart size={11} className="text-emerald-400" /> {t('toursVibeFamilia', 'Familia')}
                      </span>
                      <span className="text-emerald-400 font-bold">{familia}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={familia} onChange={(e) => setFamilia(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    id="form-tour-oneday"
                    type="checkbox"
                    checked={oneDay}
                    onChange={(e) => setOneDay(e.target.checked)}
                    className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <label className="text-[10px] font-bold text-slate-400 font-mono cursor-pointer select-none">{t('toursLblOneDay', 'TOUR EN UN SOLO DÍA')}</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="form-tour-popular"
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded border-white/10 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4"
                  />
                  <label className="text-[10px] font-bold text-slate-400 font-mono cursor-pointer select-none">{t('toursLblPopular', 'MARCAR POPULAR 🔥')}</label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 font-mono">{t('toursLblBgPosition', 'BG POSITION HERO')}</label>
                  <select
                    id="form-tour-bg-position"
                    value={bgPosition}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBgPosition(e.target.value as Tour['bgPosition'])}
                    className="w-full bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-slate-300 text-xs"
                  >
                    <option value="center">center</option>
                    <option value="top">top</option>
                    <option value="bottom">bottom</option>
                    <option value="left">left</option>
                    <option value="right">right</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono block">{t('toursLblStatus', 'ESTADO DE PUBLICACIÓN')}</label>
                <select
                  disabled={currentRole === 'operator'}
                  value={status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Tour['status'])}
                  className="w-full bg-slate-900 border border-white/5 rounded px-4 py-2 text-slate-200 text-xs font-bold"
                >
                  <option value="DRAFT">{t('toursStatusDraft', 'DRAFT (Borrador Interno)')}</option>
                  <option value="PENDING">{t('toursStatusPending', 'PENDING (Esperando aprobación de BuscaTours)')}</option>
                  <option value="PUBLISHED">{t('toursStatusPublished', 'PUBLISHED (Activo en Marketplace)')}</option>
                </select>
                {currentRole === 'operator' && (
                  <span className="text-[9px] text-amber-500 font-mono leading-none block mt-1">
                    {t('toursOperatorAuditNote', '⚠️ Tus cambios se guardarán como borrador/pendiente para auditoría del administrador general.')}
                  </span>
                )}
              </div>

              <div className="pt-4 pb-2">
                <button
                  id="btn-save-tour-form"
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs transition-all duration-300 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={15} />
                  <span>{t('tours.saveBtn', 'GUARDAR Y CONSOLIDAR EN EL CATÁLOGO')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                <Compass size={20} className="text-amber-500" />
                Catálogo de Tours {currentRole === 'operator' ? `(${currentOperator})` : ''}
              </h3>
              <p className="text-slate-400 text-xs">
                {currentRole === 'operator' 
                  ? t('tours.operatorSubtitle', 'Administra tus propios tours locales, itinerarios y asignación de recursos.')
                  : t('tours.platformSubtitle', 'Gestión total de tours de todos los operadores locales andinos de BuscaTours.')}
              </p>
            </div>

            <button
              id="btn-create-tour"
              onClick={() => handleOpenFormForCreate()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 self-start md:self-auto"
            >
              <Plus size={15} />
              <span>{t('tours.newBtn', 'Registrar Nuevo Tour')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 bg-slate-950/60 p-4 border border-white/5 rounded-2xl">
            <div className="sm:col-span-5 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="tour-search-query"
                type="text"
                placeholder={t('tours.searchPlaceholder', 'Buscar por título, destino, operador...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded pl-9 pr-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50 transition-all font-semibold"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                id="tour-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-amber-500/50 transition-all font-semibold"
              >
                <option value="All">{t('tours.allCategories', 'Todas las Categorías')}</option>
                <option value="Outdoor">{t('toursCatOutdoor', 'Outdoor')}</option>
                <option value="Aventura">{t('toursCatAventura', 'Aventura')}</option>
                <option value="Cultural">{t('toursCatCultural', 'Cultural')}</option>
                <option value="Histórico">{t('toursCatHistorico', 'Histórico')}</option>
                <option value="Glaciar">{t('toursCatGlaciar', 'Glaciar')}</option>
                <option value="Selva">{t('toursCatSelva', 'Selva')}</option>
                <option value="Montaña">{t('toursCatMontana', 'Montaña')}</option>
              </select>
            </div>

            {currentRole !== 'operator' && (
              <div className="sm:col-span-4">
                <select
                  id="tour-operator-filter"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-amber-500/50 transition-all font-semibold"
                >
                  <option value="All">{t('tours.allOperators', 'Todos los Operadores')}</option>
                  <option value="Andes Expeditions">Andes Expeditions</option>
                  <option value="Patagonia Wild">Patagonia Wild</option>
                  <option value="Amazon Green">Amazon Green</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTours.map((tour) => {
              const guide = _guides.find(g => g.id === tour.guideId);
              const vehicle = _vehicles.find(v => v.id === tour.vehicleId);

              return (
                <div 
                  key={tour.id} 
                  id={`tour-card-${tour.id}`}
                  className="glass-card overflow-hidden flex flex-col justify-between group hover:border-white/10 transition-all duration-300"
                >
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                        tour.status === 'PUBLISHED' 
                          ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                          : tour.status === 'PENDING'
                            ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                            : 'bg-slate-500/15 border-white/5 text-slate-400'
                      }`}>
                        {tour.status === 'PUBLISHED' ? 'PUBLISHED' : tour.status === 'PENDING' ? t('toursCardReview', 'EN REVISIÓN') : 'DRAFT'}
                      </span>

                      {tour.popular && (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black font-mono px-2 py-0.5 rounded-full">
                          {t('toursCardPopular', '🔥 POPULAR')}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-mono font-bold">
                        <MapPin size={10} />
                        <span>{tour.location} ({tour.destinationCountry})</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white mt-0.5 truncate">{tour.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                      <div className="bg-slate-950/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block">{t('toursLblDurationShort', 'Duración')}</span>
                        <span className="text-slate-200 font-bold">{tour.duration}</span>
                      </div>
                      <div className="bg-slate-950/40 p-2 rounded-lg border border-white/5">
                        <span className="text-slate-500 block">{t('toursLblPrice', 'Precio')}</span>
                        <span className="text-amber-400 font-bold">${tour.price} USD</span>
                      </div>
                    </div>

                    {guide && (
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="text-slate-600">{t('toursLblGuide', 'Guía:')}</span>
                        <span className="text-slate-300">{guide.name}</span>
                        <span className="text-slate-600 ml-1">· {t('toursLblVehicle', 'Vehículo:')}</span>
                        <span className="text-slate-300">{vehicle?.name || '—'}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      id={`btn-edit-tour-${tour.id}`}
                      onClick={() => handleOpenFormForEdit(tour)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit2 size={12} /> {t('toursEdit', 'Editar')}
                    </button>
                    <button
                      id={`btn-delete-tour-${tour.id}`}
                      onClick={() => {
                        const msg = t('toursConfirmDelete', '¿Eliminar "{title}"? Esta acción no se puede deshacer.').replace('{title}', tour.title);
                        if (confirm(msg)) {
                          onDeleteTour(tour.id);
                        }
                      }}
                      className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTours.length === 0 && (
              <div className="col-span-full text-center py-16">
                <AlertTriangle size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">{t('tours.noResults', 'No se encontraron tours con los filtros aplicados.')}</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedOperator('All'); }}
                  className="mt-3 text-amber-500 text-xs font-semibold hover:underline"
                >
                  {t('toursClearFilters', 'Limpiar filtros')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
