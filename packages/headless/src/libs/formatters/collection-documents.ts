import type {
	BrickResT,
	FieldResT,
	CollectionDocumentResT,
} from "../../types/response.js";
import CollectionDocumentFieldsFormatter, {
	type FieldPropT,
} from "./collection-document-fields.js";
import type { CollectionBuilderT } from "../builders/collection-builder/index.js";
import Formatter from "./index.js";
import CollectionDocumentBricksFormatter from "./collection-document-bricks.js";

interface DocumentPropT {
	id: number;
	collection_key: string | null;
	created_by: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
	fields?: FieldPropT[];
}

export default class CollectionDocumentsFormatter {
	formatMultiple = (props: {
		documents: DocumentPropT[];
		collection: CollectionBuilderT;
		host: string;
	}) => {
		return props.documents.map((d) =>
			this.formatSingle({
				document: d,
				collection: props.collection,
				host: props.host,
			}),
		);
	};
	formatSingle = (props: {
		document: DocumentPropT;
		collection: CollectionBuilderT;
		bricks?: BrickResT[];
		fields?: FieldResT[] | null;
		host: string;
	}): CollectionDocumentResT => {
		let fields: FieldResT[] | null = null;
		if (props.fields) {
			fields = props.fields;
		} else if (props.document.fields) {
			fields = new CollectionDocumentFieldsFormatter().formatMultiple({
				fields: props.document.fields,
				host: props.host,
				builder: props.collection,
			});
		}

		const res: CollectionDocumentResT = {
			id: props.document.id,
			collection_key: props.document.collection_key,
			bricks: props.bricks || [],
			fields: fields,
			created_by: props.document.created_by,
			created_at: Formatter.formatDate(props.document.created_at),
			updated_at: Formatter.formatDate(props.document.updated_at),
			author: null,
		};

		if (props.document.author_id) {
			res.author = {
				id: props.document.author_id,
				email: props.document.author_email,
				first_name: props.document.author_first_name,
				last_name: props.document.author_last_name,
				username: props.document.author_username,
			};
		}

		return res;
	};
	static swagger = {
		type: "object",
		properties: {
			id: {
				type: "number",
			},
			collection_key: {
				type: "string",
				nullable: true,
			},
			author: {
				type: "object",
				properties: {
					id: {
						type: "number",
						nullable: true,
					},
					email: {
						type: "string",
						nullable: true,
					},
					first_name: {
						type: "string",
						nullable: true,
					},
					last_name: {
						type: "string",
						nullable: true,
					},
					username: {
						type: "string",
						nullable: true,
					},
				},
				nullable: true,
			},
			bricks: {
				type: "array",
				items: CollectionDocumentBricksFormatter.swagger,
			},
			fields: {
				type: "array",
				nullable: true,
				items: CollectionDocumentFieldsFormatter.swagger,
			},
			created_by: {
				type: "number",
				nullable: true,
			},
			created_at: {
				type: "string",
				nullable: true,
			},
			updated_at: {
				type: "string",
				nullable: true,
			},
		},
	};
}
