import { BrickBuilder } from "@protoheadless/headless";

const PageMetaBrick = new BrickBuilder("page_meta")
	.addText({
		key: "meta_title",
		title: "Meta Title",
	})
	.addTextarea({
		key: "meta_description",
		title: "Meta Description",
	});

export default PageMetaBrick;