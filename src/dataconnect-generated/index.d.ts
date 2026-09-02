import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
};

export enum Category {
  OUTDOOR = "OUTDOOR",
  RELAXACION = "RELAXACION",
  FERIADO = "FERIADO",
  TEMPORADA = "TEMPORADA",
  SALVAJE = "SALVAJE",
  AVENTURA = "AVENTURA",
  TEMATICO = "TEMATICO",
  CULTURAL = "CULTURAL",
  CIUDAD = "CIUDAD",
  MONTANA = "MONTANA",
  GLACIAR = "GLACIAR",
  LUJO = "LUJO",
  HISTORICO = "HISTORICO",
  FAMILIAR = "FAMILIAR",
  SELVA = "SELVA",
  FULLDAY = "FULLDAY",
  NAVEGACION = "NAVEGACION",
};

export enum CheckinStatus {
  PENDING = "PENDING",
  SYNCED = "SYNCED",
  PENDIENTE_SYNC = "PENDIENTE_SYNC",
};

export enum Destination {
  ARGENTINA = "ARGENTINA",
  PERU = "PERU",
  BOLIVIA = "BOLIVIA",
  BRAZIL = "BRAZIL",
  COLOMBIA = "COLOMBIA",
  ECUADOR = "ECUADOR",
  CHILE = "CHILE",
  MEXICO = "MEXICO",
  DOMINICAN_REPUBLIC = "DOMINICAN_REPUBLIC",
  GUATEMALA = "GUATEMALA",
  COSTA_RICA = "COSTA_RICA",
  PANAMA = "PANAMA",
  CUBA = "CUBA",
  BELICE = "BELICE",
  EL_SALVADOR = "EL_SALVADOR",
  HONDURAS = "HONDURAS",
  NICARAGUA = "NICARAGUA",
  HAITI = "HAITI",
  URUGUAY = "URUGUAY",
  PARAGUAY = "PARAGUAY",
  VENEZUELA = "VENEZUELA",
  BAHAMAS = "BAHAMAS",
  BARBADOS = "BARBADOS",
  ANTIGUA = "ANTIGUA",
  GRENADA = "GRENADA",
  JAMAICA = "JAMAICA",
  DOMINICA = "DOMINICA",
  SAINT_KITTS = "SAINT_KITTS",
  SAINT_VINCENT = "SAINT_VINCENT",
  SAINT_LUCIA = "SAINT_LUCIA",
  TRINIDAD = "TRINIDAD",
};

export enum DestinationRegion {
  LATINOAMERICA = "LATINOAMERICA",
  CENTRALAMERICA = "CENTRALAMERICA",
  CARIBBEAN = "CARIBBEAN",
};

export enum Difficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  DIFFICULT = "DIFFICULT",
  EXTREME = "EXTREME",
};

export enum GroupType {
  PRIVATE = "PRIVATE",
  SHARED = "SHARED",
  BOTH = "BOTH",
};

export enum GuideStatus {
  DISPONIBLE = "DISPONIBLE",
  EN_TOUR = "EN_TOUR",
  OFFLINE = "OFFLINE",
};

export enum HomepageSection {
  NONE = "NONE",
  FLASH_DEAL = "FLASH_DEAL",
  POPULAR = "POPULAR",
  VACATION = "VACATION",
  ONE_DAY = "ONE_DAY",
};

export enum Role {
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
  OPERATOR = "OPERATOR",
  TOUR_ADMIN = "TOUR_ADMIN",
  CUSTOMER = "CUSTOMER",
};

export enum TourStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
};

export enum VehicleStatus {
  DISPONIBLE = "DISPONIBLE",
  EN_USO = "EN_USO",
  OFFLINE = "OFFLINE",
};



export interface AddOfflineCheckinData {
  pwaCheckin_insert: PwaCheckin_Key;
}

export interface AddOfflineCheckinVariables {
  tourId?: UUIDString | null;
  bookingId?: UUIDString | null;
  tourTitle?: string | null;
  customerName?: string | null;
  operator: string;
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  bookingId: string;
  tourId: UUIDString;
  userId: string;
  guests: number;
  date: TimestampString;
  totalPrice: number;
  currency?: string | null;
  status?: BookingStatus | null;
  addons?: unknown | null;
  specialRequests?: string | null;
}

export interface CreateGuideData {
  guide_insert: Guide_Key;
}

export interface CreateGuideVariables {
  name: string;
  specialty: string;
  status?: GuideStatus | null;
  operatorId: string;
}

export interface CreateSliderSlideData {
  sliderSlide_insert: SliderSlide_Key;
}

export interface CreateSliderSlideVariables {
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
  order?: number | null;
  active?: boolean | null;
  translations?: string | null;
}

export interface CreateTourData {
  tour_insert: Tour_Key;
}

export interface CreateTourVariables {
  title: string;
  location: string;
  duration: string;
  durationHours: number;
  originalPrice: number;
  price: number;
  discount?: string | null;
  category: Category;
  description: string;
  image: string;
  featured?: boolean | null;
  oneDay?: boolean | null;
  popular?: boolean | null;
  status?: TourStatus | null;
  destination: Destination;
  vibeAdrenaline?: number | null;
  vibeRelax?: number | null;
  vibeCulture?: number | null;
  vibeFamily?: number | null;
  lat?: number | null;
  lng?: number | null;
  heroImages?: string | null;
  heroBackgroundPosition?: string | null;
  translations?: string | null;
  operatorId: string;
  availableDates?: unknown | null;
  itinerary?: unknown | null;
  minAge?: number | null;
  maxPassengers?: number | null;
  trailerUrl?: string | null;
  galleryImages?: unknown | null;
  mapCenterLat?: number | null;
  mapCenterLng?: number | null;
  mapZoom?: number | null;
  difficulty?: Difficulty | null;
  seasonality?: unknown | null;
  includes?: unknown | null;
  excludes?: unknown | null;
  requirements?: unknown | null;
  pickupInfo?: string | null;
  cancellationPolicy?: string | null;
  languages?: unknown | null;
  groupType?: GroupType | null;
  homepageSection?: HomepageSection | null;
  destinationRegion?: DestinationRegion | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  email: string;
  name: string;
  description?: string | null;
}

export interface CreateVehicleData {
  vehicle_insert: Vehicle_Key;
}

export interface CreateVehicleVariables {
  name: string;
  seats: number;
  status?: VehicleStatus | null;
  operatorId: string;
}

export interface DeleteBookingData {
  booking_delete?: Booking_Key | null;
}

export interface DeleteBookingVariables {
  id: UUIDString;
}

export interface DeleteGuideData {
  guide_delete?: Guide_Key | null;
}

export interface DeleteGuideVariables {
  id: UUIDString;
}

export interface DeletePwaCheckinData {
  pwaCheckin_delete?: PwaCheckin_Key | null;
}

export interface DeletePwaCheckinVariables {
  id: UUIDString;
}

export interface DeleteSliderSlideData {
  sliderSlide_delete?: SliderSlide_Key | null;
}

export interface DeleteSliderSlideVariables {
  id: UUIDString;
}

export interface DeleteTourData {
  tour_delete?: Tour_Key | null;
}

export interface DeleteTourVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: string;
}

export interface DeleteVehicleData {
  vehicle_delete?: Vehicle_Key | null;
}

export interface DeleteVehicleVariables {
  id: UUIDString;
}

export interface GetActiveSliderSlidesData {
  sliderSlides: ({
    id: UUIDString;
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
    image: string;
    link: string;
    order: number;
    active: boolean;
    translations?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & SliderSlide_Key)[];
}

export interface GetBookingsData {
  bookings: ({
    id: UUIDString;
    bookingId: string;
    tourId: UUIDString;
    tour: {
      id: UUIDString;
      title: string;
      price: number;
    } & Tour_Key;
      userId: string;
      user: {
        id: string;
        name: string;
        email: string;
      } & User_Key;
        guests: number;
        date: TimestampString;
        totalPrice: number;
        currency: string;
        status: BookingStatus;
        addons?: unknown | null;
        specialRequests?: string | null;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetCurrentUserData {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface GetGuidesData {
  guides: ({
    id: UUIDString;
    name: string;
    specialty: string;
    status: GuideStatus;
    operatorId: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Guide_Key)[];
}

export interface GetGuidesVariables {
  operatorId?: string | null;
  status?: GuideStatus | null;
}

export interface GetOfflineQueueData {
  pwaCheckins: ({
    id: UUIDString;
    tourId?: UUIDString | null;
    bookingId?: UUIDString | null;
    tourTitle?: string | null;
    customerName?: string | null;
    operator: string;
    status: CheckinStatus;
    timestamp: TimestampString;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & PwaCheckin_Key)[];
}

export interface GetOfflineQueueVariables {
  operator?: string | null;
  status?: CheckinStatus | null;
}

export interface GetTourData {
  tour?: {
    id: UUIDString;
    title: string;
    location: string;
    duration: string;
    durationHours: number;
    durationDays: number;
    originalPrice: number;
    price: number;
    discount?: string | null;
    rating: number;
    reviewsCount: number;
    category: Category;
    description: string;
    shortDescription?: string | null;
    image: string;
    featured: boolean;
    oneDay: boolean;
    popular: boolean;
    status: TourStatus;
    destination: Destination;
    vibeAdrenaline: number;
    vibeRelax: number;
    vibeCulture: number;
    vibeFamily: number;
    lat?: number | null;
    lng?: number | null;
    heroImages?: string | null;
    heroBackgroundPosition?: string | null;
    translations?: string | null;
    operatorId: string;
    availableDates?: unknown | null;
    itinerary?: unknown | null;
    minAge: number;
    maxPassengers: number;
    trailerUrl?: string | null;
    galleryImages?: unknown | null;
    mapCenterLat?: number | null;
    mapCenterLng?: number | null;
    mapZoom: number;
    difficulty: Difficulty;
    seasonality?: unknown | null;
    includes?: unknown | null;
    excludes?: unknown | null;
    requirements?: unknown | null;
    pickupInfo?: string | null;
    cancellationPolicy?: string | null;
    languages?: unknown | null;
    groupType: GroupType;
    homepageSection: HomepageSection;
    destinationRegion: DestinationRegion;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Tour_Key;
}

export interface GetTourVariables {
  id: UUIDString;
}

export interface GetToursData {
  tours: ({
    id: UUIDString;
    title: string;
    location: string;
    duration: string;
    durationHours: number;
    durationDays: number;
    originalPrice: number;
    price: number;
    discount?: string | null;
    rating: number;
    reviewsCount: number;
    category: Category;
    description: string;
    shortDescription?: string | null;
    image: string;
    featured: boolean;
    oneDay: boolean;
    popular: boolean;
    status: TourStatus;
    destination: Destination;
    vibeAdrenaline: number;
    vibeRelax: number;
    vibeCulture: number;
    vibeFamily: number;
    lat?: number | null;
    lng?: number | null;
    heroImages?: string | null;
    heroBackgroundPosition?: string | null;
    translations?: string | null;
    operatorId: string;
    availableDates?: unknown | null;
    itinerary?: unknown | null;
    minAge: number;
    maxPassengers: number;
    trailerUrl?: string | null;
    galleryImages?: unknown | null;
    mapCenterLat?: number | null;
    mapCenterLng?: number | null;
    mapZoom: number;
    difficulty: Difficulty;
    seasonality?: unknown | null;
    includes?: unknown | null;
    excludes?: unknown | null;
    requirements?: unknown | null;
    pickupInfo?: string | null;
    cancellationPolicy?: string | null;
    languages?: unknown | null;
    groupType: GroupType;
    homepageSection: HomepageSection;
    destinationRegion: DestinationRegion;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Tour_Key)[];
}

export interface GetUsersData {
  users: ({
    id: string;
    email: string;
    name: string;
    role: Role;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key)[];
}

export interface GetVehiclesData {
  vehicles: ({
    id: UUIDString;
    name: string;
    seats: number;
    status: VehicleStatus;
    operatorId: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Vehicle_Key)[];
}

export interface GetVehiclesVariables {
  operatorId?: string | null;
  status?: VehicleStatus | null;
}

export interface Guide_Key {
  id: UUIDString;
  __typename?: 'Guide_Key';
}

export interface PwaCheckin_Key {
  id: UUIDString;
  __typename?: 'PwaCheckin_Key';
}

export interface SliderSlide_Key {
  id: UUIDString;
  __typename?: 'SliderSlide_Key';
}

export interface Tour_Key {
  id: UUIDString;
  __typename?: 'Tour_Key';
}

export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}

export interface UpdateBookingVariables {
  id: UUIDString;
  tourId?: UUIDString | null;
  userId?: string | null;
  guests?: number | null;
  date?: TimestampString | null;
  totalPrice?: number | null;
  currency?: string | null;
  status?: BookingStatus | null;
  addons?: unknown | null;
  specialRequests?: string | null;
}

export interface UpdateGuideData {
  guide_update?: Guide_Key | null;
}

export interface UpdateGuideVariables {
  id: UUIDString;
  name?: string | null;
  specialty?: string | null;
  status?: GuideStatus | null;
}

export interface UpdateSliderSlideData {
  sliderSlide_update?: SliderSlide_Key | null;
}

export interface UpdateSliderSlideVariables {
  id: UUIDString;
  subtitle?: string | null;
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  image?: string | null;
  link?: string | null;
  order?: number | null;
  active?: boolean | null;
  translations?: string | null;
}

export interface UpdateTourData {
  tour_update?: Tour_Key | null;
}

export interface UpdateTourVariables {
  id: UUIDString;
  title?: string | null;
  location?: string | null;
  duration?: string | null;
  durationHours?: number | null;
  originalPrice?: number | null;
  price?: number | null;
  discount?: string | null;
  category?: Category | null;
  description?: string | null;
  image?: string | null;
  featured?: boolean | null;
  oneDay?: boolean | null;
  popular?: boolean | null;
  status?: TourStatus | null;
  destination?: Destination | null;
  vibeAdrenaline?: number | null;
  vibeRelax?: number | null;
  vibeCulture?: number | null;
  vibeFamily?: number | null;
  lat?: number | null;
  lng?: number | null;
  heroImages?: string | null;
  heroBackgroundPosition?: string | null;
  translations?: string | null;
  operatorId?: string | null;
  availableDates?: unknown | null;
  itinerary?: unknown | null;
  minAge?: number | null;
  maxPassengers?: number | null;
  trailerUrl?: string | null;
  galleryImages?: unknown | null;
  mapCenterLat?: number | null;
  mapCenterLng?: number | null;
  mapZoom?: number | null;
  difficulty?: Difficulty | null;
  seasonality?: unknown | null;
  includes?: unknown | null;
  excludes?: unknown | null;
  requirements?: unknown | null;
  pickupInfo?: string | null;
  cancellationPolicy?: string | null;
  languages?: unknown | null;
  groupType?: GroupType | null;
  homepageSection?: HomepageSection | null;
  destinationRegion?: DestinationRegion | null;
}

export interface UpdateVehicleData {
  vehicle_update?: Vehicle_Key | null;
}

export interface UpdateVehicleVariables {
  id: UUIDString;
  name?: string | null;
  seats?: number | null;
  status?: VehicleStatus | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface Vehicle_Key {
  id: UUIDString;
  __typename?: 'Vehicle_Key';
}

interface CreateTourRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTourVariables): MutationRef<CreateTourData, CreateTourVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTourVariables): MutationRef<CreateTourData, CreateTourVariables>;
  operationName: string;
}
export const createTourRef: CreateTourRef;

export function createTour(vars: CreateTourVariables): MutationPromise<CreateTourData, CreateTourVariables>;
export function createTour(dc: DataConnect, vars: CreateTourVariables): MutationPromise<CreateTourData, CreateTourVariables>;

interface UpdateTourRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTourVariables): MutationRef<UpdateTourData, UpdateTourVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTourVariables): MutationRef<UpdateTourData, UpdateTourVariables>;
  operationName: string;
}
export const updateTourRef: UpdateTourRef;

export function updateTour(vars: UpdateTourVariables): MutationPromise<UpdateTourData, UpdateTourVariables>;
export function updateTour(dc: DataConnect, vars: UpdateTourVariables): MutationPromise<UpdateTourData, UpdateTourVariables>;

interface DeleteTourRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTourVariables): MutationRef<DeleteTourData, DeleteTourVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTourVariables): MutationRef<DeleteTourData, DeleteTourVariables>;
  operationName: string;
}
export const deleteTourRef: DeleteTourRef;

export function deleteTour(vars: DeleteTourVariables): MutationPromise<DeleteTourData, DeleteTourVariables>;
export function deleteTour(dc: DataConnect, vars: DeleteTourVariables): MutationPromise<DeleteTourData, DeleteTourVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface UpdateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
  operationName: string;
}
export const updateBookingRef: UpdateBookingRef;

export function updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;
export function updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateSliderSlideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSliderSlideVariables): MutationRef<CreateSliderSlideData, CreateSliderSlideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSliderSlideVariables): MutationRef<CreateSliderSlideData, CreateSliderSlideVariables>;
  operationName: string;
}
export const createSliderSlideRef: CreateSliderSlideRef;

export function createSliderSlide(vars: CreateSliderSlideVariables): MutationPromise<CreateSliderSlideData, CreateSliderSlideVariables>;
export function createSliderSlide(dc: DataConnect, vars: CreateSliderSlideVariables): MutationPromise<CreateSliderSlideData, CreateSliderSlideVariables>;

interface UpdateSliderSlideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSliderSlideVariables): MutationRef<UpdateSliderSlideData, UpdateSliderSlideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSliderSlideVariables): MutationRef<UpdateSliderSlideData, UpdateSliderSlideVariables>;
  operationName: string;
}
export const updateSliderSlideRef: UpdateSliderSlideRef;

export function updateSliderSlide(vars: UpdateSliderSlideVariables): MutationPromise<UpdateSliderSlideData, UpdateSliderSlideVariables>;
export function updateSliderSlide(dc: DataConnect, vars: UpdateSliderSlideVariables): MutationPromise<UpdateSliderSlideData, UpdateSliderSlideVariables>;

interface DeleteSliderSlideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSliderSlideVariables): MutationRef<DeleteSliderSlideData, DeleteSliderSlideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSliderSlideVariables): MutationRef<DeleteSliderSlideData, DeleteSliderSlideVariables>;
  operationName: string;
}
export const deleteSliderSlideRef: DeleteSliderSlideRef;

export function deleteSliderSlide(vars: DeleteSliderSlideVariables): MutationPromise<DeleteSliderSlideData, DeleteSliderSlideVariables>;
export function deleteSliderSlide(dc: DataConnect, vars: DeleteSliderSlideVariables): MutationPromise<DeleteSliderSlideData, DeleteSliderSlideVariables>;

interface CreateGuideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuideVariables): MutationRef<CreateGuideData, CreateGuideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGuideVariables): MutationRef<CreateGuideData, CreateGuideVariables>;
  operationName: string;
}
export const createGuideRef: CreateGuideRef;

export function createGuide(vars: CreateGuideVariables): MutationPromise<CreateGuideData, CreateGuideVariables>;
export function createGuide(dc: DataConnect, vars: CreateGuideVariables): MutationPromise<CreateGuideData, CreateGuideVariables>;

interface UpdateGuideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuideVariables): MutationRef<UpdateGuideData, UpdateGuideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGuideVariables): MutationRef<UpdateGuideData, UpdateGuideVariables>;
  operationName: string;
}
export const updateGuideRef: UpdateGuideRef;

export function updateGuide(vars: UpdateGuideVariables): MutationPromise<UpdateGuideData, UpdateGuideVariables>;
export function updateGuide(dc: DataConnect, vars: UpdateGuideVariables): MutationPromise<UpdateGuideData, UpdateGuideVariables>;

interface DeleteGuideRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGuideVariables): MutationRef<DeleteGuideData, DeleteGuideVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGuideVariables): MutationRef<DeleteGuideData, DeleteGuideVariables>;
  operationName: string;
}
export const deleteGuideRef: DeleteGuideRef;

export function deleteGuide(vars: DeleteGuideVariables): MutationPromise<DeleteGuideData, DeleteGuideVariables>;
export function deleteGuide(dc: DataConnect, vars: DeleteGuideVariables): MutationPromise<DeleteGuideData, DeleteGuideVariables>;

interface CreateVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVehicleVariables): MutationRef<CreateVehicleData, CreateVehicleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVehicleVariables): MutationRef<CreateVehicleData, CreateVehicleVariables>;
  operationName: string;
}
export const createVehicleRef: CreateVehicleRef;

export function createVehicle(vars: CreateVehicleVariables): MutationPromise<CreateVehicleData, CreateVehicleVariables>;
export function createVehicle(dc: DataConnect, vars: CreateVehicleVariables): MutationPromise<CreateVehicleData, CreateVehicleVariables>;

interface UpdateVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
  operationName: string;
}
export const updateVehicleRef: UpdateVehicleRef;

export function updateVehicle(vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;
export function updateVehicle(dc: DataConnect, vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

interface DeleteVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVehicleVariables): MutationRef<DeleteVehicleData, DeleteVehicleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteVehicleVariables): MutationRef<DeleteVehicleData, DeleteVehicleVariables>;
  operationName: string;
}
export const deleteVehicleRef: DeleteVehicleRef;

export function deleteVehicle(vars: DeleteVehicleVariables): MutationPromise<DeleteVehicleData, DeleteVehicleVariables>;
export function deleteVehicle(dc: DataConnect, vars: DeleteVehicleVariables): MutationPromise<DeleteVehicleData, DeleteVehicleVariables>;

interface AddOfflineCheckinRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddOfflineCheckinVariables): MutationRef<AddOfflineCheckinData, AddOfflineCheckinVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddOfflineCheckinVariables): MutationRef<AddOfflineCheckinData, AddOfflineCheckinVariables>;
  operationName: string;
}
export const addOfflineCheckinRef: AddOfflineCheckinRef;

export function addOfflineCheckin(vars: AddOfflineCheckinVariables): MutationPromise<AddOfflineCheckinData, AddOfflineCheckinVariables>;
export function addOfflineCheckin(dc: DataConnect, vars: AddOfflineCheckinVariables): MutationPromise<AddOfflineCheckinData, AddOfflineCheckinVariables>;

interface DeletePwaCheckinRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePwaCheckinVariables): MutationRef<DeletePwaCheckinData, DeletePwaCheckinVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePwaCheckinVariables): MutationRef<DeletePwaCheckinData, DeletePwaCheckinVariables>;
  operationName: string;
}
export const deletePwaCheckinRef: DeletePwaCheckinRef;

export function deletePwaCheckin(vars: DeletePwaCheckinVariables): MutationPromise<DeletePwaCheckinData, DeletePwaCheckinVariables>;
export function deletePwaCheckin(dc: DataConnect, vars: DeletePwaCheckinVariables): MutationPromise<DeletePwaCheckinData, DeletePwaCheckinVariables>;

interface DeleteBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  operationName: string;
}
export const deleteBookingRef: DeleteBookingRef;

export function deleteBooking(vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;
export function deleteBooking(dc: DataConnect, vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface GetToursRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetToursData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetToursData, undefined>;
  operationName: string;
}
export const getToursRef: GetToursRef;

export function getTours(): QueryPromise<GetToursData, undefined>;
export function getTours(dc: DataConnect): QueryPromise<GetToursData, undefined>;

interface GetTourRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTourVariables): QueryRef<GetTourData, GetTourVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTourVariables): QueryRef<GetTourData, GetTourVariables>;
  operationName: string;
}
export const getTourRef: GetTourRef;

export function getTour(vars: GetTourVariables): QueryPromise<GetTourData, GetTourVariables>;
export function getTour(dc: DataConnect, vars: GetTourVariables): QueryPromise<GetTourData, GetTourVariables>;

interface GetBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBookingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetBookingsData, undefined>;
  operationName: string;
}
export const getBookingsRef: GetBookingsRef;

export function getBookings(): QueryPromise<GetBookingsData, undefined>;
export function getBookings(dc: DataConnect): QueryPromise<GetBookingsData, undefined>;

interface GetUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUsersData, undefined>;
  operationName: string;
}
export const getUsersRef: GetUsersRef;

export function getUsers(): QueryPromise<GetUsersData, undefined>;
export function getUsers(dc: DataConnect): QueryPromise<GetUsersData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

interface GetActiveSliderSlidesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetActiveSliderSlidesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetActiveSliderSlidesData, undefined>;
  operationName: string;
}
export const getActiveSliderSlidesRef: GetActiveSliderSlidesRef;

export function getActiveSliderSlides(): QueryPromise<GetActiveSliderSlidesData, undefined>;
export function getActiveSliderSlides(dc: DataConnect): QueryPromise<GetActiveSliderSlidesData, undefined>;

interface GetGuidesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetGuidesVariables): QueryRef<GetGuidesData, GetGuidesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetGuidesVariables): QueryRef<GetGuidesData, GetGuidesVariables>;
  operationName: string;
}
export const getGuidesRef: GetGuidesRef;

export function getGuides(vars?: GetGuidesVariables): QueryPromise<GetGuidesData, GetGuidesVariables>;
export function getGuides(dc: DataConnect, vars?: GetGuidesVariables): QueryPromise<GetGuidesData, GetGuidesVariables>;

interface GetVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetVehiclesVariables): QueryRef<GetVehiclesData, GetVehiclesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetVehiclesVariables): QueryRef<GetVehiclesData, GetVehiclesVariables>;
  operationName: string;
}
export const getVehiclesRef: GetVehiclesRef;

export function getVehicles(vars?: GetVehiclesVariables): QueryPromise<GetVehiclesData, GetVehiclesVariables>;
export function getVehicles(dc: DataConnect, vars?: GetVehiclesVariables): QueryPromise<GetVehiclesData, GetVehiclesVariables>;

interface GetOfflineQueueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetOfflineQueueVariables): QueryRef<GetOfflineQueueData, GetOfflineQueueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: GetOfflineQueueVariables): QueryRef<GetOfflineQueueData, GetOfflineQueueVariables>;
  operationName: string;
}
export const getOfflineQueueRef: GetOfflineQueueRef;

export function getOfflineQueue(vars?: GetOfflineQueueVariables): QueryPromise<GetOfflineQueueData, GetOfflineQueueVariables>;
export function getOfflineQueue(dc: DataConnect, vars?: GetOfflineQueueVariables): QueryPromise<GetOfflineQueueData, GetOfflineQueueVariables>;

