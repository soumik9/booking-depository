import { apiSlice } from "../api/apiSlice";
import toast from 'react-hot-toast';

export const reviewApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (data) => ({
                url: 'review',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["Reviews", "Books", "Book"],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    toast.success(result.data.message);
                } catch (error: any) {
                    toast.error(error.error.data.message);
                }
            }
        }),
    })
});

export const {
    useCreateReviewMutation,
} = reviewApi;