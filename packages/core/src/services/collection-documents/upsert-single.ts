import T from "../../translations/index.js";
import collectionDocumentsServices from "./index.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import merge from "lodash.merge";
import type { BrickSchema } from "../../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../../schemas/collection-fields.js";
import type { ServiceFn } from "../../libs/services/types.js";

const upsertSingle: ServiceFn<
	[
		{
			collectionKey: string;
			userId: number;

			documentId?: number;
			bricks?: Array<BrickSchema>;
			fields?: Array<FieldSchemaType>;
		},
	],
	number
> = async (serviceConfig, data) => {
	const collectionRes =
		await collectionDocumentsServices.checks.checkCollection(
			serviceConfig,
			{
				key: data.collectionKey,
			},
		);
	if (collectionRes.error) return collectionRes;

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	if (data.documentId !== undefined) {
		const existingDocument = await CollectionDocumentsRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.documentId,
				},
				{
					key: "collection_key",
					operator: "=",
					value: data.collectionKey,
				},
			],
		});

		if (existingDocument === undefined) {
			return {
				error: {
					type: "basic",
					name: T("error_not_found_name", {
						name: T("document"),
					}),
					message: T("error_not_found_message", {
						name: T("document"),
					}),
					status: 404,
				},
				data: undefined,
			};
		}

		if (collectionRes.data.config.locked === true) {
			return {
				error: {
					type: "basic",
					name: T("error_locked_collection_name"),
					message: T("error_locked_collection_message", {
						name: collectionRes.data.data.title,
					}),
					status: 400,
				},
				data: undefined,
			};
		}
	}

	const checkDocumentCount =
		await collectionDocumentsServices.checks.checkSingleCollectionDocumentCount(
			serviceConfig,
			{
				collectionKey: data.collectionKey,
				collectionMode: collectionRes.data.data.mode,
				documentId: data.documentId,
			},
		);
	if (checkDocumentCount.error) return checkDocumentCount;

	const hookResponse = await executeHooks(
		{
			service: "collection-documents",
			event: "beforeUpsert",
			config: serviceConfig.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: serviceConfig.db,
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: data,
		},
	);
	const bodyData = merge(data, hookResponse);

	const document = await CollectionDocumentsRepo.upsertSingle({
		id: data.documentId,
		collectionKey: data.collectionKey,
		createdBy: data.userId,
		updatedBy: data.userId,
		isDeleted: 0,
	});

	if (document === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}

	const createMultipleBricks =
		await collectionDocumentBricksServices.createMultiple(serviceConfig, {
			documentId: document.id,
			bricks: bodyData.bricks,
			fields: bodyData.fields,
			collection: collectionRes.data,
		});
	if (createMultipleBricks.error) return createMultipleBricks;

	await executeHooks(
		{
			service: "collection-documents",
			event: "afterUpsert",
			config: serviceConfig.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: serviceConfig.db,
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: {
				documentId: document.id,
				bricks: bodyData.bricks,
				fields: bodyData.fields,
			},
		},
	);

	return {
		error: undefined,
		data: document.id,
	};
};

export default upsertSingle;
