import T from "../../translations/index.js";
import { LucidError } from "../../utils/errors/index.js";
import type { KyselyDB } from "../db/types.js";
// Repositories
import UserTokensRepo from "./user-tokens.js";
import CollectionDocumentBricksRepo from "./collection-document-bricks.js";
import CollectionDocumentFieldsRepo from "./collection-document-fields.js";
import CollectionDocumentGroupsRepo from "./collection-document-groups.js";
import CollectionDocumentVersionsRepo from "./collection-document-versions.js";
import CollectionDocumentsRepo from "./collection-documents.js";
import EmailsRepo from "./emails.js";
import LocalesRepo from "./locales.js";
import MediaRepo from "./media.js";
import MediaAwaitingSyncRepo from "./media-awaiting-sync.js";
import OptionsRepo from "./options.js";
import ProcessedImagesRepo from "./processed-images.js";
import RolePermissionsRepo from "./role-permissions.js";
import RolesRepo from "./roles.js";
import TranslationKeysRepo from "./translation-keys.js";
import TranslationsRepo from "./translations.js";
import UserRolesRepo from "./user-roles.js";
import UsersRepo from "./users.js";
import ClientIntegrationsRepo from "./client-integrations.js";
import CollectionsRepo from "./collections.js";
import CollectionMigrationsRepo from "./collection-migrations.js";
import type DatabaseAdapter from "../db/adapter.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Repository {
	static get<T extends keyof RepositoryClassMap>(
		repository: T,
		db: KyselyDB,
		dbAdapter: DatabaseAdapter,
	): RepositoryReturnType<T> {
		switch (repository) {
			case "user-tokens":
				return new UserTokensRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "collections":
				return new CollectionsRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "collection-migrations":
				return new CollectionMigrationsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-document-bricks":
				return new CollectionDocumentBricksRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-document-fields":
				return new CollectionDocumentFieldsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-document-groups":
				return new CollectionDocumentGroupsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-document-versions":
				return new CollectionDocumentVersionsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-documents":
				return new CollectionDocumentsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "emails":
				return new EmailsRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "locales":
				return new LocalesRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "media":
				return new MediaRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "media-awaiting-sync":
				return new MediaAwaitingSyncRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "options":
				return new OptionsRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "processed-images":
				return new ProcessedImagesRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "role-permissions":
				return new RolePermissionsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "roles":
				return new RolesRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "translation-keys":
				return new TranslationKeysRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "translations":
				return new TranslationsRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "user-roles":
				return new UserRolesRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "users":
				return new UsersRepo(db, dbAdapter) as RepositoryReturnType<T>;
			case "client-integrations":
				return new ClientIntegrationsRepo(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			default:
				throw new LucidError({
					message: T("cannot_find_repository", {
						name: repository,
					}),
				});
		}
	}
}

type RepositoryClassMap = {
	"user-tokens": UserTokensRepo;
	collections: CollectionsRepo;
	"collection-migrations": CollectionMigrationsRepo;
	"collection-document-bricks": CollectionDocumentBricksRepo;
	"collection-document-fields": CollectionDocumentFieldsRepo;
	"collection-document-groups": CollectionDocumentGroupsRepo;
	"collection-document-versions": CollectionDocumentVersionsRepo;
	"collection-documents": CollectionDocumentsRepo;
	emails: EmailsRepo;
	locales: LocalesRepo;
	media: MediaRepo;
	"media-awaiting-sync": MediaAwaitingSyncRepo;
	options: OptionsRepo;
	"processed-images": ProcessedImagesRepo;
	"role-permissions": RolePermissionsRepo;
	roles: RolesRepo;
	"translation-keys": TranslationKeysRepo;
	translations: TranslationsRepo;
	"user-roles": UserRolesRepo;
	users: UsersRepo;
	"client-integrations": ClientIntegrationsRepo;
};

type RepositoryReturnType<T extends keyof RepositoryClassMap> =
	RepositoryClassMap[T];

export default Repository;
