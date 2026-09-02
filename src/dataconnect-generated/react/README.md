# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetTours*](#gettours)
  - [*GetTour*](#gettour)
  - [*GetBookings*](#getbookings)
  - [*GetUsers*](#getusers)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*GetActiveSliderSlides*](#getactivesliderslides)
  - [*GetGuides*](#getguides)
  - [*GetVehicles*](#getvehicles)
  - [*GetOfflineQueue*](#getofflinequeue)
- [**Mutations**](#mutations)
  - [*CreateTour*](#createtour)
  - [*UpdateTour*](#updatetour)
  - [*DeleteTour*](#deletetour)
  - [*CreateBooking*](#createbooking)
  - [*UpdateBooking*](#updatebooking)
  - [*CreateUser*](#createuser)
  - [*CreateSliderSlide*](#createsliderslide)
  - [*UpdateSliderSlide*](#updatesliderslide)
  - [*DeleteSliderSlide*](#deletesliderslide)
  - [*CreateGuide*](#createguide)
  - [*UpdateGuide*](#updateguide)
  - [*DeleteGuide*](#deleteguide)
  - [*CreateVehicle*](#createvehicle)
  - [*UpdateVehicle*](#updatevehicle)
  - [*DeleteVehicle*](#deletevehicle)
  - [*AddOfflineCheckin*](#addofflinecheckin)
  - [*DeletePwaCheckin*](#deletepwacheckin)
  - [*DeleteBooking*](#deletebooking)
  - [*DeleteUser*](#deleteuser)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetTours
You can execute the `GetTours` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetTours(dc: DataConnect, options?: useDataConnectQueryOptions<GetToursData>): UseDataConnectQueryResult<GetToursData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetTours(options?: useDataConnectQueryOptions<GetToursData>): UseDataConnectQueryResult<GetToursData, undefined>;
```

### Variables
The `GetTours` Query has no variables.
### Return Type
Recall that calling the `GetTours` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetTours` Query is of type `GetToursData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetTours`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetTours } from '@dataconnect/generated/react'

export default function GetToursComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetTours();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetTours(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetTours(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetTours(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.tours);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetTour
You can execute the `GetTour` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetTour(dc: DataConnect, vars: GetTourVariables, options?: useDataConnectQueryOptions<GetTourData>): UseDataConnectQueryResult<GetTourData, GetTourVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetTour(vars: GetTourVariables, options?: useDataConnectQueryOptions<GetTourData>): UseDataConnectQueryResult<GetTourData, GetTourVariables>;
```

### Variables
The `GetTour` Query requires an argument of type `GetTourVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetTourVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetTour` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetTour` Query is of type `GetTourData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetTour`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetTourVariables } from '@dataconnect/generated';
import { useGetTour } from '@dataconnect/generated/react'

export default function GetTourComponent() {
  // The `useGetTour` Query hook requires an argument of type `GetTourVariables`:
  const getTourVars: GetTourVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetTour(getTourVars);
  // Variables can be defined inline as well.
  const query = useGetTour({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetTour(dataConnect, getTourVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetTour(getTourVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetTour(dataConnect, getTourVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.tour);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetBookings
You can execute the `GetBookings` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetBookings(dc: DataConnect, options?: useDataConnectQueryOptions<GetBookingsData>): UseDataConnectQueryResult<GetBookingsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetBookings(options?: useDataConnectQueryOptions<GetBookingsData>): UseDataConnectQueryResult<GetBookingsData, undefined>;
```

### Variables
The `GetBookings` Query has no variables.
### Return Type
Recall that calling the `GetBookings` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetBookings` Query is of type `GetBookingsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetBookings`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetBookings } from '@dataconnect/generated/react'

export default function GetBookingsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetBookings();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetBookings(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetBookings(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetBookings(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.bookings);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUsers
You can execute the `GetUsers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUsers(dc: DataConnect, options?: useDataConnectQueryOptions<GetUsersData>): UseDataConnectQueryResult<GetUsersData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUsers(options?: useDataConnectQueryOptions<GetUsersData>): UseDataConnectQueryResult<GetUsersData, undefined>;
```

### Variables
The `GetUsers` Query has no variables.
### Return Type
Recall that calling the `GetUsers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUsers` Query is of type `GetUsersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUsers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetUsers } from '@dataconnect/generated/react'

export default function GetUsersComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUsers();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUsers(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsers(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsers(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCurrentUser
You can execute the `GetCurrentUser` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
```

### Variables
The `GetCurrentUser` Query has no variables.
### Return Type
Recall that calling the `GetCurrentUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCurrentUser` Query is of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCurrentUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetCurrentUser } from '@dataconnect/generated/react'

export default function GetCurrentUserComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCurrentUser();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCurrentUser(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCurrentUser(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetActiveSliderSlides
You can execute the `GetActiveSliderSlides` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetActiveSliderSlides(dc: DataConnect, options?: useDataConnectQueryOptions<GetActiveSliderSlidesData>): UseDataConnectQueryResult<GetActiveSliderSlidesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetActiveSliderSlides(options?: useDataConnectQueryOptions<GetActiveSliderSlidesData>): UseDataConnectQueryResult<GetActiveSliderSlidesData, undefined>;
```

### Variables
The `GetActiveSliderSlides` Query has no variables.
### Return Type
Recall that calling the `GetActiveSliderSlides` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetActiveSliderSlides` Query is of type `GetActiveSliderSlidesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetActiveSliderSlides`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetActiveSliderSlides } from '@dataconnect/generated/react'

export default function GetActiveSliderSlidesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetActiveSliderSlides();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetActiveSliderSlides(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetActiveSliderSlides(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetActiveSliderSlides(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.sliderSlides);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetGuides
You can execute the `GetGuides` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetGuides(dc: DataConnect, vars?: GetGuidesVariables, options?: useDataConnectQueryOptions<GetGuidesData>): UseDataConnectQueryResult<GetGuidesData, GetGuidesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetGuides(vars?: GetGuidesVariables, options?: useDataConnectQueryOptions<GetGuidesData>): UseDataConnectQueryResult<GetGuidesData, GetGuidesVariables>;
```

### Variables
The `GetGuides` Query has an optional argument of type `GetGuidesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetGuidesVariables {
  operatorId?: string | null;
  status?: GuideStatus | null;
}
```
### Return Type
Recall that calling the `GetGuides` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetGuides` Query is of type `GetGuidesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetGuides`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetGuidesVariables } from '@dataconnect/generated';
import { useGetGuides } from '@dataconnect/generated/react'

export default function GetGuidesComponent() {
  // The `useGetGuides` Query hook has an optional argument of type `GetGuidesVariables`:
  const getGuidesVars: GetGuidesVariables = {
    operatorId: ..., // optional
    status: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetGuides(getGuidesVars);
  // Variables can be defined inline as well.
  const query = useGetGuides({ operatorId: ..., status: ..., });
  // Since all variables are optional for this Query, you can omit the `GetGuidesVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useGetGuides();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetGuides(dataConnect, getGuidesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuides(getGuidesVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useGetGuides(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuides(dataConnect, getGuidesVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guides);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetVehicles
You can execute the `GetVehicles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetVehicles(dc: DataConnect, vars?: GetVehiclesVariables, options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, GetVehiclesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetVehicles(vars?: GetVehiclesVariables, options?: useDataConnectQueryOptions<GetVehiclesData>): UseDataConnectQueryResult<GetVehiclesData, GetVehiclesVariables>;
```

### Variables
The `GetVehicles` Query has an optional argument of type `GetVehiclesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetVehiclesVariables {
  operatorId?: string | null;
  status?: VehicleStatus | null;
}
```
### Return Type
Recall that calling the `GetVehicles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetVehicles` Query is of type `GetVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetVehicles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetVehiclesVariables } from '@dataconnect/generated';
import { useGetVehicles } from '@dataconnect/generated/react'

export default function GetVehiclesComponent() {
  // The `useGetVehicles` Query hook has an optional argument of type `GetVehiclesVariables`:
  const getVehiclesVars: GetVehiclesVariables = {
    operatorId: ..., // optional
    status: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetVehicles(getVehiclesVars);
  // Variables can be defined inline as well.
  const query = useGetVehicles({ operatorId: ..., status: ..., });
  // Since all variables are optional for this Query, you can omit the `GetVehiclesVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useGetVehicles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetVehicles(dataConnect, getVehiclesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehicles(getVehiclesVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useGetVehicles(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehicles(dataConnect, getVehiclesVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.vehicles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetOfflineQueue
You can execute the `GetOfflineQueue` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetOfflineQueue(dc: DataConnect, vars?: GetOfflineQueueVariables, options?: useDataConnectQueryOptions<GetOfflineQueueData>): UseDataConnectQueryResult<GetOfflineQueueData, GetOfflineQueueVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetOfflineQueue(vars?: GetOfflineQueueVariables, options?: useDataConnectQueryOptions<GetOfflineQueueData>): UseDataConnectQueryResult<GetOfflineQueueData, GetOfflineQueueVariables>;
```

### Variables
The `GetOfflineQueue` Query has an optional argument of type `GetOfflineQueueVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetOfflineQueueVariables {
  operator?: string | null;
  status?: CheckinStatus | null;
}
```
### Return Type
Recall that calling the `GetOfflineQueue` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetOfflineQueue` Query is of type `GetOfflineQueueData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetOfflineQueue`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetOfflineQueueVariables } from '@dataconnect/generated';
import { useGetOfflineQueue } from '@dataconnect/generated/react'

export default function GetOfflineQueueComponent() {
  // The `useGetOfflineQueue` Query hook has an optional argument of type `GetOfflineQueueVariables`:
  const getOfflineQueueVars: GetOfflineQueueVariables = {
    operator: ..., // optional
    status: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetOfflineQueue(getOfflineQueueVars);
  // Variables can be defined inline as well.
  const query = useGetOfflineQueue({ operator: ..., status: ..., });
  // Since all variables are optional for this Query, you can omit the `GetOfflineQueueVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useGetOfflineQueue();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetOfflineQueue(dataConnect, getOfflineQueueVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetOfflineQueue(getOfflineQueueVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useGetOfflineQueue(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetOfflineQueue(dataConnect, getOfflineQueueVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.pwaCheckins);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateTour
You can execute the `CreateTour` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTour(options?: useDataConnectMutationOptions<CreateTourData, FirebaseError, CreateTourVariables>): UseDataConnectMutationResult<CreateTourData, CreateTourVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTour(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTourData, FirebaseError, CreateTourVariables>): UseDataConnectMutationResult<CreateTourData, CreateTourVariables>;
```

### Variables
The `CreateTour` Mutation requires an argument of type `CreateTourVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `CreateTour` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTour` Mutation is of type `CreateTourData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTourData {
  tour_insert: Tour_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTour`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTourVariables } from '@dataconnect/generated';
import { useCreateTour } from '@dataconnect/generated/react'

export default function CreateTourComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTour();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTour(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTour(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTour(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTour` Mutation requires an argument of type `CreateTourVariables`:
  const createTourVars: CreateTourVariables = {
    title: ..., 
    location: ..., 
    duration: ..., 
    durationHours: ..., 
    originalPrice: ..., 
    price: ..., 
    discount: ..., // optional
    category: ..., 
    description: ..., 
    image: ..., 
    featured: ..., // optional
    oneDay: ..., // optional
    popular: ..., // optional
    status: ..., // optional
    destination: ..., 
    vibeAdrenaline: ..., // optional
    vibeRelax: ..., // optional
    vibeCulture: ..., // optional
    vibeFamily: ..., // optional
    lat: ..., // optional
    lng: ..., // optional
    heroImages: ..., // optional
    heroBackgroundPosition: ..., // optional
    translations: ..., // optional
    operatorId: ..., 
    availableDates: ..., // optional
    itinerary: ..., // optional
    minAge: ..., // optional
    maxPassengers: ..., // optional
    trailerUrl: ..., // optional
    galleryImages: ..., // optional
    mapCenterLat: ..., // optional
    mapCenterLng: ..., // optional
    mapZoom: ..., // optional
    difficulty: ..., // optional
    seasonality: ..., // optional
    includes: ..., // optional
    excludes: ..., // optional
    requirements: ..., // optional
    pickupInfo: ..., // optional
    cancellationPolicy: ..., // optional
    languages: ..., // optional
    groupType: ..., // optional
    homepageSection: ..., // optional
    destinationRegion: ..., // optional
  };
  mutation.mutate(createTourVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTourVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tour_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTour
You can execute the `UpdateTour` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTour(options?: useDataConnectMutationOptions<UpdateTourData, FirebaseError, UpdateTourVariables>): UseDataConnectMutationResult<UpdateTourData, UpdateTourVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTour(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTourData, FirebaseError, UpdateTourVariables>): UseDataConnectMutationResult<UpdateTourData, UpdateTourVariables>;
```

### Variables
The `UpdateTour` Mutation requires an argument of type `UpdateTourVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpdateTour` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTour` Mutation is of type `UpdateTourData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTourData {
  tour_update?: Tour_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTour`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTourVariables } from '@dataconnect/generated';
import { useUpdateTour } from '@dataconnect/generated/react'

export default function UpdateTourComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTour();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTour(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTour(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTour(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTour` Mutation requires an argument of type `UpdateTourVariables`:
  const updateTourVars: UpdateTourVariables = {
    id: ..., 
    title: ..., // optional
    location: ..., // optional
    duration: ..., // optional
    durationHours: ..., // optional
    originalPrice: ..., // optional
    price: ..., // optional
    discount: ..., // optional
    category: ..., // optional
    description: ..., // optional
    image: ..., // optional
    featured: ..., // optional
    oneDay: ..., // optional
    popular: ..., // optional
    status: ..., // optional
    destination: ..., // optional
    vibeAdrenaline: ..., // optional
    vibeRelax: ..., // optional
    vibeCulture: ..., // optional
    vibeFamily: ..., // optional
    lat: ..., // optional
    lng: ..., // optional
    heroImages: ..., // optional
    heroBackgroundPosition: ..., // optional
    translations: ..., // optional
    operatorId: ..., // optional
    availableDates: ..., // optional
    itinerary: ..., // optional
    minAge: ..., // optional
    maxPassengers: ..., // optional
    trailerUrl: ..., // optional
    galleryImages: ..., // optional
    mapCenterLat: ..., // optional
    mapCenterLng: ..., // optional
    mapZoom: ..., // optional
    difficulty: ..., // optional
    seasonality: ..., // optional
    includes: ..., // optional
    excludes: ..., // optional
    requirements: ..., // optional
    pickupInfo: ..., // optional
    cancellationPolicy: ..., // optional
    languages: ..., // optional
    groupType: ..., // optional
    homepageSection: ..., // optional
    destinationRegion: ..., // optional
  };
  mutation.mutate(updateTourVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTourVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tour_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTour
You can execute the `DeleteTour` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTour(options?: useDataConnectMutationOptions<DeleteTourData, FirebaseError, DeleteTourVariables>): UseDataConnectMutationResult<DeleteTourData, DeleteTourVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTour(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTourData, FirebaseError, DeleteTourVariables>): UseDataConnectMutationResult<DeleteTourData, DeleteTourVariables>;
```

### Variables
The `DeleteTour` Mutation requires an argument of type `DeleteTourVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTourVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTour` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTour` Mutation is of type `DeleteTourData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTourData {
  tour_delete?: Tour_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTour`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTourVariables } from '@dataconnect/generated';
import { useDeleteTour } from '@dataconnect/generated/react'

export default function DeleteTourComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTour();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTour(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTour(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTour(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTour` Mutation requires an argument of type `DeleteTourVariables`:
  const deleteTourVars: DeleteTourVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTourVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTourVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tour_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateBooking
You can execute the `CreateBooking` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
```

### Variables
The `CreateBooking` Mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `CreateBooking` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateBooking` Mutation is of type `CreateBookingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateBooking`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateBookingVariables } from '@dataconnect/generated';
import { useCreateBooking } from '@dataconnect/generated/react'

export default function CreateBookingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateBooking();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateBooking(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBooking(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBooking(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateBooking` Mutation requires an argument of type `CreateBookingVariables`:
  const createBookingVars: CreateBookingVariables = {
    bookingId: ..., 
    tourId: ..., 
    userId: ..., 
    guests: ..., 
    date: ..., 
    totalPrice: ..., 
    currency: ..., // optional
    status: ..., // optional
    addons: ..., // optional
    specialRequests: ..., // optional
  };
  mutation.mutate(createBookingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ bookingId: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createBookingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.booking_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateBooking
You can execute the `UpdateBooking` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateBooking(options?: useDataConnectMutationOptions<UpdateBookingData, FirebaseError, UpdateBookingVariables>): UseDataConnectMutationResult<UpdateBookingData, UpdateBookingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBookingData, FirebaseError, UpdateBookingVariables>): UseDataConnectMutationResult<UpdateBookingData, UpdateBookingVariables>;
```

### Variables
The `UpdateBooking` Mutation requires an argument of type `UpdateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpdateBooking` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateBooking` Mutation is of type `UpdateBookingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateBooking`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateBookingVariables } from '@dataconnect/generated';
import { useUpdateBooking } from '@dataconnect/generated/react'

export default function UpdateBookingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateBooking();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateBooking(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateBooking(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateBooking(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateBooking` Mutation requires an argument of type `UpdateBookingVariables`:
  const updateBookingVars: UpdateBookingVariables = {
    id: ..., 
    tourId: ..., // optional
    userId: ..., // optional
    guests: ..., // optional
    date: ..., // optional
    totalPrice: ..., // optional
    currency: ..., // optional
    status: ..., // optional
    addons: ..., // optional
    specialRequests: ..., // optional
  };
  mutation.mutate(updateBookingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateBookingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.booking_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateUser
You can execute the `CreateUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```

### Variables
The `CreateUser` Mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateUserVariables {
  id: string;
  email: string;
  name: string;
  description?: string | null;
}
```
### Return Type
Recall that calling the `CreateUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUser` Mutation is of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserData {
  user_insert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUserVariables } from '@dataconnect/generated';
import { useCreateUser } from '@dataconnect/generated/react'

export default function CreateUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUser` Mutation requires an argument of type `CreateUserVariables`:
  const createUserVars: CreateUserVariables = {
    id: ..., 
    email: ..., 
    name: ..., 
    description: ..., // optional
  };
  mutation.mutate(createUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., email: ..., name: ..., description: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateSliderSlide
You can execute the `CreateSliderSlide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSliderSlide(options?: useDataConnectMutationOptions<CreateSliderSlideData, FirebaseError, CreateSliderSlideVariables>): UseDataConnectMutationResult<CreateSliderSlideData, CreateSliderSlideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSliderSlideData, FirebaseError, CreateSliderSlideVariables>): UseDataConnectMutationResult<CreateSliderSlideData, CreateSliderSlideVariables>;
```

### Variables
The `CreateSliderSlide` Mutation requires an argument of type `CreateSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `CreateSliderSlide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateSliderSlide` Mutation is of type `CreateSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSliderSlideData {
  sliderSlide_insert: SliderSlide_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateSliderSlide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSliderSlideVariables } from '@dataconnect/generated';
import { useCreateSliderSlide } from '@dataconnect/generated/react'

export default function CreateSliderSlideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSliderSlide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSliderSlide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSliderSlide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSliderSlide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSliderSlide` Mutation requires an argument of type `CreateSliderSlideVariables`:
  const createSliderSlideVars: CreateSliderSlideVariables = {
    subtitle: ..., 
    title: ..., 
    description: ..., 
    buttonText: ..., 
    image: ..., 
    link: ..., 
    order: ..., // optional
    active: ..., // optional
    translations: ..., // optional
  };
  mutation.mutate(createSliderSlideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSliderSlideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.sliderSlide_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateSliderSlide
You can execute the `UpdateSliderSlide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateSliderSlide(options?: useDataConnectMutationOptions<UpdateSliderSlideData, FirebaseError, UpdateSliderSlideVariables>): UseDataConnectMutationResult<UpdateSliderSlideData, UpdateSliderSlideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSliderSlideData, FirebaseError, UpdateSliderSlideVariables>): UseDataConnectMutationResult<UpdateSliderSlideData, UpdateSliderSlideVariables>;
```

### Variables
The `UpdateSliderSlide` Mutation requires an argument of type `UpdateSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpdateSliderSlide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateSliderSlide` Mutation is of type `UpdateSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateSliderSlideData {
  sliderSlide_update?: SliderSlide_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateSliderSlide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateSliderSlideVariables } from '@dataconnect/generated';
import { useUpdateSliderSlide } from '@dataconnect/generated/react'

export default function UpdateSliderSlideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateSliderSlide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateSliderSlide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSliderSlide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSliderSlide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateSliderSlide` Mutation requires an argument of type `UpdateSliderSlideVariables`:
  const updateSliderSlideVars: UpdateSliderSlideVariables = {
    id: ..., 
    subtitle: ..., // optional
    title: ..., // optional
    description: ..., // optional
    buttonText: ..., // optional
    image: ..., // optional
    link: ..., // optional
    order: ..., // optional
    active: ..., // optional
    translations: ..., // optional
  };
  mutation.mutate(updateSliderSlideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateSliderSlideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.sliderSlide_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSliderSlide
You can execute the `DeleteSliderSlide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSliderSlide(options?: useDataConnectMutationOptions<DeleteSliderSlideData, FirebaseError, DeleteSliderSlideVariables>): UseDataConnectMutationResult<DeleteSliderSlideData, DeleteSliderSlideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSliderSlide(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSliderSlideData, FirebaseError, DeleteSliderSlideVariables>): UseDataConnectMutationResult<DeleteSliderSlideData, DeleteSliderSlideVariables>;
```

### Variables
The `DeleteSliderSlide` Mutation requires an argument of type `DeleteSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSliderSlideVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteSliderSlide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSliderSlide` Mutation is of type `DeleteSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSliderSlideData {
  sliderSlide_delete?: SliderSlide_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSliderSlide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSliderSlideVariables } from '@dataconnect/generated';
import { useDeleteSliderSlide } from '@dataconnect/generated/react'

export default function DeleteSliderSlideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSliderSlide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSliderSlide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSliderSlide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSliderSlide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSliderSlide` Mutation requires an argument of type `DeleteSliderSlideVariables`:
  const deleteSliderSlideVars: DeleteSliderSlideVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSliderSlideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSliderSlideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.sliderSlide_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateGuide
You can execute the `CreateGuide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateGuide(options?: useDataConnectMutationOptions<CreateGuideData, FirebaseError, CreateGuideVariables>): UseDataConnectMutationResult<CreateGuideData, CreateGuideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateGuide(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuideData, FirebaseError, CreateGuideVariables>): UseDataConnectMutationResult<CreateGuideData, CreateGuideVariables>;
```

### Variables
The `CreateGuide` Mutation requires an argument of type `CreateGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateGuideVariables {
  name: string;
  specialty: string;
  status?: GuideStatus | null;
  operatorId: string;
}
```
### Return Type
Recall that calling the `CreateGuide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateGuide` Mutation is of type `CreateGuideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateGuideData {
  guide_insert: Guide_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateGuide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateGuideVariables } from '@dataconnect/generated';
import { useCreateGuide } from '@dataconnect/generated/react'

export default function CreateGuideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateGuide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateGuide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateGuide` Mutation requires an argument of type `CreateGuideVariables`:
  const createGuideVars: CreateGuideVariables = {
    name: ..., 
    specialty: ..., 
    status: ..., // optional
    operatorId: ..., 
  };
  mutation.mutate(createGuideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., specialty: ..., status: ..., operatorId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createGuideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guide_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateGuide
You can execute the `UpdateGuide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateGuide(options?: useDataConnectMutationOptions<UpdateGuideData, FirebaseError, UpdateGuideVariables>): UseDataConnectMutationResult<UpdateGuideData, UpdateGuideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateGuide(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuideData, FirebaseError, UpdateGuideVariables>): UseDataConnectMutationResult<UpdateGuideData, UpdateGuideVariables>;
```

### Variables
The `UpdateGuide` Mutation requires an argument of type `UpdateGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateGuideVariables {
  id: UUIDString;
  name?: string | null;
  specialty?: string | null;
  status?: GuideStatus | null;
}
```
### Return Type
Recall that calling the `UpdateGuide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateGuide` Mutation is of type `UpdateGuideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateGuideData {
  guide_update?: Guide_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateGuide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateGuideVariables } from '@dataconnect/generated';
import { useUpdateGuide } from '@dataconnect/generated/react'

export default function UpdateGuideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateGuide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateGuide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateGuide` Mutation requires an argument of type `UpdateGuideVariables`:
  const updateGuideVars: UpdateGuideVariables = {
    id: ..., 
    name: ..., // optional
    specialty: ..., // optional
    status: ..., // optional
  };
  mutation.mutate(updateGuideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., specialty: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateGuideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guide_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteGuide
You can execute the `DeleteGuide` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteGuide(options?: useDataConnectMutationOptions<DeleteGuideData, FirebaseError, DeleteGuideVariables>): UseDataConnectMutationResult<DeleteGuideData, DeleteGuideVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteGuide(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteGuideData, FirebaseError, DeleteGuideVariables>): UseDataConnectMutationResult<DeleteGuideData, DeleteGuideVariables>;
```

### Variables
The `DeleteGuide` Mutation requires an argument of type `DeleteGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteGuideVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteGuide` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteGuide` Mutation is of type `DeleteGuideData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteGuideData {
  guide_delete?: Guide_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteGuide`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteGuideVariables } from '@dataconnect/generated';
import { useDeleteGuide } from '@dataconnect/generated/react'

export default function DeleteGuideComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteGuide();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteGuide(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteGuide(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteGuide(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteGuide` Mutation requires an argument of type `DeleteGuideVariables`:
  const deleteGuideVars: DeleteGuideVariables = {
    id: ..., 
  };
  mutation.mutate(deleteGuideVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteGuideVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guide_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateVehicle
You can execute the `CreateVehicle` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateVehicle(options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, CreateVehicleVariables>): UseDataConnectMutationResult<CreateVehicleData, CreateVehicleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<CreateVehicleData, FirebaseError, CreateVehicleVariables>): UseDataConnectMutationResult<CreateVehicleData, CreateVehicleVariables>;
```

### Variables
The `CreateVehicle` Mutation requires an argument of type `CreateVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateVehicleVariables {
  name: string;
  seats: number;
  status?: VehicleStatus | null;
  operatorId: string;
}
```
### Return Type
Recall that calling the `CreateVehicle` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateVehicle` Mutation is of type `CreateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateVehicleData {
  vehicle_insert: Vehicle_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateVehicle`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateVehicleVariables } from '@dataconnect/generated';
import { useCreateVehicle } from '@dataconnect/generated/react'

export default function CreateVehicleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateVehicle();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateVehicle(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateVehicle(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateVehicle(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateVehicle` Mutation requires an argument of type `CreateVehicleVariables`:
  const createVehicleVars: CreateVehicleVariables = {
    name: ..., 
    seats: ..., 
    status: ..., // optional
    operatorId: ..., 
  };
  mutation.mutate(createVehicleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., seats: ..., status: ..., operatorId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createVehicleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateVehicle
You can execute the `UpdateVehicle` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateVehicle(options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleData, FirebaseError, UpdateVehicleVariables>): UseDataConnectMutationResult<UpdateVehicleData, UpdateVehicleVariables>;
```

### Variables
The `UpdateVehicle` Mutation requires an argument of type `UpdateVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateVehicleVariables {
  id: UUIDString;
  name?: string | null;
  seats?: number | null;
  status?: VehicleStatus | null;
}
```
### Return Type
Recall that calling the `UpdateVehicle` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateVehicle` Mutation is of type `UpdateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateVehicleData {
  vehicle_update?: Vehicle_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateVehicle`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateVehicleVariables } from '@dataconnect/generated';
import { useUpdateVehicle } from '@dataconnect/generated/react'

export default function UpdateVehicleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateVehicle();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateVehicle(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicle(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicle(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateVehicle` Mutation requires an argument of type `UpdateVehicleVariables`:
  const updateVehicleVars: UpdateVehicleVariables = {
    id: ..., 
    name: ..., // optional
    seats: ..., // optional
    status: ..., // optional
  };
  mutation.mutate(updateVehicleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., seats: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateVehicleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteVehicle
You can execute the `DeleteVehicle` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteVehicle(options?: useDataConnectMutationOptions<DeleteVehicleData, FirebaseError, DeleteVehicleVariables>): UseDataConnectMutationResult<DeleteVehicleData, DeleteVehicleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteVehicleData, FirebaseError, DeleteVehicleVariables>): UseDataConnectMutationResult<DeleteVehicleData, DeleteVehicleVariables>;
```

### Variables
The `DeleteVehicle` Mutation requires an argument of type `DeleteVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteVehicleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteVehicle` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteVehicle` Mutation is of type `DeleteVehicleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteVehicleData {
  vehicle_delete?: Vehicle_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteVehicle`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteVehicleVariables } from '@dataconnect/generated';
import { useDeleteVehicle } from '@dataconnect/generated/react'

export default function DeleteVehicleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteVehicle();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteVehicle(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteVehicle(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteVehicle(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteVehicle` Mutation requires an argument of type `DeleteVehicleVariables`:
  const deleteVehicleVars: DeleteVehicleVariables = {
    id: ..., 
  };
  mutation.mutate(deleteVehicleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteVehicleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddOfflineCheckin
You can execute the `AddOfflineCheckin` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAddOfflineCheckin(options?: useDataConnectMutationOptions<AddOfflineCheckinData, FirebaseError, AddOfflineCheckinVariables>): UseDataConnectMutationResult<AddOfflineCheckinData, AddOfflineCheckinVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddOfflineCheckin(dc: DataConnect, options?: useDataConnectMutationOptions<AddOfflineCheckinData, FirebaseError, AddOfflineCheckinVariables>): UseDataConnectMutationResult<AddOfflineCheckinData, AddOfflineCheckinVariables>;
```

### Variables
The `AddOfflineCheckin` Mutation requires an argument of type `AddOfflineCheckinVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddOfflineCheckinVariables {
  tourId?: UUIDString | null;
  bookingId?: UUIDString | null;
  tourTitle?: string | null;
  customerName?: string | null;
  operator: string;
}
```
### Return Type
Recall that calling the `AddOfflineCheckin` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddOfflineCheckin` Mutation is of type `AddOfflineCheckinData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddOfflineCheckinData {
  pwaCheckin_insert: PwaCheckin_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddOfflineCheckin`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddOfflineCheckinVariables } from '@dataconnect/generated';
import { useAddOfflineCheckin } from '@dataconnect/generated/react'

export default function AddOfflineCheckinComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddOfflineCheckin();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddOfflineCheckin(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddOfflineCheckin(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddOfflineCheckin(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddOfflineCheckin` Mutation requires an argument of type `AddOfflineCheckinVariables`:
  const addOfflineCheckinVars: AddOfflineCheckinVariables = {
    tourId: ..., // optional
    bookingId: ..., // optional
    tourTitle: ..., // optional
    customerName: ..., // optional
    operator: ..., 
  };
  mutation.mutate(addOfflineCheckinVars);
  // Variables can be defined inline as well.
  mutation.mutate({ tourId: ..., bookingId: ..., tourTitle: ..., customerName: ..., operator: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(addOfflineCheckinVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pwaCheckin_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeletePwaCheckin
You can execute the `DeletePwaCheckin` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeletePwaCheckin(options?: useDataConnectMutationOptions<DeletePwaCheckinData, FirebaseError, DeletePwaCheckinVariables>): UseDataConnectMutationResult<DeletePwaCheckinData, DeletePwaCheckinVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeletePwaCheckin(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePwaCheckinData, FirebaseError, DeletePwaCheckinVariables>): UseDataConnectMutationResult<DeletePwaCheckinData, DeletePwaCheckinVariables>;
```

### Variables
The `DeletePwaCheckin` Mutation requires an argument of type `DeletePwaCheckinVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeletePwaCheckinVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeletePwaCheckin` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeletePwaCheckin` Mutation is of type `DeletePwaCheckinData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeletePwaCheckinData {
  pwaCheckin_delete?: PwaCheckin_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeletePwaCheckin`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeletePwaCheckinVariables } from '@dataconnect/generated';
import { useDeletePwaCheckin } from '@dataconnect/generated/react'

export default function DeletePwaCheckinComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeletePwaCheckin();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeletePwaCheckin(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeletePwaCheckin(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeletePwaCheckin(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeletePwaCheckin` Mutation requires an argument of type `DeletePwaCheckinVariables`:
  const deletePwaCheckinVars: DeletePwaCheckinVariables = {
    id: ..., 
  };
  mutation.mutate(deletePwaCheckinVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deletePwaCheckinVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pwaCheckin_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteBooking
You can execute the `DeleteBooking` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteBooking(options?: useDataConnectMutationOptions<DeleteBookingData, FirebaseError, DeleteBookingVariables>): UseDataConnectMutationResult<DeleteBookingData, DeleteBookingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteBooking(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteBookingData, FirebaseError, DeleteBookingVariables>): UseDataConnectMutationResult<DeleteBookingData, DeleteBookingVariables>;
```

### Variables
The `DeleteBooking` Mutation requires an argument of type `DeleteBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteBookingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteBooking` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteBooking` Mutation is of type `DeleteBookingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteBookingData {
  booking_delete?: Booking_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteBooking`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteBookingVariables } from '@dataconnect/generated';
import { useDeleteBooking } from '@dataconnect/generated/react'

export default function DeleteBookingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteBooking();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteBooking(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteBooking(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteBooking(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteBooking` Mutation requires an argument of type `DeleteBookingVariables`:
  const deleteBookingVars: DeleteBookingVariables = {
    id: ..., 
  };
  mutation.mutate(deleteBookingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteBookingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.booking_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUser
You can execute the `DeleteUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
```

### Variables
The `DeleteUser` Mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteUserVariables {
  id: string;
}
```
### Return Type
Recall that calling the `DeleteUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUser` Mutation is of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteUserVariables } from '@dataconnect/generated';
import { useDeleteUser } from '@dataconnect/generated/react'

export default function DeleteUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteUser` Mutation requires an argument of type `DeleteUserVariables`:
  const deleteUserVars: DeleteUserVariables = {
    id: ..., 
  };
  mutation.mutate(deleteUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

