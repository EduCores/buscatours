const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
}
exports.BookingStatus = BookingStatus;

const Category = {
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
exports.Category = Category;

const CheckinStatus = {
  PENDING: "PENDING",
  SYNCED: "SYNCED",
  PENDIENTE_SYNC: "PENDIENTE_SYNC",
}
exports.CheckinStatus = CheckinStatus;

const Destination = {
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
exports.Destination = Destination;

const DestinationRegion = {
  LATINOAMERICA: "LATINOAMERICA",
  CENTRALAMERICA: "CENTRALAMERICA",
  CARIBBEAN: "CARIBBEAN",
}
exports.DestinationRegion = DestinationRegion;

const Difficulty = {
  EASY: "EASY",
  MODERATE: "MODERATE",
  DIFFICULT: "DIFFICULT",
  EXTREME: "EXTREME",
}
exports.Difficulty = Difficulty;

const GroupType = {
  PRIVATE: "PRIVATE",
  SHARED: "SHARED",
  BOTH: "BOTH",
}
exports.GroupType = GroupType;

const GuideStatus = {
  DISPONIBLE: "DISPONIBLE",
  EN_TOUR: "EN_TOUR",
  OFFLINE: "OFFLINE",
}
exports.GuideStatus = GuideStatus;

const HomepageSection = {
  NONE: "NONE",
  FLASH_DEAL: "FLASH_DEAL",
  POPULAR: "POPULAR",
  VACATION: "VACATION",
  ONE_DAY: "ONE_DAY",
}
exports.HomepageSection = HomepageSection;

const Role = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  OPERATOR: "OPERATOR",
  TOUR_ADMIN: "TOUR_ADMIN",
  CUSTOMER: "CUSTOMER",
}
exports.Role = Role;

const TourStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
}
exports.TourStatus = TourStatus;

const VehicleStatus = {
  DISPONIBLE: "DISPONIBLE",
  EN_USO: "EN_USO",
  OFFLINE: "OFFLINE",
}
exports.VehicleStatus = VehicleStatus;

const connectorConfig = {
  connector: 'example',
  service: 'buscatours-e0816-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTour', inputVars);
}
createTourRef.operationName = 'CreateTour';
exports.createTourRef = createTourRef;

exports.createTour = function createTour(dcOrVars, vars) {
  return executeMutation(createTourRef(dcOrVars, vars));
};

const updateTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTour', inputVars);
}
updateTourRef.operationName = 'UpdateTour';
exports.updateTourRef = updateTourRef;

exports.updateTour = function updateTour(dcOrVars, vars) {
  return executeMutation(updateTourRef(dcOrVars, vars));
};

const deleteTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTour', inputVars);
}
deleteTourRef.operationName = 'DeleteTour';
exports.deleteTourRef = deleteTourRef;

exports.deleteTour = function deleteTour(dcOrVars, vars) {
  return executeMutation(deleteTourRef(dcOrVars, vars));
};

const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';
exports.createBookingRef = createBookingRef;

exports.createBooking = function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
};

const updateBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBooking', inputVars);
}
updateBookingRef.operationName = 'UpdateBooking';
exports.updateBookingRef = updateBookingRef;

exports.updateBooking = function updateBooking(dcOrVars, vars) {
  return executeMutation(updateBookingRef(dcOrVars, vars));
};

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const createSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSliderSlide', inputVars);
}
createSliderSlideRef.operationName = 'CreateSliderSlide';
exports.createSliderSlideRef = createSliderSlideRef;

exports.createSliderSlide = function createSliderSlide(dcOrVars, vars) {
  return executeMutation(createSliderSlideRef(dcOrVars, vars));
};

const updateSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSliderSlide', inputVars);
}
updateSliderSlideRef.operationName = 'UpdateSliderSlide';
exports.updateSliderSlideRef = updateSliderSlideRef;

exports.updateSliderSlide = function updateSliderSlide(dcOrVars, vars) {
  return executeMutation(updateSliderSlideRef(dcOrVars, vars));
};

const deleteSliderSlideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSliderSlide', inputVars);
}
deleteSliderSlideRef.operationName = 'DeleteSliderSlide';
exports.deleteSliderSlideRef = deleteSliderSlideRef;

exports.deleteSliderSlide = function deleteSliderSlide(dcOrVars, vars) {
  return executeMutation(deleteSliderSlideRef(dcOrVars, vars));
};

const createGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGuide', inputVars);
}
createGuideRef.operationName = 'CreateGuide';
exports.createGuideRef = createGuideRef;

exports.createGuide = function createGuide(dcOrVars, vars) {
  return executeMutation(createGuideRef(dcOrVars, vars));
};

const updateGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGuide', inputVars);
}
updateGuideRef.operationName = 'UpdateGuide';
exports.updateGuideRef = updateGuideRef;

exports.updateGuide = function updateGuide(dcOrVars, vars) {
  return executeMutation(updateGuideRef(dcOrVars, vars));
};

const deleteGuideRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGuide', inputVars);
}
deleteGuideRef.operationName = 'DeleteGuide';
exports.deleteGuideRef = deleteGuideRef;

exports.deleteGuide = function deleteGuide(dcOrVars, vars) {
  return executeMutation(deleteGuideRef(dcOrVars, vars));
};

const createVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVehicle', inputVars);
}
createVehicleRef.operationName = 'CreateVehicle';
exports.createVehicleRef = createVehicleRef;

exports.createVehicle = function createVehicle(dcOrVars, vars) {
  return executeMutation(createVehicleRef(dcOrVars, vars));
};

const updateVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicle', inputVars);
}
updateVehicleRef.operationName = 'UpdateVehicle';
exports.updateVehicleRef = updateVehicleRef;

exports.updateVehicle = function updateVehicle(dcOrVars, vars) {
  return executeMutation(updateVehicleRef(dcOrVars, vars));
};

const deleteVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteVehicle', inputVars);
}
deleteVehicleRef.operationName = 'DeleteVehicle';
exports.deleteVehicleRef = deleteVehicleRef;

exports.deleteVehicle = function deleteVehicle(dcOrVars, vars) {
  return executeMutation(deleteVehicleRef(dcOrVars, vars));
};

const addOfflineCheckinRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddOfflineCheckin', inputVars);
}
addOfflineCheckinRef.operationName = 'AddOfflineCheckin';
exports.addOfflineCheckinRef = addOfflineCheckinRef;

exports.addOfflineCheckin = function addOfflineCheckin(dcOrVars, vars) {
  return executeMutation(addOfflineCheckinRef(dcOrVars, vars));
};

const deletePwaCheckinRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePwaCheckin', inputVars);
}
deletePwaCheckinRef.operationName = 'DeletePwaCheckin';
exports.deletePwaCheckinRef = deletePwaCheckinRef;

exports.deletePwaCheckin = function deletePwaCheckin(dcOrVars, vars) {
  return executeMutation(deletePwaCheckinRef(dcOrVars, vars));
};

const deleteBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBooking', inputVars);
}
deleteBookingRef.operationName = 'DeleteBooking';
exports.deleteBookingRef = deleteBookingRef;

exports.deleteBooking = function deleteBooking(dcOrVars, vars) {
  return executeMutation(deleteBookingRef(dcOrVars, vars));
};

const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';
exports.deleteUserRef = deleteUserRef;

exports.deleteUser = function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
};

const getToursRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTours');
}
getToursRef.operationName = 'GetTours';
exports.getToursRef = getToursRef;

exports.getTours = function getTours(dc) {
  return executeQuery(getToursRef(dc));
};

const getTourRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTour', inputVars);
}
getTourRef.operationName = 'GetTour';
exports.getTourRef = getTourRef;

exports.getTour = function getTour(dcOrVars, vars) {
  return executeQuery(getTourRef(dcOrVars, vars));
};

const getBookingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookings');
}
getBookingsRef.operationName = 'GetBookings';
exports.getBookingsRef = getBookingsRef;

exports.getBookings = function getBookings(dc) {
  return executeQuery(getBookingsRef(dc));
};

const getUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers');
}
getUsersRef.operationName = 'GetUsers';
exports.getUsersRef = getUsersRef;

exports.getUsers = function getUsers(dc) {
  return executeQuery(getUsersRef(dc));
};

const getCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
getCurrentUserRef.operationName = 'GetCurrentUser';
exports.getCurrentUserRef = getCurrentUserRef;

exports.getCurrentUser = function getCurrentUser(dc) {
  return executeQuery(getCurrentUserRef(dc));
};

const getActiveSliderSlidesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveSliderSlides');
}
getActiveSliderSlidesRef.operationName = 'GetActiveSliderSlides';
exports.getActiveSliderSlidesRef = getActiveSliderSlidesRef;

exports.getActiveSliderSlides = function getActiveSliderSlides(dc) {
  return executeQuery(getActiveSliderSlidesRef(dc));
};

const getGuidesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGuides', inputVars);
}
getGuidesRef.operationName = 'GetGuides';
exports.getGuidesRef = getGuidesRef;

exports.getGuides = function getGuides(dcOrVars, vars) {
  return executeQuery(getGuidesRef(dcOrVars, vars));
};

const getVehiclesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicles', inputVars);
}
getVehiclesRef.operationName = 'GetVehicles';
exports.getVehiclesRef = getVehiclesRef;

exports.getVehicles = function getVehicles(dcOrVars, vars) {
  return executeQuery(getVehiclesRef(dcOrVars, vars));
};

const getOfflineQueueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOfflineQueue', inputVars);
}
getOfflineQueueRef.operationName = 'GetOfflineQueue';
exports.getOfflineQueueRef = getOfflineQueueRef;

exports.getOfflineQueue = function getOfflineQueue(dcOrVars, vars) {
  return executeQuery(getOfflineQueueRef(dcOrVars, vars));
};
