import type { CollectionResponse } from "../../types/response.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type { MigrationStatus } from "../collection/get-collection-migration-status.js";

export default class CollectionsFormatter {
	formatMultiple = (props: {
		collections: CollectionBuilder[];
		include?: {
			bricks?: boolean;
			fields?: boolean;
			documentId?: boolean;
		};
		documents?: Array<{
			id: number;
			collection_key: string;
		}>;
	}) => {
		return props.collections.map((c) =>
			this.formatSingle({
				collection: c,
				include: props.include,
				documents: props.documents,
			}),
		);
	};
	formatSingle = (props: {
		collection: CollectionBuilder;
		migrationStatus?: MigrationStatus;
		include?: {
			bricks?: boolean;
			fields?: boolean;
			documentId?: boolean;
		};
		documents?: Array<{
			id?: number;
			collection_key: string;
		}>;
	}): CollectionResponse => {
		const collectionData = props.collection.getData;
		const key = props.collection.key;

		return {
			key: key,
			mode: collectionData.mode,
			documentId: props.include?.documentId
				? this.getDocumentId(key, props.documents)
				: undefined,
			details: {
				name: collectionData.details.name,
				singularName: collectionData.details.singularName,
				summary: collectionData.details.summary,
			},
			config: {
				useTranslations: collectionData.config.useTranslations,
				useDrafts: collectionData.config.useDrafts,
				useRevisions: collectionData.config.useRevisions,
				isLocked: collectionData.config.isLocked,
				displayInListing: props.collection.displayInListing,
				useAutoSave: collectionData.config.useAutoSave,
			},
			migrationStatus: props.migrationStatus ?? null,
			fixedBricks: props.include?.bricks
				? (props.collection.fixedBricks ?? [])
				: [],
			builderBricks: props.include?.bricks
				? (props.collection.builderBricks ?? [])
				: [],
			fields: props.include?.fields ? (props.collection.fieldTree ?? []) : [],
		};
	};
	private getDocumentId = (
		collectionKey: string,
		documents?: Array<{
			id?: number;
			collection_key: string;
		}>,
	) => {
		const document = documents?.find(
			(document) => document.collection_key === collectionKey,
		);

		return document?.id ?? undefined;
	};
}
