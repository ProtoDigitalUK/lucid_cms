import T from "@/translations";
import type { Component, Accessor } from "solid-js";
import Modal from "@/components/Groups/Modal";
import type { CollectionResponse } from "@lucidcms/core/types";
import api from "@/services/api";

interface PublishDocumentProps {
	id: Accessor<number | undefined> | number | undefined;
	draftVersionId: Accessor<number | undefined> | number | undefined;
	collection: CollectionResponse;
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
	callbacks?: {
		onSuccess?: () => void;
	};
}

const PublishDocument: Component<PublishDocumentProps> = (props) => {
	// ----------------------------------------
	// Mutations
	const publishDocument = api.collections.document.usePromoteSingle({
		onSuccess: () => {
			props.state.setOpen(false);
			if (props.callbacks?.onSuccess) props.callbacks.onSuccess();
		},
		getCollectionName: () =>
			props.collection.details.singularName || T()("collection"),
		getVersionType: () => "published",
	});

	// ------------------------------
	// Render
	return (
		<Modal.Confirmation
			state={{
				open: props.state.open,
				setOpen: props.state.setOpen,
				isLoading: publishDocument.action.isPending,
				isError: publishDocument.action.isError,
			}}
			copy={{
				title: T()("publish_document_modal_title", {
					name: props.collection.details.singularName,
				}),
				description: T()("publish_document_modal_description", {
					name: props.collection.details.singularName.toLowerCase(),
				}),
				error: publishDocument.errors()?.message,
			}}
			callbacks={{
				onConfirm: () => {
					const id = typeof props.id === "function" ? props.id() : props.id;
					const draftId =
						typeof props.draftVersionId === "function"
							? props.draftVersionId()
							: props.draftVersionId;
					if (!id) return console.error("No id provided");
					if (!draftId) return console.error("No draft id provided");

					publishDocument.action.mutate({
						collectionKey: props.collection.key,
						id: id,
						versionId: draftId,
						body: {
							versionType: "published",
						},
					});
				},
				onCancel: () => {
					props.state.setOpen(false);
					publishDocument.reset();
				},
			}}
		/>
	);
};

export default PublishDocument;
