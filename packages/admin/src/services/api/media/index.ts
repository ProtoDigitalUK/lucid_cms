import useGetMultiple from "./useGetMultiple";
import useGetSingle from "./useGetSingle";
import useUpdateSingle from "./useUpdateSingle";
import useDeleteSingle from "./useDeleteSingle";
import useDeleteAllProcessedImages from "./useDeleteAllProcessedImages";
import useDeleteProcessedImages from "./useDeleteProcessedImages";
import useCreateSingle from "./useCreateSingle";
import useGetPresignedUrl from "./useGetPresignedUrl";

const exportObject: {
	useGetMultiple: typeof useGetMultiple;
	useGetSingle: typeof useGetSingle;
	useUpdateSingle: typeof useUpdateSingle;
	useDeleteSingle: typeof useDeleteSingle;
	useDeleteAllProcessedImages: typeof useDeleteAllProcessedImages;
	useDeleteProcessedImages: typeof useDeleteProcessedImages;
	useCreateSingle: typeof useCreateSingle;
	useGetPresignedUrl: typeof useGetPresignedUrl;
} = {
	useGetMultiple,
	useGetSingle,
	useUpdateSingle,
	useDeleteSingle,
	useDeleteAllProcessedImages,
	useDeleteProcessedImages,
	useCreateSingle,
	useGetPresignedUrl,
};

export default exportObject;
