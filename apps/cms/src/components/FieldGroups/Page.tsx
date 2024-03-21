import T from "@/translations";
import {
	Component,
	createMemo,
	Show,
	Accessor,
	Setter,
	Switch,
	Match,
	For,
} from "solid-js";
import slugify from "slugify";
// Stores
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { LanguageResT } from "@headless/types/src/language";
import type { APIErrorResponse } from "@/types/api";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { PagesResT } from "@headless/types/src/multiple-page";
import type { CollectionResT } from "@headless/types/src/collections";
import type { CategoryResT } from "@headless/types/src/categories";
// Utils
import helpers from "@/utils/helpers";
// Components
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import PageSearchSelect from "@/components/Partials/SearchSelects/PageSearchSelect";
import ValidParentPageSearchSelect from "@/components/Partials/SearchSelects/ValidParentPageSearchSelect";
import UserSearchSelect from "@/components/Partials/SearchSelects/UserSearchSelect";

interface PageFieldGroupProps {
	mode: "create" | "update";
	theme?: "basic";
	showTitles: boolean;
	state: {
		pageId?: Accessor<number | undefined>;
		contentLanguage?: Accessor<number | undefined>;
		mutateErrors: Accessor<APIErrorResponse | undefined>;
		collection: CollectionResT;
		categories: CategoryResT[];
		// Page Details
		getTitleTranslations: Accessor<PagesResT["title_translations"]>;
		getExcerptTranslations: Accessor<PagesResT["excerpt_translations"]>;
		getSlug: Accessor<string | null>;
		getParentId: Accessor<number | undefined>;
		getIsHomepage: Accessor<boolean>;
		getSelectedCategories: Accessor<SelectMultipleValueT[]>;
		getSelectedAuthor: Accessor<number | undefined>;
	};
	setState: {
		// Page Details
		setTitleTranslations: Setter<PagesResT["title_translations"]>;
		setExcerptTranslations: Setter<PagesResT["excerpt_translations"]>;
		setSlug: Setter<string | null>;
		setParentId: Setter<number | undefined>;
		setIsHomepage: Setter<boolean>;
		setSelectedCategories: Setter<SelectMultipleValueT[]>;
		setSelectedAuthor: Setter<number | undefined>;
	};
}

const PageFieldGroup: Component<PageFieldGroupProps> = (props) => {
	// ------------------------------
	// Memos
	const languages = createMemo(() => contentLanguageStore.get.languages);
	const hideSlugInput = createMemo(() => {
		if (props.mode === "create") return false;
		return props.state.getIsHomepage();
	});
	const hideSetParentPage = createMemo(() => {
		return (
			props.state.collection.disable_homepages === true ||
			props.state.getIsHomepage()
		);
	});

	// ------------------------------
	// Functions
	const inputError = (index: number) => {
		const titleErrors =
			props.state.mutateErrors()?.errors?.body?.title_translations
				?.children;
		const excerptErrors =
			props.state.mutateErrors()?.errors?.body?.excerpt_translations
				?.children;
		if (titleErrors) return titleErrors[index];
		if (excerptErrors) return excerptErrors[index];
		return undefined;
	};
	const setSlugFromTitle = (language_id: number) => {
		if (props.state.getSlug()) return;
		if (props.state.getIsHomepage()) return;
		const item = props.state.getTitleTranslations().find((t) => {
			return t.language_id === language_id;
		});

		if (!item?.value) return;
		const slugValue = slugify(item.value, { lower: true });
		props.setState.setSlug(slugValue);
	};

	// ------------------------------
	// Render
	return (
		<>
			<For each={languages()}>
				{(language, index) => (
					<Show
						when={
							language.id ===
							(props.state.contentLanguage !== undefined
								? props.state.contentLanguage()
								: undefined)
						}
					>
						<Show when={props.showTitles}>
							<SectionHeading
								title={T("details_lang", {
									code: `${language.code}`,
								})}
							/>
						</Show>
						<Form.Input
							id="name"
							value={
								props.state.getTitleTranslations().find((t) => {
									return t.language_id === language.id;
								})?.value || ""
							}
							onChange={(value) =>
								helpers.updateTranslation(
									props.setState.setTitleTranslations,
									{
										language_id: language.id,
										value,
									},
								)
							}
							name={"title"}
							type="text"
							copy={{
								label: T("title"),
							}}
							onBlur={() => setSlugFromTitle(language.id)}
							errors={inputError(index())?.title}
							required={language.is_default}
							theme={props.theme}
						/>
						<Form.Textarea
							id="excerpt"
							value={
								props.state
									.getExcerptTranslations()
									.find((t) => {
										return t.language_id === language.id;
									})?.value || ""
							}
							onChange={(value) =>
								helpers.updateTranslation(
									props.setState.setExcerptTranslations,
									{
										language_id: language.id,
										value,
									},
								)
							}
							name={"excerpt"}
							copy={{
								label: T("excerpt"),
							}}
							errors={inputError(index())?.excerpt}
							theme={props.theme}
						/>
					</Show>
				)}
			</For>
			<Show when={props.showTitles}>
				<SectionHeading title={T("meta")} />
			</Show>
			<Show when={!hideSlugInput()}>
				<Form.Input
					id="slug"
					value={props.state.getSlug() || ""}
					onChange={(value) => props.setState.setSlug(value)}
					name={"slug"}
					type="text"
					copy={{
						label: T("slug"),
						tooltip: T("page_slug_description"),
					}}
					errors={props.state.mutateErrors()?.errors?.body?.slug}
					required={true}
					theme={props.theme}
				/>
			</Show>
			<Show when={props.state.collection.disable_homepages !== true}>
				<Form.Checkbox
					id="homepage"
					value={props.state.getIsHomepage()}
					onChange={(value) => {
						props.setState.setIsHomepage(value);
						if (props.mode === "create") return;
						props.setState.setSlug(null);
					}}
					name={"homepage"}
					copy={{
						label: T("is_homepage"),
						tooltip: T("is_homepage_description"),
					}}
					errors={props.state.mutateErrors()?.errors?.body?.homepage}
					theme={props.theme}
				/>
			</Show>
			<Show when={!hideSetParentPage()}>
				<Switch>
					<Match when={props.mode === "create"}>
						<PageSearchSelect
							id="parent_id"
							name="parent_id"
							collectionKey={props.state.collection.key}
							value={props.state.getParentId()}
							setValue={props.setState.setParentId}
							copy={{
								label: T("parent_page"),
							}}
							errors={
								props.state.mutateErrors()?.errors?.body
									?.parent_id
							}
							theme={props.theme}
						/>
					</Match>
					<Match when={props.mode === "update"}>
						<ValidParentPageSearchSelect
							pageId={props.state.pageId?.() as number}
							id="parent_id"
							name="parent_id"
							collectionKey={props.state.collection.key}
							value={props.state.getParentId()}
							setValue={props.setState.setParentId}
							copy={{
								label: T("parent_page"),
							}}
							errors={
								props.state.mutateErrors()?.errors?.body
									?.parent_id
							}
							theme={props.theme}
						/>
					</Match>
				</Switch>
			</Show>
			<Form.SelectMultiple
				id="category_ids"
				values={props.state.getSelectedCategories()}
				onChange={props.setState.setSelectedCategories}
				name={"category_ids"}
				copy={{
					label: T("categories"),
				}}
				options={
					props.state.categories.map((cat) => {
						return {
							value: cat.id,
							label: cat.title_translations.find(
								(t) => t.language_id === 1,
							)?.value as string,
						};
					}) || []
				}
				errors={props.state.mutateErrors()?.errors?.body?.category_ids}
				theme={props.theme}
			/>
			<Show when={props.mode === "update"}>
				<UserSearchSelect
					id="author_id"
					name="author_id"
					value={props.state.getSelectedAuthor()}
					setValue={props.setState.setSelectedAuthor}
					copy={{
						label: T("author"),
					}}
					errors={props.state.mutateErrors()?.errors?.body?.author_id}
					theme={props.theme}
				/>
			</Show>
		</>
	);
};

export const setDefualtTranslations = (data: {
	translations: PagesResT["title_translations"];
	languages: LanguageResT[];
}) => {
	const translationsValues = JSON.parse(
		JSON.stringify(data.translations),
	) as PagesResT["title_translations"];

	const languagesValues = data.languages;
	for (let i = 0; i < languagesValues.length; i++) {
		const language = languagesValues[i];
		const translation = translationsValues.find((t) => {
			return t.language_id === language.id;
		});
		if (!translation) {
			const item: PagesResT["title_translations"][0] = {
				value: null,
				language_id: language.id,
			};
			translationsValues.push(item);
		}
	}

	return translationsValues;
};

export default PageFieldGroup;