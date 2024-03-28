import { type Migration } from "kysely";
import type { FieldTypesT } from "../field-builder/types.js";

// ------------------------------------------------------------------------------
// Migration / Adapters

export enum AdapterType {
	SQLITE = 0,
	POSTGRES = 1,
	LIBSQL = 2,
}

export type MigrationFn = (adapter: AdapterType) => Migration;

// ------------------------------------------------------------------------------
// Column types

export type Timestamp = string; // TODO: may not be correct
export type BooleanInt = 0 | 1;
export type JSONString = string;

// ------------------------------------------------------------------------------
// Tables

export interface HeadlessLanguages {
	id: number | null;
	code: string;
	is_default: BooleanInt;
	is_enabled: BooleanInt;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessTranslationKeys {
	id: number | null;
}

export interface HeadlessTranslations {
	id: number | null;
	translation_key_id: number;
	language_id: number;
	value: string | null;
}

export interface HeadlessOptions {
	name: string;
	value_int: number | null;
	value_text: string | null;
	value_bool: BooleanInt | null;
}

export interface HeadlessUsers {
	id: number | null;
	super_admin: BooleanInt;
	email: string;
	username: string;
	first_name: string | null;
	last_name: string | null;
	password: string;
	is_deleted: BooleanInt | null;
	is_deleted_at: Timestamp | null;
	deleted_by: number | null;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessRoles {
	id: number | null;
	name: string;
	description: string | null;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessRolePermissions {
	id: number | null;
	role_id: number | null;
	permission: string;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessUserRoles {
	id: number | null;
	user_id: number | null;
	role_id: number | null;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessUserTokens {
	id: number | null;
	user_id: number | null;
	token_type: string;
	token: string;
	created_at: Timestamp | null;
	expiry_date: Timestamp;
}

export interface HeadlessEmails {
	id: number | null;
	email_hash: string;
	from_address: string;
	from_name: string;
	to_address: string;
	subject: string;
	cc: string | null;
	bcc: string | null;
	delivery_status: "pending" | "delivered" | "failed";
	template: string;
	data: JSONString | null;
	type: "internal" | "external";
	sent_count: number;
	error_count: number;
	last_error_message: string | null;
	last_attempt_at: Timestamp | null;
	last_success_at: Timestamp | null;
	created_at: Timestamp | null;
}

export interface HeadlessMedia {
	id: number | null;
	key: string;
	e_tag: string | null;
	visible: BooleanInt;
	type: string;
	mime_type: string;
	file_extension: string;
	file_size: number;
	width: number | null;
	height: number | null;
	title_translation_key_id: number | null;
	alt_translation_key_id: number | null;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessProcessedImages {
	key: string;
	media_key: string | null;
}

export interface HeadlessCollectionDocuments {
	id: number | null;
	collection_key: string;
	parent_id: number | null;
	slug: string | null;
	full_slug: string | null;
	homepage: BooleanInt;
	is_deleted: BooleanInt;
	is_deleted_at: Timestamp | null;
	author_id: number | null;
	deleted_by: number | null;
	created_by: number | null;
	updated_by: number | null;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessCollectionDocumentBricks {
	id: number | null;
	collection_document_id: number;
	brick_type: "builder" | "fixed" | "collection-fields";
	brick_key: string | null;
	brick_order: number | null;
}

export interface HeadlessCollectionDocumentGroups {
	group_id: number | null;
	collection_document_id: number;
	collection_brick_id: number;
	parent_group_id: number | null;
	language_id: number;
	repeater_key: string;
	group_order: number;
	ref: string | null;
}

export interface HeadlessCollectionDocumentFields {
	fields_id: number | null;
	collection_document_id: number;
	collection_brick_id: number;
	group_id: number | null;
	language_id: number;
	key: string;
	type: FieldTypesT;
	text_value: string | null;
	int_value: number | null;
	bool_value: BooleanInt | null;
	json_value: JSONString | null;
	page_link_id: number | null;
	media_id: number | null;
}

export interface HeadlessCollectionCategories {
	id: number | null;
	collection_key: string;
	title_translation_key_id: number | null;
	description_translation_key_id: number | null;
	slug: string;
	created_at: Timestamp | null;
	updated_at: Timestamp | null;
}

export interface HeadlessCollectionDocumentCategories {
	collection_document_id: number;
	category_id: number;
}

// ------------------------------------------------------------------------------
// Database

export interface HeadlessDB {
	headless_languages: HeadlessLanguages;
	headless_translation_keys: HeadlessTranslationKeys;
	headless_translations: HeadlessTranslations;
	headless_options: HeadlessOptions;
	headless_users: HeadlessUsers;
	headless_roles: HeadlessRoles;
	headless_role_permissions: HeadlessRolePermissions;
	headless_user_roles: HeadlessUserRoles;
	headless_user_tokens: HeadlessUserTokens;
	headless_emails: HeadlessEmails;
	headless_media: HeadlessMedia;
	headless_processed_images: HeadlessProcessedImages;
	headless_collection_documents: HeadlessCollectionDocuments;
	headless_collection_document_bricks: HeadlessCollectionDocumentBricks;
	headless_collection_document_groups: HeadlessCollectionDocumentGroups;
	headless_collection_document_fields: HeadlessCollectionDocumentFields;
	headless_collection_categories: HeadlessCollectionCategories;
	headless_collection_document_categories: HeadlessCollectionDocumentCategories;
}
