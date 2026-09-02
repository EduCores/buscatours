import { CreateTourData, CreateTourVariables, UpdateTourData, UpdateTourVariables, DeleteTourData, DeleteTourVariables, CreateBookingData, CreateBookingVariables, UpdateBookingData, UpdateBookingVariables, CreateUserData, CreateUserVariables, CreateSliderSlideData, CreateSliderSlideVariables, UpdateSliderSlideData, UpdateSliderSlideVariables, DeleteSliderSlideData, DeleteSliderSlideVariables, CreateGuideData, CreateGuideVariables, UpdateGuideData, UpdateGuideVariables, DeleteGuideData, DeleteGuideVariables, CreateVehicleData, CreateVehicleVariables, UpdateVehicleData, UpdateVehicleVariables, DeleteVehicleData, DeleteVehicleVariables, AddOfflineCheckinData, AddOfflineCheckinVariables, DeletePwaCheckinData, DeletePwaCheckinVariables, DeleteBookingData, DeleteBookingVariables, DeleteUserData, DeleteUserVariables, GetToursData, GetTourData, GetTourVariables, GetBookingsData, GetUsersData, GetCurrentUserData, GetActiveSliderSlidesData, GetGuidesData, GetGuidesVariables, GetVehiclesData, GetVehiclesVariables, GetOfflineQueueData, GetOfflineQueueVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTour(options?: useDataConnectMutationOptions<CreateTourData, FirebaseError, CreateTourVariables>): UseDataConnectMutationResult<CreateTourData, CreateTourVariables>;
export function useCreateTour(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTourData, FirebaseError, CreateTourVariables>): UseDataConnectMutationResult<CreateTourData, CreateTourVariables>;

export function useUpdateTour(options?: useDataConnectMutationOptions<UpdateTourData, FirebaseError, UpdateTourVariables>): UseDataConnectMutationResult<UpdateTourData, UpdateTourVariables>;
export function useUpdateTour(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTourData, FirebaseError, UpdateTourVariables>): UseDataConnectMutationResult<UpdateTourData, UpdateTourVariables>;

export function useDeleteTour(options?: useDataConnectMutationOptions<DeleteTourData, FirebaseError, DeleteTourVariables>): UseDataConnectMutationResult<DeleteTourData, DeleteTourVariables>;
export function useDeleteTour(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTourData, FirebaseError, DeleteTourVariables>): UseDataConnectMutationResult<DeleteTourData, DeleteTourVariables>;

export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useUpdateBooking(options?: useDataConnectMutationOptions<UpdateBookingData, FirebaseError, UpdateBookingVariables>): UseDataConnectMutationResult<UpdateBookingData, UpdateBookingVariables>;
export function useUpdateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBookingData, FirebaseError, UpdateBookingVariables>): UseDataConnectMutationResult<UpdateBookingData, UpdateBookingVariables>;

export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useCreateSliderSlide(options?: useDataConnectMutationOptions<CreateSliderSlideData, FirebaseError, CreateSliderSlideVariables>): UseDataConnectMutationResult<CreateSliderSlideData, CreateSliderSlideVariables>;
export function useCreateSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSliderSlideData, FirebaseError, CreateSliderSlideVariables>): UseDataConnectMutationResult<CreateSliderSlideData, CreateSliderSlideVariables>;

export function useUpdateSliderSlide(options?: useDataConnectMutationOptions<UpdateSliderSlideData, FirebaseError, UpdateSliderSlideVariables>): UseDataConnectMutationResult<UpdateSliderSlideData, UpdateSliderSlideVariables>;
export function useUpdateSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSliderSlideData, FirebaseError, UpdateSliderSlideVariables>): UseDataConnectMutationResult<UpdateSliderSlideData, UpdateSliderSlideVariables>;

export function useDeleteSliderSlide(options?: useDataConnectMutationOptions<DeleteSliderSlideData, FirebaseError, DeleteSliderSlideVariables>): UseDataConnectMutationResult<DeleteSliderSlideData, DeleteSliderSlideVariables>;
export function useDeleteSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSliderSlideData, FirebaseError, DeleteSliderSlideVariables>): UseDataConnectMutationResult<DeleteSliderSlideData, DeleteSliderSlideVariables>;

export function useCreateGuide(options?: useDataConnectMutationOptions<CreateGuideData, FirebaseError, CreateGuideVariables>): UseDataConnectMutationResult<CreateGuideData, CreateGuideVariables>;
export function useCreateGuide(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuideData, FirebaseError, CreateGuideVariables>): UseDataConnectMutationResult<CreateGuideData, CreateGuideVariables>;

export function useUpdateGuide(options?: useDataConnectMutationOptions<UpdateGuideData, FirebaseError, UpdateGuideVariables>): UseDataConnectMutationResult<UpdateGuideData, UpdateGuideVariables>;
export function useUpdateGuide(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuideData, FirebaseError, UpdateGuideVariables>): UseDataConnectMutationResult<UpdateGuideData, UpdateGuideVariables>;

export function useDeleteGuide(options?: useDataConnectMutationOptions<DeleteGuideData, FirebaseError, DeleteGuideVariables>): UseDataConnectMutationResult<DeleteGuideData, DeleteGuideVariables>;
export function useDeleteGuide(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteGuideData, FirebaseError, DeleteGuideVariables>): UseDataConnectMutationResult<DeleteGuideData, DeleteGuideVariables>;

export function useCreateVehicle(options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, CreateVehicleVariables>): UseDataConnectMutationResult<CreateVehicleData, CreateVehicleVariables>;
export function useCreateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, CreateVehicleVariables>): UseDataConnectMutationResult<CreateVehicleData, CreateVehicleVariables>;

export function useUpdateVehicle(options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;
export function useUpdateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;

export function useDeleteVehicle(options?: useDataConnectMutationOptions<DeleteVehicleData, FirebaseError, DeleteVehicleVariables>): UseDataConnectMutationResult<DeleteVehicleData, DeleteVehicleVariables>;
export function useDeleteVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteVehicleData, FirebaseError, DeleteVehicleVariables>): UseDataConnectMutationResult<DeleteVehicleData, DeleteVehicleVariables>;

export function useAddOfflineCheckin(options?: useDataConnectMutationOptions<AddOfflineCheckinData, FirebaseError, AddOfflineCheckinVariables>): UseDataConnectMutationResult<AddOfflineCheckinData, AddOfflineCheckinVariables>;
export function useAddOfflineCheckin(dc: DataConnect, options?: useDataConnectMutationOptions<AddOfflineCheckinData, FirebaseError, AddOfflineCheckinVariables>): UseDataConnectMutationResult<AddOfflineCheckinData, AddOfflineCheckinVariables>;

export function useDeletePwaCheckin(options?: useDataConnectMutationOptions<DeletePwaCheckinData, FirebaseError, DeletePwaCheckinVariables>): UseDataConnectMutationResult<DeletePwaCheckinData, DeletePwaCheckinVariables>;
export function useDeletePwaCheckin(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePwaCheckinData, FirebaseError, DeletePwaCheckinVariables>): UseDataConnectMutationResult<DeletePwaCheckinData, DeletePwaCheckinVariables>;

export function useDeleteBooking(options?: useDataConnectMutationOptions<DeleteBookingData, FirebaseError, DeleteBookingVariables>): UseDataConnectMutationResult<DeleteBookingData, DeleteBookingVariables>;
export function useDeleteBooking(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteBookingData, FirebaseError, DeleteBookingVariables>): UseDataConnectMutationResult<DeleteBookingData, DeleteBookingVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;

export function useGetTours(options?: useDataConnectQueryOptions<GetToursData>): UseDataConnectQueryResult<GetToursData, undefined>;
export function useGetTours(dc: DataConnect, options?: useDataConnectQueryOptions<GetToursData>): UseDataConnectQueryResult<GetToursData, undefined>;

export function useGetTour(vars: GetTourVariables, options?: useDataConnectQueryOptions<GetTourData>): UseDataConnectQueryResult<GetTourData, GetTourVariables>;
export function useGetTour(dc: DataConnect, vars: GetTourVariables, options?: useDataConnectQueryOptions<GetTourData>): UseDataConnectQueryResult<GetTourData, GetTourVariables>;

export function useGetBookings(options?: useDataConnectQueryOptions<GetBookingsData>): UseDataConnectQueryResult<GetBookingsData, undefined>;
export function useGetBookings(dc: DataConnect, options?: useDataConnectQueryOptions<GetBookingsData>): UseDataConnectQueryResult<GetBookingsData, undefined>;

export function useGetUsers(options?: useDataConnectQueryOptions<GetUsersData>): UseDataConnectQueryResult<GetUsersData, undefined>;
export function useGetUsers(dc: DataConnect, options?: useDataConnectQueryOptions<GetUsersData>): UseDataConnectQueryResult<GetUsersData, undefined>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useGetActiveSliderSlides(options?: useDataConnectQueryOptions<GetActiveSliderSlidesData>): UseDataConnectQueryResult<GetActiveSliderSlidesData, undefined>;
export function useGetActiveSliderSlides(dc: DataConnect, options?: useDataConnectQueryOptions<GetActiveSliderSlidesData>): UseDataConnectQueryResult<GetActiveSliderSlidesData, undefined>;

export function useGetGuides(vars?: GetGuidesVariables, options?: useDataConnectQueryOptions<GetGuidesData>): UseDataConnectQueryResult<GetGuidesData, GetGuidesVariables>;
export function useGetGuides(dc: DataConnect, vars?: GetGuidesVariables, options?: useDataConnectQueryOptions<GetGuidesData>): UseDataConnectQueryResult<GetGuidesData, GetGuidesVariables>;

export function useGetVehicles(vars?: GetVehiclesVariables, options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, GetVehiclesVariables>;
export function useGetVehicles(dc: DataConnect, vars?: GetVehiclesVariables, options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, GetVehiclesVariables>;

export function useGetOfflineQueue(vars?: GetOfflineQueueVariables, options?: useDataConnectQueryOptions<GetOfflineQueueData>): UseDataConnectQueryResult<GetOfflineQueueData, GetOfflineQueueVariables>;
export function useGetOfflineQueue(dc: DataConnect, vars?: GetOfflineQueueVariables, options?: useDataConnectQueryOptions<GetOfflineQueueData>): UseDataConnectQueryResult<GetOfflineQueueData, GetOfflineQueueVariables>;
