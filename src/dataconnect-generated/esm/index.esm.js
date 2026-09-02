import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
}

export const Category = {
  OUTDOOR: "OUTDOOR",
  RELAXACION: "RELAXACION",
  FERIADO: "FERIADO",
  TEMPORADA: "TEMPORADA",
  SALVAJE: "SALVAJE",
  AVENTURA: "AVENTURA",
  TEMATICO: "TEMATICO",
  CULTURAL: "CULTURAL",
  CIUDAD: "CIUDAD",
  MONTANA: "MONTANA",
  GLACIAR: "GLACIAR",
  LUJO: "LUJO",
  HISTORICO: "HISTORICO",
  FAMILIAR: "FAMILIAR",
  SELVA: "SELVA",
  FULLDAY: "FULLDAY",
  NAVEGACION: "NAVEGACION",
}

export const CheckinStatus = {
  PENDING: "PENDING",
  SYNCED: "SYNCED",
  PENDIENTE_SYNC: "PENDIENTE_SYNC",
}

export const Destination = {
  ARGENTINA: "ARGENTINA",
  PERU: "PERU",
  BOLIVIA: "BOLIVIA",
  BRAZIL: "BRAZIL",
  COLOMBIA: "COLOMBIA",
  ECUADOR: "ECUADOR",
  CHILE: "CHILE",
  MEXICO: "MEXICO",
  DOMINICAN_REPUBLIC: "DOMINICAN_REPUBLIC",
  GUATEMALA: "GUATEMALA",
  COSTA_RICA: "COSTA_RICA",
  PANAMA: "PANAMA",
  CUBA: "CUBA",
  BELICE: "BELICE",
  EL_SALVADOR: "EL_SALVADOR",
  HONDURAS: "HONDURAS",
  NICARAGUA: "NICARAGUA",
  HAITI: "HAITI",
  URUGUAY: "URUGUAY",
  PARAGUAY: "PARAGUAY",
  VENEZUELA: "VENEZUELA",
  BAHAMAS: "BAHAMAS",
  BARBADOS: "BARBADOS",
  ANTIGUA: "ANTIGUA",
  GRENADA: "GRENADA",
  JAMAICA: "JAMAICA",
  DOMINICA: "DOMINICA",
  SAINT_KITTS: "SAINT_KITTS",
  SAINT_VINCENT: "SAINT_VINCENT",
  SAINT_LUCIA: "SAINT_LUCIA",
  TRINIDAD: "TRINIDAD",
}

export const DestinationRegion = {
  LATINOAMERICA: "LATINOAMERICA",
  CENTRALAMERICA: "CENTRALAMERICA",
  CARIBBEAN: "CARIBBEAN",
}

export const Difficulty = {
  EASY: "EASY",
  MODERATE: "MODERATE",
  DIFFICULT: "DIFFICULT",
  EXTREME: "EXTREME",
}

export const GroupType = {
  PRIVATE: "PRIVATE",
  SHARED: "SHARED",
  BOTH: "BOTH",
}

export const GuideStatus = {
  DISPONIBLE: "DISPONIBLE",
  EN_TOUR: "EN_TOUR",
  OFFLINE: "OFFLINE",
}

export const HomepageSection = {
  NONE: "NONE",
  FLASH_DEAL: "FLASH_DEAL",
  POPULAR: "POPULAR",
  VACATION: "VACATION",
  ONE_DAY: "ONE_DAY",
}

export const Role = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  OPERATOR: "OPERATOR",
  TOUR_ADMIN: "TOUR_ADMIN",
  CUSTOMER: "CUSTOMER",
}

export const TourStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
}

export const VehicleStatus = {
  DISPONIBLE: "DISPONIBLE",
  EN_USO: "EN_USO",
  OFFLINE: "OFFLINE",
}

export const connectorConfig = {
  connector: 'example',
  service: 'buscatours-e0816-service',
  location: 'us-central1'
};

export const createTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTour', inputVars);
}
createTourRef.operationName = 'CreateTour';

export function createTour(dcOrVars, vars) {
  return executeMutation(createTourRef(dcOrVars, vars));
}

export const updateTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTour', inputVars);
}
updateTourRef.operationName = 'UpdateTour';

export function updateTour(dcOrVars, vars) {
  return executeMutation(updateTourRef(dcOrVars, vars));
}

export const deleteTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTour', inputVars);
}
deleteTourRef.operationName = 'DeleteTour';

export function deleteTour(dcOrVars, vars) {
  return executeMutation(deleteTourRef(dcOrVars, vars));
}

export const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';

export function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
}

export const updateBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBooking', inputVars);
}
updateBookingRef.operationName = 'UpdateBooking';

export function updateBooking(dcOrVars, vars) {
  return executeMutation(updateBookingRef(dcOrVars, vars));
}

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const createSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSliderSlide', inputVars);
}
createSliderSlideRef.operationName = 'CreateSliderSlide';

export function createSliderSlide(dcOrVars, vars) {
  return executeMutation(createSliderSlideRef(dcOrVars, vars));
}

export const updateSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSliderSlide', inputVars);
}
updateSliderSlideRef.operationName = 'UpdateSliderSlide';

export function updateSliderSlide(dcOrVars, vars) {
  return executeMutation(updateSliderSlideRef(dcOrVars, vars));
}

export const deleteSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSliderSlide', inputVars);
}
deleteSliderSlideRef.operationName = 'DeleteSliderSlide';

export function deleteSliderSlide(dcOrVars, vars) {
  return executeMutation(deleteSliderSlideRef(dcOrVars, vars));
}

export const createGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGuide', inputVars);
}
createGuideRef.operationName = 'CreateGuide';

export function createGuide(dcOrVars, vars) {
  return executeMutation(createGuideRef(dcOrVars, vars));
}

export const updateGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGuide', inputVars);
}
updateGuideRef.operationName = 'UpdateGuide';

export function updateGuide(dcOrVars, vars) {
  return executeMutation(updateGuideRef(dcOrVars, vars));
}

export const deleteGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGuide', inputVars);
}
deleteGuideRef.operationName = 'DeleteGuide';

export function deleteGuide(dcOrVars, vars) {
  return executeMutation(deleteGuideRef(dcOrVars, vars));
}

export const createVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVehicle', inputVars);
}
createVehicleRef.operationName = 'CreateVehicle';

export function createVehicle(dcOrVars, vars) {
  return executeMutation(createVehicleRef(dcOrVars, vars));
}

export const updateVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicle', inputVars);
}
updateVehicleRef.operationName = 'UpdateVehicle';

export function updateVehicle(dcOrVars, vars) {
  return executeMutation(updateVehicleRef(dcOrVars, vars));
}

export const deleteVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteVehicle', inputVars);
}
deleteVehicleRef.operationName = 'DeleteVehicle';

export function deleteVehicle(dcOrVars, vars) {
  return executeMutation(deleteVehicleRef(dcOrVars, vars));
}

export const addOfflineCheckinRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddOfflineCheckin', inputVars);
}
addOfflineCheckinRef.operationName = 'AddOfflineCheckin';

export function addOfflineCheckin(dcOrVars, vars) {
  return executeMutation(addOfflineCheckinRef(dcOrVars, vars));
}

export const deletePwaCheckinRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePwaCheckin', inputVars);
}
deletePwaCheckinRef.operationName = 'DeletePwaCheckin';

export function deletePwaCheckin(dcOrVars, vars) {
  return executeMutation(deletePwaCheckinRef(dcOrVars, vars));
}

export const deleteBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBooking', inputVars);
}
deleteBookingRef.operationName = 'DeleteBooking';

export function deleteBooking(dcOrVars, vars) {
  return executeMutation(deleteBookingRef(dcOrVars, vars));
}

export const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';

export function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
}

export const getToursRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTours');
}
getToursRef.operationName = 'GetTours';

export function getTours(dc) {
  return executeQuery(getToursRef(dc));
}

export const getTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTour', inputVars);
}
getTourRef.operationName = 'GetTour';

export function getTour(dcOrVars, vars) {
  return executeQuery(getTourRef(dcOrVars, vars));
}

export const getBookingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookings');
}
getBookingsRef.operationName = 'GetBookings';

export function getBookings(dc) {
  return executeQuery(getBookingsRef(dc));
}

export const getUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers');
}
getUsersRef.operationName = 'GetUsers';

export function getUsers(dc) {
  return executeQuery(getUsersRef(dc));
}

export const getCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
getCurrentUserRef.operationName = 'GetCurrentUser';

export function getCurrentUser(dc) {
  return executeQuery(getCurrentUserRef(dc));
}

export const getActiveSliderSlidesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveSliderSlides');
}
getActiveSliderSlidesRef.operationName = 'GetActiveSliderSlides';

export function getActiveSliderSlides(dc) {
  return executeQuery(getActiveSliderSlidesRef(dc));
}

export const getGuidesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGuides', inputVars);
}
getGuidesRef.operationName = 'GetGuides';

export function getGuides(dcOrVars, vars) {
  return executeQuery(getGuidesRef(dcOrVars, vars));
}

export const getVehiclesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicles', inputVars);
}
getVehiclesRef.operationName = 'GetVehicles';

export function getVehicles(dcOrVars, vars) {
  return executeQuery(getVehiclesRef(dcOrVars, vars));
}

export const getOfflineQueueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOfflineQueue', inputVars);
}
getOfflineQueueRef.operationName = 'GetOfflineQueue';

export function getOfflineQueue(dcOrVars, vars) {
  return executeQuery(getOfflineQueueRef(dcOrVars, vars));
}

