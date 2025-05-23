import type { CollectionResponse } from "../../types/response.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";

export default class CollectionsFormatter {
	formatMultiple = (props: {
		collections: CollectionBuilder[];
		include?: {
			bricks?: boolean;
			fields?: boolean;
			document_id?: boolean;
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
		include?: {
			bricks?: boolean;
			fields?: boolean;
			document_id?: boolean;
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
			documentId: props.include?.document_id
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
			},
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
