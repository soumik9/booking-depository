import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_URL;

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: async (headers, { getState }) => {
            // @ts-ignore
            const token = getState()?.auth?.accessToken;
            token && headers.set("Authorization", `${token}`)
            return headers;
        }
    }),
    tagTypes: ['Books', 'Book', 'Users', 'Profile', 'Reviews', 'Review', 'CurrentPlan'],
    endpoints: (builder) => ({}),
})