import T from "../../translations/index.js";
import { LucidError } from "../../utils/errors/index.js";
import type { KyselyDB } from "../db/types.js";
// Repositories
import UserTokensRepository from "./user-tokens.js";
import CollectionDocumentBricksRepo from "./collection-document-bricks.js";
import CollectionDocumentFieldsRepo from "./collection-document-fields.js";
import CollectionDocumentGroupsRepo from "./collection-document-groups.js";
import CollectionDocumentVersionsRepo from "./collection-document-versions.js";
import CollectionDocumentsRepo from "./collection-documents.js";
import EmailsRepository from "./emails.js";
import LocalesRepository from "./locales.js";
import MediaRepository from "./media.js";
import MediaAwaitingSyncRepository from "./media-awaiting-sync.js";
import OptionsRepository from "./options.js";
import ProcessedImagesRepository from "./processed-images.js";
import RolePermissionsRepository from "./role-permissions.js";
import RolesRepository from "./roles.js";
import TranslationKeysRepository from "./translation-keys.js";
import TranslationsRepository from "./translations.js";
import UserRolesRepository from "./user-roles.js";
import UsersRepository from "./users.js";
import ClientIntegrationsRepository from "./client-integrations.js";
import CollectionsRepository from "./collections.js";
import CollectionMigrationsRepository from "./collection-migrations.js";
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
				return new UserTokensRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collections":
				return new CollectionsRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "collection-migrations":
				return new CollectionMigrationsRepository(
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
				return new EmailsRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "locales":
				return new LocalesRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "media":
				return new MediaRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "media-awaiting-sync":
				return new MediaAwaitingSyncRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "options":
				return new OptionsRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "processed-images":
				return new ProcessedImagesRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "role-permissions":
				return new RolePermissionsRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "roles":
				return new RolesRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "translation-keys":
				return new TranslationKeysRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "translations":
				return new TranslationsRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "user-roles":
				return new UserRolesRepository(
					db,
					dbAdapter,
				) as RepositoryReturnType<T>;
			case "users":
				return new UsersRepository(db, dbAdapter) as RepositoryReturnType<T>;
			case "client-integrations":
				return new ClientIntegrationsRepository(
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
	"user-tokens": UserTokensRepository;
	collections: CollectionsRepository;
	"collection-migrations": CollectionMigrationsRepository;
	"collection-document-bricks": CollectionDocumentBricksRepo;
	"collection-document-fields": CollectionDocumentFieldsRepo;
	"collection-document-groups": CollectionDocumentGroupsRepo;
	"collection-document-versions": CollectionDocumentVersionsRepo;
	"collection-documents": CollectionDocumentsRepo;
	emails: EmailsRepository;
	locales: LocalesRepository;
	media: MediaRepository;
	"media-awaiting-sync": MediaAwaitingSyncRepository;
	options: OptionsRepository;
	"processed-images": ProcessedImagesRepository;
	"role-permissions": RolePermissionsRepository;
	roles: RolesRepository;
	"translation-keys": TranslationKeysRepository;
	translations: TranslationsRepository;
	"user-roles": UserRolesRepository;
	users: UsersRepository;
	"client-integrations": ClientIntegrationsRepository;
};

type RepositoryReturnType<T extends keyof RepositoryClassMap> =
	RepositoryClassMap[T];

export default Repository;
