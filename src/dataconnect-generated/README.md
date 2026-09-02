# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
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

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetTours
You can execute the `GetTours` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTours(): QueryPromise<GetToursData, undefined>;

interface GetToursRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetToursData, undefined>;
}
export const getToursRef: GetToursRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTours(dc: DataConnect): QueryPromise<GetToursData, undefined>;

interface GetToursRef {
  ...
  (dc: DataConnect): QueryRef<GetToursData, undefined>;
}
export const getToursRef: GetToursRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getToursRef:
```typescript
const name = getToursRef.operationName;
console.log(name);
```

### Variables
The `GetTours` query has no variables.
### Return Type
Recall that executing the `GetTours` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetToursData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetTours`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTours } from '@dataconnect/generated';


// Call the `getTours()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTours();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTours(dataConnect);

console.log(data.tours);

// Or, you can use the `Promise` API.
getTours().then((response) => {
  const data = response.data;
  console.log(data.tours);
});
```

### Using `GetTours`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getToursRef } from '@dataconnect/generated';


// Call the `getToursRef()` function to get a reference to the query.
const ref = getToursRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getToursRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tours);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tours);
});
```

## GetTour
You can execute the `GetTour` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTour(vars: GetTourVariables): QueryPromise<GetTourData, GetTourVariables>;

interface GetTourRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTourVariables): QueryRef<GetTourData, GetTourVariables>;
}
export const getTourRef: GetTourRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTour(dc: DataConnect, vars: GetTourVariables): QueryPromise<GetTourData, GetTourVariables>;

interface GetTourRef {
  ...
  (dc: DataConnect, vars: GetTourVariables): QueryRef<GetTourData, GetTourVariables>;
}
export const getTourRef: GetTourRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTourRef:
```typescript
const name = getTourRef.operationName;
console.log(name);
```

### Variables
The `GetTour` query requires an argument of type `GetTourVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTourVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTour` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTourData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetTour`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTour, GetTourVariables } from '@dataconnect/generated';

// The `GetTour` query requires an argument of type `GetTourVariables`:
const getTourVars: GetTourVariables = {
  id: ..., 
};

// Call the `getTour()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTour(getTourVars);
// Variables can be defined inline as well.
const { data } = await getTour({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTour(dataConnect, getTourVars);

console.log(data.tour);

// Or, you can use the `Promise` API.
getTour(getTourVars).then((response) => {
  const data = response.data;
  console.log(data.tour);
});
```

### Using `GetTour`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTourRef, GetTourVariables } from '@dataconnect/generated';

// The `GetTour` query requires an argument of type `GetTourVariables`:
const getTourVars: GetTourVariables = {
  id: ..., 
};

// Call the `getTourRef()` function to get a reference to the query.
const ref = getTourRef(getTourVars);
// Variables can be defined inline as well.
const ref = getTourRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTourRef(dataConnect, getTourVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tour);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tour);
});
```

## GetBookings
You can execute the `GetBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getBookings(): QueryPromise<GetBookingsData, undefined>;

interface GetBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBookingsData, undefined>;
}
export const getBookingsRef: GetBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookings(dc: DataConnect): QueryPromise<GetBookingsData, undefined>;

interface GetBookingsRef {
  ...
  (dc: DataConnect): QueryRef<GetBookingsData, undefined>;
}
export const getBookingsRef: GetBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingsRef:
```typescript
const name = getBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetBookings` query has no variables.
### Return Type
Recall that executing the `GetBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookings } from '@dataconnect/generated';


// Call the `getBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookings(dataConnect);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getBookings().then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingsRef } from '@dataconnect/generated';


// Call the `getBookingsRef()` function to get a reference to the query.
const ref = getBookingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetUsers
You can execute the `GetUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUsers(): QueryPromise<GetUsersData, undefined>;

interface GetUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsersData, undefined>;
}
export const getUsersRef: GetUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsers(dc: DataConnect): QueryPromise<GetUsersData, undefined>;

interface GetUsersRef {
  ...
  (dc: DataConnect): QueryRef<GetUsersData, undefined>;
}
export const getUsersRef: GetUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsersRef:
```typescript
const name = getUsersRef.operationName;
console.log(name);
```

### Variables
The `GetUsers` query has no variables.
### Return Type
Recall that executing the `GetUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsers } from '@dataconnect/generated';


// Call the `getUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
getUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsersRef } from '@dataconnect/generated';


// Call the `getUsersRef()` function to get a reference to the query.
const ref = getUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetActiveSliderSlides
You can execute the `GetActiveSliderSlides` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getActiveSliderSlides(): QueryPromise<GetActiveSliderSlidesData, undefined>;

interface GetActiveSliderSlidesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetActiveSliderSlidesData, undefined>;
}
export const getActiveSliderSlidesRef: GetActiveSliderSlidesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveSliderSlides(dc: DataConnect): QueryPromise<GetActiveSliderSlidesData, undefined>;

interface GetActiveSliderSlidesRef {
  ...
  (dc: DataConnect): QueryRef<GetActiveSliderSlidesData, undefined>;
}
export const getActiveSliderSlidesRef: GetActiveSliderSlidesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveSliderSlidesRef:
```typescript
const name = getActiveSliderSlidesRef.operationName;
console.log(name);
```

### Variables
The `GetActiveSliderSlides` query has no variables.
### Return Type
Recall that executing the `GetActiveSliderSlides` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveSliderSlidesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetActiveSliderSlides`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveSliderSlides } from '@dataconnect/generated';


// Call the `getActiveSliderSlides()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveSliderSlides();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveSliderSlides(dataConnect);

console.log(data.sliderSlides);

// Or, you can use the `Promise` API.
getActiveSliderSlides().then((response) => {
  const data = response.data;
  console.log(data.sliderSlides);
});
```

### Using `GetActiveSliderSlides`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveSliderSlidesRef } from '@dataconnect/generated';


// Call the `getActiveSliderSlidesRef()` function to get a reference to the query.
const ref = getActiveSliderSlidesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveSliderSlidesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sliderSlides);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sliderSlides);
});
```

## GetGuides
You can execute the `GetGuides` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGuides(vars?: GetGuidesVariables): QueryPromise<GetGuidesData, GetGuidesVariables>;

interface GetGuidesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetGuidesVariables): QueryRef<GetGuidesData, GetGuidesVariables>;
}
export const getGuidesRef: GetGuidesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGuides(dc: DataConnect, vars?: GetGuidesVariables): QueryPromise<GetGuidesData, GetGuidesVariables>;

interface GetGuidesRef {
  ...
  (dc: DataConnect, vars?: GetGuidesVariables): QueryRef<GetGuidesData, GetGuidesVariables>;
}
export const getGuidesRef: GetGuidesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGuidesRef:
```typescript
const name = getGuidesRef.operationName;
console.log(name);
```

### Variables
The `GetGuides` query has an optional argument of type `GetGuidesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGuidesVariables {
  operatorId?: string | null;
  status?: GuideStatus | null;
}
```
### Return Type
Recall that executing the `GetGuides` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGuidesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetGuides`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGuides, GetGuidesVariables } from '@dataconnect/generated';

// The `GetGuides` query has an optional argument of type `GetGuidesVariables`:
const getGuidesVars: GetGuidesVariables = {
  operatorId: ..., // optional
  status: ..., // optional
};

// Call the `getGuides()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGuides(getGuidesVars);
// Variables can be defined inline as well.
const { data } = await getGuides({ operatorId: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetGuidesVariables` argument.
const { data } = await getGuides();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGuides(dataConnect, getGuidesVars);

console.log(data.guides);

// Or, you can use the `Promise` API.
getGuides(getGuidesVars).then((response) => {
  const data = response.data;
  console.log(data.guides);
});
```

### Using `GetGuides`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGuidesRef, GetGuidesVariables } from '@dataconnect/generated';

// The `GetGuides` query has an optional argument of type `GetGuidesVariables`:
const getGuidesVars: GetGuidesVariables = {
  operatorId: ..., // optional
  status: ..., // optional
};

// Call the `getGuidesRef()` function to get a reference to the query.
const ref = getGuidesRef(getGuidesVars);
// Variables can be defined inline as well.
const ref = getGuidesRef({ operatorId: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetGuidesVariables` argument.
const ref = getGuidesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGuidesRef(dataConnect, getGuidesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guides);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guides);
});
```

## GetVehicles
You can execute the `GetVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVehicles(vars?: GetVehiclesVariables): QueryPromise<GetVehiclesData, GetVehiclesVariables>;

interface GetVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetVehiclesVariables): QueryRef<GetVehiclesData, GetVehiclesVariables>;
}
export const getVehiclesRef: GetVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVehicles(dc: DataConnect, vars?: GetVehiclesVariables): QueryPromise<GetVehiclesData, GetVehiclesVariables>;

interface GetVehiclesRef {
  ...
  (dc: DataConnect, vars?: GetVehiclesVariables): QueryRef<GetVehiclesData, GetVehiclesVariables>;
}
export const getVehiclesRef: GetVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVehiclesRef:
```typescript
const name = getVehiclesRef.operationName;
console.log(name);
```

### Variables
The `GetVehicles` query has an optional argument of type `GetVehiclesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVehiclesVariables {
  operatorId?: string | null;
  status?: VehicleStatus | null;
}
```
### Return Type
Recall that executing the `GetVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVehicles, GetVehiclesVariables } from '@dataconnect/generated';

// The `GetVehicles` query has an optional argument of type `GetVehiclesVariables`:
const getVehiclesVars: GetVehiclesVariables = {
  operatorId: ..., // optional
  status: ..., // optional
};

// Call the `getVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVehicles(getVehiclesVars);
// Variables can be defined inline as well.
const { data } = await getVehicles({ operatorId: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetVehiclesVariables` argument.
const { data } = await getVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVehicles(dataConnect, getVehiclesVars);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
getVehicles(getVehiclesVars).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `GetVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVehiclesRef, GetVehiclesVariables } from '@dataconnect/generated';

// The `GetVehicles` query has an optional argument of type `GetVehiclesVariables`:
const getVehiclesVars: GetVehiclesVariables = {
  operatorId: ..., // optional
  status: ..., // optional
};

// Call the `getVehiclesRef()` function to get a reference to the query.
const ref = getVehiclesRef(getVehiclesVars);
// Variables can be defined inline as well.
const ref = getVehiclesRef({ operatorId: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetVehiclesVariables` argument.
const ref = getVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVehiclesRef(dataConnect, getVehiclesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

## GetOfflineQueue
You can execute the `GetOfflineQueue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getOfflineQueue(vars?: GetOfflineQueueVariables): QueryPromise<GetOfflineQueueData, GetOfflineQueueVariables>;

interface GetOfflineQueueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetOfflineQueueVariables): QueryRef<GetOfflineQueueData, GetOfflineQueueVariables>;
}
export const getOfflineQueueRef: GetOfflineQueueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOfflineQueue(dc: DataConnect, vars?: GetOfflineQueueVariables): QueryPromise<GetOfflineQueueData, GetOfflineQueueVariables>;

interface GetOfflineQueueRef {
  ...
  (dc: DataConnect, vars?: GetOfflineQueueVariables): QueryRef<GetOfflineQueueData, GetOfflineQueueVariables>;
}
export const getOfflineQueueRef: GetOfflineQueueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOfflineQueueRef:
```typescript
const name = getOfflineQueueRef.operationName;
console.log(name);
```

### Variables
The `GetOfflineQueue` query has an optional argument of type `GetOfflineQueueVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOfflineQueueVariables {
  operator?: string | null;
  status?: CheckinStatus | null;
}
```
### Return Type
Recall that executing the `GetOfflineQueue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOfflineQueueData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetOfflineQueue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOfflineQueue, GetOfflineQueueVariables } from '@dataconnect/generated';

// The `GetOfflineQueue` query has an optional argument of type `GetOfflineQueueVariables`:
const getOfflineQueueVars: GetOfflineQueueVariables = {
  operator: ..., // optional
  status: ..., // optional
};

// Call the `getOfflineQueue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOfflineQueue(getOfflineQueueVars);
// Variables can be defined inline as well.
const { data } = await getOfflineQueue({ operator: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetOfflineQueueVariables` argument.
const { data } = await getOfflineQueue();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOfflineQueue(dataConnect, getOfflineQueueVars);

console.log(data.pwaCheckins);

// Or, you can use the `Promise` API.
getOfflineQueue(getOfflineQueueVars).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckins);
});
```

### Using `GetOfflineQueue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOfflineQueueRef, GetOfflineQueueVariables } from '@dataconnect/generated';

// The `GetOfflineQueue` query has an optional argument of type `GetOfflineQueueVariables`:
const getOfflineQueueVars: GetOfflineQueueVariables = {
  operator: ..., // optional
  status: ..., // optional
};

// Call the `getOfflineQueueRef()` function to get a reference to the query.
const ref = getOfflineQueueRef(getOfflineQueueVars);
// Variables can be defined inline as well.
const ref = getOfflineQueueRef({ operator: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `GetOfflineQueueVariables` argument.
const ref = getOfflineQueueRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOfflineQueueRef(dataConnect, getOfflineQueueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pwaCheckins);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckins);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTour
You can execute the `CreateTour` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTour(vars: CreateTourVariables): MutationPromise<CreateTourData, CreateTourVariables>;

interface CreateTourRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTourVariables): MutationRef<CreateTourData, CreateTourVariables>;
}
export const createTourRef: CreateTourRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTour(dc: DataConnect, vars: CreateTourVariables): MutationPromise<CreateTourData, CreateTourVariables>;

interface CreateTourRef {
  ...
  (dc: DataConnect, vars: CreateTourVariables): MutationRef<CreateTourData, CreateTourVariables>;
}
export const createTourRef: CreateTourRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTourRef:
```typescript
const name = createTourRef.operationName;
console.log(name);
```

### Variables
The `CreateTour` mutation requires an argument of type `CreateTourVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateTour` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTourData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTourData {
  tour_insert: Tour_Key;
}
```
### Using `CreateTour`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTour, CreateTourVariables } from '@dataconnect/generated';

// The `CreateTour` mutation requires an argument of type `CreateTourVariables`:
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

// Call the `createTour()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTour(createTourVars);
// Variables can be defined inline as well.
const { data } = await createTour({ title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTour(dataConnect, createTourVars);

console.log(data.tour_insert);

// Or, you can use the `Promise` API.
createTour(createTourVars).then((response) => {
  const data = response.data;
  console.log(data.tour_insert);
});
```

### Using `CreateTour`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTourRef, CreateTourVariables } from '@dataconnect/generated';

// The `CreateTour` mutation requires an argument of type `CreateTourVariables`:
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

// Call the `createTourRef()` function to get a reference to the mutation.
const ref = createTourRef(createTourVars);
// Variables can be defined inline as well.
const ref = createTourRef({ title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTourRef(dataConnect, createTourVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tour_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tour_insert);
});
```

## UpdateTour
You can execute the `UpdateTour` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTour(vars: UpdateTourVariables): MutationPromise<UpdateTourData, UpdateTourVariables>;

interface UpdateTourRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTourVariables): MutationRef<UpdateTourData, UpdateTourVariables>;
}
export const updateTourRef: UpdateTourRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTour(dc: DataConnect, vars: UpdateTourVariables): MutationPromise<UpdateTourData, UpdateTourVariables>;

interface UpdateTourRef {
  ...
  (dc: DataConnect, vars: UpdateTourVariables): MutationRef<UpdateTourData, UpdateTourVariables>;
}
export const updateTourRef: UpdateTourRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTourRef:
```typescript
const name = updateTourRef.operationName;
console.log(name);
```

### Variables
The `UpdateTour` mutation requires an argument of type `UpdateTourVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdateTour` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTourData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTourData {
  tour_update?: Tour_Key | null;
}
```
### Using `UpdateTour`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTour, UpdateTourVariables } from '@dataconnect/generated';

// The `UpdateTour` mutation requires an argument of type `UpdateTourVariables`:
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

// Call the `updateTour()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTour(updateTourVars);
// Variables can be defined inline as well.
const { data } = await updateTour({ id: ..., title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTour(dataConnect, updateTourVars);

console.log(data.tour_update);

// Or, you can use the `Promise` API.
updateTour(updateTourVars).then((response) => {
  const data = response.data;
  console.log(data.tour_update);
});
```

### Using `UpdateTour`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTourRef, UpdateTourVariables } from '@dataconnect/generated';

// The `UpdateTour` mutation requires an argument of type `UpdateTourVariables`:
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

// Call the `updateTourRef()` function to get a reference to the mutation.
const ref = updateTourRef(updateTourVars);
// Variables can be defined inline as well.
const ref = updateTourRef({ id: ..., title: ..., location: ..., duration: ..., durationHours: ..., originalPrice: ..., price: ..., discount: ..., category: ..., description: ..., image: ..., featured: ..., oneDay: ..., popular: ..., status: ..., destination: ..., vibeAdrenaline: ..., vibeRelax: ..., vibeCulture: ..., vibeFamily: ..., lat: ..., lng: ..., heroImages: ..., heroBackgroundPosition: ..., translations: ..., operatorId: ..., availableDates: ..., itinerary: ..., minAge: ..., maxPassengers: ..., trailerUrl: ..., galleryImages: ..., mapCenterLat: ..., mapCenterLng: ..., mapZoom: ..., difficulty: ..., seasonality: ..., includes: ..., excludes: ..., requirements: ..., pickupInfo: ..., cancellationPolicy: ..., languages: ..., groupType: ..., homepageSection: ..., destinationRegion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTourRef(dataConnect, updateTourVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tour_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tour_update);
});
```

## DeleteTour
You can execute the `DeleteTour` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTour(vars: DeleteTourVariables): MutationPromise<DeleteTourData, DeleteTourVariables>;

interface DeleteTourRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTourVariables): MutationRef<DeleteTourData, DeleteTourVariables>;
}
export const deleteTourRef: DeleteTourRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTour(dc: DataConnect, vars: DeleteTourVariables): MutationPromise<DeleteTourData, DeleteTourVariables>;

interface DeleteTourRef {
  ...
  (dc: DataConnect, vars: DeleteTourVariables): MutationRef<DeleteTourData, DeleteTourVariables>;
}
export const deleteTourRef: DeleteTourRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTourRef:
```typescript
const name = deleteTourRef.operationName;
console.log(name);
```

### Variables
The `DeleteTour` mutation requires an argument of type `DeleteTourVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTourVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTour` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTourData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTourData {
  tour_delete?: Tour_Key | null;
}
```
### Using `DeleteTour`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTour, DeleteTourVariables } from '@dataconnect/generated';

// The `DeleteTour` mutation requires an argument of type `DeleteTourVariables`:
const deleteTourVars: DeleteTourVariables = {
  id: ..., 
};

// Call the `deleteTour()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTour(deleteTourVars);
// Variables can be defined inline as well.
const { data } = await deleteTour({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTour(dataConnect, deleteTourVars);

console.log(data.tour_delete);

// Or, you can use the `Promise` API.
deleteTour(deleteTourVars).then((response) => {
  const data = response.data;
  console.log(data.tour_delete);
});
```

### Using `DeleteTour`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTourRef, DeleteTourVariables } from '@dataconnect/generated';

// The `DeleteTour` mutation requires an argument of type `DeleteTourVariables`:
const deleteTourVars: DeleteTourVariables = {
  id: ..., 
};

// Call the `deleteTourRef()` function to get a reference to the mutation.
const ref = deleteTourRef(deleteTourVars);
// Variables can be defined inline as well.
const ref = deleteTourRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTourRef(dataConnect, deleteTourVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tour_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tour_delete);
});
```

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
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

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ bookingId: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
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

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ bookingId: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## UpdateBooking
You can execute the `UpdateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBooking(vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBooking(dc: DataConnect, vars: UpdateBookingVariables): MutationPromise<UpdateBookingData, UpdateBookingVariables>;

interface UpdateBookingRef {
  ...
  (dc: DataConnect, vars: UpdateBookingVariables): MutationRef<UpdateBookingData, UpdateBookingVariables>;
}
export const updateBookingRef: UpdateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingRef:
```typescript
const name = updateBookingRef.operationName;
console.log(name);
```

### Variables
The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingData {
  booking_update?: Booking_Key | null;
}
```
### Using `UpdateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBooking, UpdateBookingVariables } from '@dataconnect/generated';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
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

// Call the `updateBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBooking(updateBookingVars);
// Variables can be defined inline as well.
const { data } = await updateBooking({ id: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBooking(dataConnect, updateBookingVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
updateBooking(updateBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `UpdateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingRef, UpdateBookingVariables } from '@dataconnect/generated';

// The `UpdateBooking` mutation requires an argument of type `UpdateBookingVariables`:
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

// Call the `updateBookingRef()` function to get a reference to the mutation.
const ref = updateBookingRef(updateBookingVars);
// Variables can be defined inline as well.
const ref = updateBookingRef({ id: ..., tourId: ..., userId: ..., guests: ..., date: ..., totalPrice: ..., currency: ..., status: ..., addons: ..., specialRequests: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingRef(dataConnect, updateBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  email: string;
  name: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  name: ..., 
  description: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., email: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  name: ..., 
  description: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., email: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateSliderSlide
You can execute the `CreateSliderSlide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSliderSlide(vars: CreateSliderSlideVariables): MutationPromise<CreateSliderSlideData, CreateSliderSlideVariables>;

interface CreateSliderSlideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSliderSlideVariables): MutationRef<CreateSliderSlideData, CreateSliderSlideVariables>;
}
export const createSliderSlideRef: CreateSliderSlideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSliderSlide(dc: DataConnect, vars: CreateSliderSlideVariables): MutationPromise<CreateSliderSlideData, CreateSliderSlideVariables>;

interface CreateSliderSlideRef {
  ...
  (dc: DataConnect, vars: CreateSliderSlideVariables): MutationRef<CreateSliderSlideData, CreateSliderSlideVariables>;
}
export const createSliderSlideRef: CreateSliderSlideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSliderSlideRef:
```typescript
const name = createSliderSlideRef.operationName;
console.log(name);
```

### Variables
The `CreateSliderSlide` mutation requires an argument of type `CreateSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateSliderSlide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSliderSlideData {
  sliderSlide_insert: SliderSlide_Key;
}
```
### Using `CreateSliderSlide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSliderSlide, CreateSliderSlideVariables } from '@dataconnect/generated';

// The `CreateSliderSlide` mutation requires an argument of type `CreateSliderSlideVariables`:
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

// Call the `createSliderSlide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSliderSlide(createSliderSlideVars);
// Variables can be defined inline as well.
const { data } = await createSliderSlide({ subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSliderSlide(dataConnect, createSliderSlideVars);

console.log(data.sliderSlide_insert);

// Or, you can use the `Promise` API.
createSliderSlide(createSliderSlideVars).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_insert);
});
```

### Using `CreateSliderSlide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSliderSlideRef, CreateSliderSlideVariables } from '@dataconnect/generated';

// The `CreateSliderSlide` mutation requires an argument of type `CreateSliderSlideVariables`:
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

// Call the `createSliderSlideRef()` function to get a reference to the mutation.
const ref = createSliderSlideRef(createSliderSlideVars);
// Variables can be defined inline as well.
const ref = createSliderSlideRef({ subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSliderSlideRef(dataConnect, createSliderSlideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sliderSlide_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_insert);
});
```

## UpdateSliderSlide
You can execute the `UpdateSliderSlide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSliderSlide(vars: UpdateSliderSlideVariables): MutationPromise<UpdateSliderSlideData, UpdateSliderSlideVariables>;

interface UpdateSliderSlideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSliderSlideVariables): MutationRef<UpdateSliderSlideData, UpdateSliderSlideVariables>;
}
export const updateSliderSlideRef: UpdateSliderSlideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSliderSlide(dc: DataConnect, vars: UpdateSliderSlideVariables): MutationPromise<UpdateSliderSlideData, UpdateSliderSlideVariables>;

interface UpdateSliderSlideRef {
  ...
  (dc: DataConnect, vars: UpdateSliderSlideVariables): MutationRef<UpdateSliderSlideData, UpdateSliderSlideVariables>;
}
export const updateSliderSlideRef: UpdateSliderSlideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSliderSlideRef:
```typescript
const name = updateSliderSlideRef.operationName;
console.log(name);
```

### Variables
The `UpdateSliderSlide` mutation requires an argument of type `UpdateSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdateSliderSlide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSliderSlideData {
  sliderSlide_update?: SliderSlide_Key | null;
}
```
### Using `UpdateSliderSlide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSliderSlide, UpdateSliderSlideVariables } from '@dataconnect/generated';

// The `UpdateSliderSlide` mutation requires an argument of type `UpdateSliderSlideVariables`:
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

// Call the `updateSliderSlide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSliderSlide(updateSliderSlideVars);
// Variables can be defined inline as well.
const { data } = await updateSliderSlide({ id: ..., subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSliderSlide(dataConnect, updateSliderSlideVars);

console.log(data.sliderSlide_update);

// Or, you can use the `Promise` API.
updateSliderSlide(updateSliderSlideVars).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_update);
});
```

### Using `UpdateSliderSlide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSliderSlideRef, UpdateSliderSlideVariables } from '@dataconnect/generated';

// The `UpdateSliderSlide` mutation requires an argument of type `UpdateSliderSlideVariables`:
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

// Call the `updateSliderSlideRef()` function to get a reference to the mutation.
const ref = updateSliderSlideRef(updateSliderSlideVars);
// Variables can be defined inline as well.
const ref = updateSliderSlideRef({ id: ..., subtitle: ..., title: ..., description: ..., buttonText: ..., image: ..., link: ..., order: ..., active: ..., translations: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSliderSlideRef(dataConnect, updateSliderSlideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sliderSlide_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_update);
});
```

## DeleteSliderSlide
You can execute the `DeleteSliderSlide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSliderSlide(vars: DeleteSliderSlideVariables): MutationPromise<DeleteSliderSlideData, DeleteSliderSlideVariables>;

interface DeleteSliderSlideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSliderSlideVariables): MutationRef<DeleteSliderSlideData, DeleteSliderSlideVariables>;
}
export const deleteSliderSlideRef: DeleteSliderSlideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSliderSlide(dc: DataConnect, vars: DeleteSliderSlideVariables): MutationPromise<DeleteSliderSlideData, DeleteSliderSlideVariables>;

interface DeleteSliderSlideRef {
  ...
  (dc: DataConnect, vars: DeleteSliderSlideVariables): MutationRef<DeleteSliderSlideData, DeleteSliderSlideVariables>;
}
export const deleteSliderSlideRef: DeleteSliderSlideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSliderSlideRef:
```typescript
const name = deleteSliderSlideRef.operationName;
console.log(name);
```

### Variables
The `DeleteSliderSlide` mutation requires an argument of type `DeleteSliderSlideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSliderSlideVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSliderSlide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSliderSlideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSliderSlideData {
  sliderSlide_delete?: SliderSlide_Key | null;
}
```
### Using `DeleteSliderSlide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSliderSlide, DeleteSliderSlideVariables } from '@dataconnect/generated';

// The `DeleteSliderSlide` mutation requires an argument of type `DeleteSliderSlideVariables`:
const deleteSliderSlideVars: DeleteSliderSlideVariables = {
  id: ..., 
};

// Call the `deleteSliderSlide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSliderSlide(deleteSliderSlideVars);
// Variables can be defined inline as well.
const { data } = await deleteSliderSlide({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSliderSlide(dataConnect, deleteSliderSlideVars);

console.log(data.sliderSlide_delete);

// Or, you can use the `Promise` API.
deleteSliderSlide(deleteSliderSlideVars).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_delete);
});
```

### Using `DeleteSliderSlide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSliderSlideRef, DeleteSliderSlideVariables } from '@dataconnect/generated';

// The `DeleteSliderSlide` mutation requires an argument of type `DeleteSliderSlideVariables`:
const deleteSliderSlideVars: DeleteSliderSlideVariables = {
  id: ..., 
};

// Call the `deleteSliderSlideRef()` function to get a reference to the mutation.
const ref = deleteSliderSlideRef(deleteSliderSlideVars);
// Variables can be defined inline as well.
const ref = deleteSliderSlideRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSliderSlideRef(dataConnect, deleteSliderSlideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sliderSlide_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sliderSlide_delete);
});
```

## CreateGuide
You can execute the `CreateGuide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createGuide(vars: CreateGuideVariables): MutationPromise<CreateGuideData, CreateGuideVariables>;

interface CreateGuideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuideVariables): MutationRef<CreateGuideData, CreateGuideVariables>;
}
export const createGuideRef: CreateGuideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGuide(dc: DataConnect, vars: CreateGuideVariables): MutationPromise<CreateGuideData, CreateGuideVariables>;

interface CreateGuideRef {
  ...
  (dc: DataConnect, vars: CreateGuideVariables): MutationRef<CreateGuideData, CreateGuideVariables>;
}
export const createGuideRef: CreateGuideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGuideRef:
```typescript
const name = createGuideRef.operationName;
console.log(name);
```

### Variables
The `CreateGuide` mutation requires an argument of type `CreateGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateGuideVariables {
  name: string;
  specialty: string;
  status?: GuideStatus | null;
  operatorId: string;
}
```
### Return Type
Recall that executing the `CreateGuide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGuideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGuideData {
  guide_insert: Guide_Key;
}
```
### Using `CreateGuide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGuide, CreateGuideVariables } from '@dataconnect/generated';

// The `CreateGuide` mutation requires an argument of type `CreateGuideVariables`:
const createGuideVars: CreateGuideVariables = {
  name: ..., 
  specialty: ..., 
  status: ..., // optional
  operatorId: ..., 
};

// Call the `createGuide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGuide(createGuideVars);
// Variables can be defined inline as well.
const { data } = await createGuide({ name: ..., specialty: ..., status: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGuide(dataConnect, createGuideVars);

console.log(data.guide_insert);

// Or, you can use the `Promise` API.
createGuide(createGuideVars).then((response) => {
  const data = response.data;
  console.log(data.guide_insert);
});
```

### Using `CreateGuide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGuideRef, CreateGuideVariables } from '@dataconnect/generated';

// The `CreateGuide` mutation requires an argument of type `CreateGuideVariables`:
const createGuideVars: CreateGuideVariables = {
  name: ..., 
  specialty: ..., 
  status: ..., // optional
  operatorId: ..., 
};

// Call the `createGuideRef()` function to get a reference to the mutation.
const ref = createGuideRef(createGuideVars);
// Variables can be defined inline as well.
const ref = createGuideRef({ name: ..., specialty: ..., status: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGuideRef(dataConnect, createGuideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guide_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guide_insert);
});
```

## UpdateGuide
You can execute the `UpdateGuide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateGuide(vars: UpdateGuideVariables): MutationPromise<UpdateGuideData, UpdateGuideVariables>;

interface UpdateGuideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuideVariables): MutationRef<UpdateGuideData, UpdateGuideVariables>;
}
export const updateGuideRef: UpdateGuideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGuide(dc: DataConnect, vars: UpdateGuideVariables): MutationPromise<UpdateGuideData, UpdateGuideVariables>;

interface UpdateGuideRef {
  ...
  (dc: DataConnect, vars: UpdateGuideVariables): MutationRef<UpdateGuideData, UpdateGuideVariables>;
}
export const updateGuideRef: UpdateGuideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGuideRef:
```typescript
const name = updateGuideRef.operationName;
console.log(name);
```

### Variables
The `UpdateGuide` mutation requires an argument of type `UpdateGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGuideVariables {
  id: UUIDString;
  name?: string | null;
  specialty?: string | null;
  status?: GuideStatus | null;
}
```
### Return Type
Recall that executing the `UpdateGuide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGuideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGuideData {
  guide_update?: Guide_Key | null;
}
```
### Using `UpdateGuide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGuide, UpdateGuideVariables } from '@dataconnect/generated';

// The `UpdateGuide` mutation requires an argument of type `UpdateGuideVariables`:
const updateGuideVars: UpdateGuideVariables = {
  id: ..., 
  name: ..., // optional
  specialty: ..., // optional
  status: ..., // optional
};

// Call the `updateGuide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGuide(updateGuideVars);
// Variables can be defined inline as well.
const { data } = await updateGuide({ id: ..., name: ..., specialty: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGuide(dataConnect, updateGuideVars);

console.log(data.guide_update);

// Or, you can use the `Promise` API.
updateGuide(updateGuideVars).then((response) => {
  const data = response.data;
  console.log(data.guide_update);
});
```

### Using `UpdateGuide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGuideRef, UpdateGuideVariables } from '@dataconnect/generated';

// The `UpdateGuide` mutation requires an argument of type `UpdateGuideVariables`:
const updateGuideVars: UpdateGuideVariables = {
  id: ..., 
  name: ..., // optional
  specialty: ..., // optional
  status: ..., // optional
};

// Call the `updateGuideRef()` function to get a reference to the mutation.
const ref = updateGuideRef(updateGuideVars);
// Variables can be defined inline as well.
const ref = updateGuideRef({ id: ..., name: ..., specialty: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGuideRef(dataConnect, updateGuideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guide_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guide_update);
});
```

## DeleteGuide
You can execute the `DeleteGuide` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteGuide(vars: DeleteGuideVariables): MutationPromise<DeleteGuideData, DeleteGuideVariables>;

interface DeleteGuideRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGuideVariables): MutationRef<DeleteGuideData, DeleteGuideVariables>;
}
export const deleteGuideRef: DeleteGuideRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGuide(dc: DataConnect, vars: DeleteGuideVariables): MutationPromise<DeleteGuideData, DeleteGuideVariables>;

interface DeleteGuideRef {
  ...
  (dc: DataConnect, vars: DeleteGuideVariables): MutationRef<DeleteGuideData, DeleteGuideVariables>;
}
export const deleteGuideRef: DeleteGuideRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGuideRef:
```typescript
const name = deleteGuideRef.operationName;
console.log(name);
```

### Variables
The `DeleteGuide` mutation requires an argument of type `DeleteGuideVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGuideVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGuide` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGuideData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGuideData {
  guide_delete?: Guide_Key | null;
}
```
### Using `DeleteGuide`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGuide, DeleteGuideVariables } from '@dataconnect/generated';

// The `DeleteGuide` mutation requires an argument of type `DeleteGuideVariables`:
const deleteGuideVars: DeleteGuideVariables = {
  id: ..., 
};

// Call the `deleteGuide()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGuide(deleteGuideVars);
// Variables can be defined inline as well.
const { data } = await deleteGuide({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGuide(dataConnect, deleteGuideVars);

console.log(data.guide_delete);

// Or, you can use the `Promise` API.
deleteGuide(deleteGuideVars).then((response) => {
  const data = response.data;
  console.log(data.guide_delete);
});
```

### Using `DeleteGuide`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGuideRef, DeleteGuideVariables } from '@dataconnect/generated';

// The `DeleteGuide` mutation requires an argument of type `DeleteGuideVariables`:
const deleteGuideVars: DeleteGuideVariables = {
  id: ..., 
};

// Call the `deleteGuideRef()` function to get a reference to the mutation.
const ref = deleteGuideRef(deleteGuideVars);
// Variables can be defined inline as well.
const ref = deleteGuideRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGuideRef(dataConnect, deleteGuideVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guide_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guide_delete);
});
```

## CreateVehicle
You can execute the `CreateVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createVehicle(vars: CreateVehicleVariables): MutationPromise<CreateVehicleData, CreateVehicleVariables>;

interface CreateVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVehicleVariables): MutationRef<CreateVehicleData, CreateVehicleVariables>;
}
export const createVehicleRef: CreateVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVehicle(dc: DataConnect, vars: CreateVehicleVariables): MutationPromise<CreateVehicleData, CreateVehicleVariables>;

interface CreateVehicleRef {
  ...
  (dc: DataConnect, vars: CreateVehicleVariables): MutationRef<CreateVehicleData, CreateVehicleVariables>;
}
export const createVehicleRef: CreateVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVehicleRef:
```typescript
const name = createVehicleRef.operationName;
console.log(name);
```

### Variables
The `CreateVehicle` mutation requires an argument of type `CreateVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVehicleVariables {
  name: string;
  seats: number;
  status?: VehicleStatus | null;
  operatorId: string;
}
```
### Return Type
Recall that executing the `CreateVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVehicleData {
  vehicle_insert: Vehicle_Key;
}
```
### Using `CreateVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVehicle, CreateVehicleVariables } from '@dataconnect/generated';

// The `CreateVehicle` mutation requires an argument of type `CreateVehicleVariables`:
const createVehicleVars: CreateVehicleVariables = {
  name: ..., 
  seats: ..., 
  status: ..., // optional
  operatorId: ..., 
};

// Call the `createVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVehicle(createVehicleVars);
// Variables can be defined inline as well.
const { data } = await createVehicle({ name: ..., seats: ..., status: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVehicle(dataConnect, createVehicleVars);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
createVehicle(createVehicleVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

### Using `CreateVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVehicleRef, CreateVehicleVariables } from '@dataconnect/generated';

// The `CreateVehicle` mutation requires an argument of type `CreateVehicleVariables`:
const createVehicleVars: CreateVehicleVariables = {
  name: ..., 
  seats: ..., 
  status: ..., // optional
  operatorId: ..., 
};

// Call the `createVehicleRef()` function to get a reference to the mutation.
const ref = createVehicleRef(createVehicleVars);
// Variables can be defined inline as well.
const ref = createVehicleRef({ name: ..., seats: ..., status: ..., operatorId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVehicleRef(dataConnect, createVehicleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

## UpdateVehicle
You can execute the `UpdateVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVehicle(vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

interface UpdateVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
}
export const updateVehicleRef: UpdateVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVehicle(dc: DataConnect, vars: UpdateVehicleVariables): MutationPromise<UpdateVehicleData, UpdateVehicleVariables>;

interface UpdateVehicleRef {
  ...
  (dc: DataConnect, vars: UpdateVehicleVariables): MutationRef<UpdateVehicleData, UpdateVehicleVariables>;
}
export const updateVehicleRef: UpdateVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVehicleRef:
```typescript
const name = updateVehicleRef.operationName;
console.log(name);
```

### Variables
The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVehicleVariables {
  id: UUIDString;
  name?: string | null;
  seats?: number | null;
  status?: VehicleStatus | null;
}
```
### Return Type
Recall that executing the `UpdateVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVehicleData {
  vehicle_update?: Vehicle_Key | null;
}
```
### Using `UpdateVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVehicle, UpdateVehicleVariables } from '@dataconnect/generated';

// The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`:
const updateVehicleVars: UpdateVehicleVariables = {
  id: ..., 
  name: ..., // optional
  seats: ..., // optional
  status: ..., // optional
};

// Call the `updateVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVehicle(updateVehicleVars);
// Variables can be defined inline as well.
const { data } = await updateVehicle({ id: ..., name: ..., seats: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVehicle(dataConnect, updateVehicleVars);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
updateVehicle(updateVehicleVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

### Using `UpdateVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVehicleRef, UpdateVehicleVariables } from '@dataconnect/generated';

// The `UpdateVehicle` mutation requires an argument of type `UpdateVehicleVariables`:
const updateVehicleVars: UpdateVehicleVariables = {
  id: ..., 
  name: ..., // optional
  seats: ..., // optional
  status: ..., // optional
};

// Call the `updateVehicleRef()` function to get a reference to the mutation.
const ref = updateVehicleRef(updateVehicleVars);
// Variables can be defined inline as well.
const ref = updateVehicleRef({ id: ..., name: ..., seats: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVehicleRef(dataConnect, updateVehicleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

## DeleteVehicle
You can execute the `DeleteVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteVehicle(vars: DeleteVehicleVariables): MutationPromise<DeleteVehicleData, DeleteVehicleVariables>;

interface DeleteVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVehicleVariables): MutationRef<DeleteVehicleData, DeleteVehicleVariables>;
}
export const deleteVehicleRef: DeleteVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteVehicle(dc: DataConnect, vars: DeleteVehicleVariables): MutationPromise<DeleteVehicleData, DeleteVehicleVariables>;

interface DeleteVehicleRef {
  ...
  (dc: DataConnect, vars: DeleteVehicleVariables): MutationRef<DeleteVehicleData, DeleteVehicleVariables>;
}
export const deleteVehicleRef: DeleteVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteVehicleRef:
```typescript
const name = deleteVehicleRef.operationName;
console.log(name);
```

### Variables
The `DeleteVehicle` mutation requires an argument of type `DeleteVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteVehicleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteVehicleData {
  vehicle_delete?: Vehicle_Key | null;
}
```
### Using `DeleteVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteVehicle, DeleteVehicleVariables } from '@dataconnect/generated';

// The `DeleteVehicle` mutation requires an argument of type `DeleteVehicleVariables`:
const deleteVehicleVars: DeleteVehicleVariables = {
  id: ..., 
};

// Call the `deleteVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteVehicle(deleteVehicleVars);
// Variables can be defined inline as well.
const { data } = await deleteVehicle({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteVehicle(dataConnect, deleteVehicleVars);

console.log(data.vehicle_delete);

// Or, you can use the `Promise` API.
deleteVehicle(deleteVehicleVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_delete);
});
```

### Using `DeleteVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteVehicleRef, DeleteVehicleVariables } from '@dataconnect/generated';

// The `DeleteVehicle` mutation requires an argument of type `DeleteVehicleVariables`:
const deleteVehicleVars: DeleteVehicleVariables = {
  id: ..., 
};

// Call the `deleteVehicleRef()` function to get a reference to the mutation.
const ref = deleteVehicleRef(deleteVehicleVars);
// Variables can be defined inline as well.
const ref = deleteVehicleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteVehicleRef(dataConnect, deleteVehicleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_delete);
});
```

## AddOfflineCheckin
You can execute the `AddOfflineCheckin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addOfflineCheckin(vars: AddOfflineCheckinVariables): MutationPromise<AddOfflineCheckinData, AddOfflineCheckinVariables>;

interface AddOfflineCheckinRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddOfflineCheckinVariables): MutationRef<AddOfflineCheckinData, AddOfflineCheckinVariables>;
}
export const addOfflineCheckinRef: AddOfflineCheckinRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addOfflineCheckin(dc: DataConnect, vars: AddOfflineCheckinVariables): MutationPromise<AddOfflineCheckinData, AddOfflineCheckinVariables>;

interface AddOfflineCheckinRef {
  ...
  (dc: DataConnect, vars: AddOfflineCheckinVariables): MutationRef<AddOfflineCheckinData, AddOfflineCheckinVariables>;
}
export const addOfflineCheckinRef: AddOfflineCheckinRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addOfflineCheckinRef:
```typescript
const name = addOfflineCheckinRef.operationName;
console.log(name);
```

### Variables
The `AddOfflineCheckin` mutation requires an argument of type `AddOfflineCheckinVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddOfflineCheckinVariables {
  tourId?: UUIDString | null;
  bookingId?: UUIDString | null;
  tourTitle?: string | null;
  customerName?: string | null;
  operator: string;
}
```
### Return Type
Recall that executing the `AddOfflineCheckin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddOfflineCheckinData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddOfflineCheckinData {
  pwaCheckin_insert: PwaCheckin_Key;
}
```
### Using `AddOfflineCheckin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addOfflineCheckin, AddOfflineCheckinVariables } from '@dataconnect/generated';

// The `AddOfflineCheckin` mutation requires an argument of type `AddOfflineCheckinVariables`:
const addOfflineCheckinVars: AddOfflineCheckinVariables = {
  tourId: ..., // optional
  bookingId: ..., // optional
  tourTitle: ..., // optional
  customerName: ..., // optional
  operator: ..., 
};

// Call the `addOfflineCheckin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addOfflineCheckin(addOfflineCheckinVars);
// Variables can be defined inline as well.
const { data } = await addOfflineCheckin({ tourId: ..., bookingId: ..., tourTitle: ..., customerName: ..., operator: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addOfflineCheckin(dataConnect, addOfflineCheckinVars);

console.log(data.pwaCheckin_insert);

// Or, you can use the `Promise` API.
addOfflineCheckin(addOfflineCheckinVars).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckin_insert);
});
```

### Using `AddOfflineCheckin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addOfflineCheckinRef, AddOfflineCheckinVariables } from '@dataconnect/generated';

// The `AddOfflineCheckin` mutation requires an argument of type `AddOfflineCheckinVariables`:
const addOfflineCheckinVars: AddOfflineCheckinVariables = {
  tourId: ..., // optional
  bookingId: ..., // optional
  tourTitle: ..., // optional
  customerName: ..., // optional
  operator: ..., 
};

// Call the `addOfflineCheckinRef()` function to get a reference to the mutation.
const ref = addOfflineCheckinRef(addOfflineCheckinVars);
// Variables can be defined inline as well.
const ref = addOfflineCheckinRef({ tourId: ..., bookingId: ..., tourTitle: ..., customerName: ..., operator: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addOfflineCheckinRef(dataConnect, addOfflineCheckinVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pwaCheckin_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckin_insert);
});
```

## DeletePwaCheckin
You can execute the `DeletePwaCheckin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePwaCheckin(vars: DeletePwaCheckinVariables): MutationPromise<DeletePwaCheckinData, DeletePwaCheckinVariables>;

interface DeletePwaCheckinRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePwaCheckinVariables): MutationRef<DeletePwaCheckinData, DeletePwaCheckinVariables>;
}
export const deletePwaCheckinRef: DeletePwaCheckinRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePwaCheckin(dc: DataConnect, vars: DeletePwaCheckinVariables): MutationPromise<DeletePwaCheckinData, DeletePwaCheckinVariables>;

interface DeletePwaCheckinRef {
  ...
  (dc: DataConnect, vars: DeletePwaCheckinVariables): MutationRef<DeletePwaCheckinData, DeletePwaCheckinVariables>;
}
export const deletePwaCheckinRef: DeletePwaCheckinRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePwaCheckinRef:
```typescript
const name = deletePwaCheckinRef.operationName;
console.log(name);
```

### Variables
The `DeletePwaCheckin` mutation requires an argument of type `DeletePwaCheckinVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePwaCheckinVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePwaCheckin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePwaCheckinData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePwaCheckinData {
  pwaCheckin_delete?: PwaCheckin_Key | null;
}
```
### Using `DeletePwaCheckin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePwaCheckin, DeletePwaCheckinVariables } from '@dataconnect/generated';

// The `DeletePwaCheckin` mutation requires an argument of type `DeletePwaCheckinVariables`:
const deletePwaCheckinVars: DeletePwaCheckinVariables = {
  id: ..., 
};

// Call the `deletePwaCheckin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePwaCheckin(deletePwaCheckinVars);
// Variables can be defined inline as well.
const { data } = await deletePwaCheckin({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePwaCheckin(dataConnect, deletePwaCheckinVars);

console.log(data.pwaCheckin_delete);

// Or, you can use the `Promise` API.
deletePwaCheckin(deletePwaCheckinVars).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckin_delete);
});
```

### Using `DeletePwaCheckin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePwaCheckinRef, DeletePwaCheckinVariables } from '@dataconnect/generated';

// The `DeletePwaCheckin` mutation requires an argument of type `DeletePwaCheckinVariables`:
const deletePwaCheckinVars: DeletePwaCheckinVariables = {
  id: ..., 
};

// Call the `deletePwaCheckinRef()` function to get a reference to the mutation.
const ref = deletePwaCheckinRef(deletePwaCheckinVars);
// Variables can be defined inline as well.
const ref = deletePwaCheckinRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePwaCheckinRef(dataConnect, deletePwaCheckinVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pwaCheckin_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pwaCheckin_delete);
});
```

## DeleteBooking
You can execute the `DeleteBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteBooking(vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;

interface DeleteBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
}
export const deleteBookingRef: DeleteBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBooking(dc: DataConnect, vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;

interface DeleteBookingRef {
  ...
  (dc: DataConnect, vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
}
export const deleteBookingRef: DeleteBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBookingRef:
```typescript
const name = deleteBookingRef.operationName;
console.log(name);
```

### Variables
The `DeleteBooking` mutation requires an argument of type `DeleteBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBookingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBookingData {
  booking_delete?: Booking_Key | null;
}
```
### Using `DeleteBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBooking, DeleteBookingVariables } from '@dataconnect/generated';

// The `DeleteBooking` mutation requires an argument of type `DeleteBookingVariables`:
const deleteBookingVars: DeleteBookingVariables = {
  id: ..., 
};

// Call the `deleteBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBooking(deleteBookingVars);
// Variables can be defined inline as well.
const { data } = await deleteBooking({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBooking(dataConnect, deleteBookingVars);

console.log(data.booking_delete);

// Or, you can use the `Promise` API.
deleteBooking(deleteBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_delete);
});
```

### Using `DeleteBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBookingRef, DeleteBookingVariables } from '@dataconnect/generated';

// The `DeleteBooking` mutation requires an argument of type `DeleteBookingVariables`:
const deleteBookingVars: DeleteBookingVariables = {
  id: ..., 
};

// Call the `deleteBookingRef()` function to get a reference to the mutation.
const ref = deleteBookingRef(deleteBookingVars);
// Variables can be defined inline as well.
const ref = deleteBookingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBookingRef(dataConnect, deleteBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_delete);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

