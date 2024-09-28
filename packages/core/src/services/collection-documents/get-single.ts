import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type { ServiceFn } from "../../utils/services/types.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import type { CollectionDocumentResponse } from "../../types/response.js";
import type { DocumentVersionType } from "../../libs/db/types.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
			status: DocumentVersionType;
			collectionKey: string;
			query: z.infer<typeof collectionDocumentsSchema.getSingle.query>;
		},
	],
	CollectionDocumentResponse
> = async (context, data) => {
	const DocumentsRepo = Repository.get("collection-documents", context.db);
	const VersionsRepo = Repository.get(
		"collection-document-versions",
		context.db,
	);
	const DocumentsFormatter = Formatter.get("collection-documents");

	const [document, collectionRes] = await Promise.all([
		DocumentsRepo.selectSingleById({
			id: data.id,
			collectionKey: data.collectionKey,
			config: context.config,
			status: data.status,
		}),
		context.services.collection.getSingleInstance(context, {
			key: data.collectionKey,
		}),
	]);
	if (document === undefined) {
		return {
			error: {
				type: "basic",
				message: T("document_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}
	if (collectionRes.error) return collectionRes;
	if (document.version_id === null) {
		return {
			error: {
				type: "basic",
				message: T("document_version_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	if (data.query.include?.includes("bricks")) {
		const bricksRes =
			await context.services.collection.document.brick.getMultiple(context, {
				versionId: document.version_id,
				collectionKey: document.collection_key,
			});
		if (bricksRes.error) return bricksRes;

		return {
			error: undefined,
			data: DocumentsFormatter.formatSingle({
				document: document,
				collection: collectionRes.data,
				bricks: bricksRes.data.bricks,
				fields: bricksRes.data.fields,
				config: context.config,
			}),
		};
	}

	return {
		error: undefined,
		data: DocumentsFormatter.formatSingle({
			document: document,
			collection: collectionRes.data,
			bricks: [],
			fields: [],
			config: context.config,
		}),
	};
};

export default getSingle;
