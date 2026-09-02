# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateTour, useUpdateTour, useDeleteTour, useCreateBooking, useUpdateBooking, useCreateUser, useCreateSliderSlide, useUpdateSliderSlide, useDeleteSliderSlide, useCreateGuide } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateTour(createTourVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTour(updateTourVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTour(deleteTourVars);

const { data, isPending, isSuccess, isError, error } = useCreateBooking(createBookingVars);

const { data, isPending, isSuccess, isError, error } = useUpdateBooking(updateBookingVars);

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateSliderSlide(createSliderSlideVars);

const { data, isPending, isSuccess, isError, error } = useUpdateSliderSlide(updateSliderSlideVars);

const { data, isPending, isSuccess, isError, error } = useDeleteSliderSlide(deleteSliderSlideVars);

const { data, isPending, isSuccess, isError, error } = useCreateGuide(createGuideVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createTour, updateTour, deleteTour, createBooking, updateBooking, createUser, createSliderSlide, updateSliderSlide, deleteSliderSlide, createGuide } from '@dataconnect/generated';


// Operation CreateTour:  For variables, look at type CreateTourVars in ../index.d.ts
const { data } = await CreateTour(dataConnect, createTourVars);

// Operation UpdateTour:  For variables, look at type UpdateTourVars in ../index.d.ts
const { data } = await UpdateTour(dataConnect, updateTourVars);

// Operation DeleteTour:  For variables, look at type DeleteTourVars in ../index.d.ts
const { data } = await DeleteTour(dataConnect, deleteTourVars);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation UpdateBooking:  For variables, look at type UpdateBookingVars in ../index.d.ts
const { data } = await UpdateBooking(dataConnect, updateBookingVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation CreateSliderSlide:  For variables, look at type CreateSliderSlideVars in ../index.d.ts
const { data } = await CreateSliderSlide(dataConnect, createSliderSlideVars);

// Operation UpdateSliderSlide:  For variables, look at type UpdateSliderSlideVars in ../index.d.ts
const { data } = await UpdateSliderSlide(dataConnect, updateSliderSlideVars);

// Operation DeleteSliderSlide:  For variables, look at type DeleteSliderSlideVars in ../index.d.ts
const { data } = await DeleteSliderSlide(dataConnect, deleteSliderSlideVars);

// Operation CreateGuide:  For variables, look at type CreateGuideVars in ../index.d.ts
const { data } = await CreateGuide(dataConnect, createGuideVars);


```