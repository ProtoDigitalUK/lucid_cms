import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import Menu, { MenuItemT } from "@db/models/Menu";
// Schema
import menusSchema from "@schemas/menus";
// Services
import menuServices from "@services/menu";
// Format
import formatMenu from "@utils/format/format-menu";

export interface ServiceData {
  query: z.infer<typeof menusSchema.getMultiple.query>;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  const { filter, sort, include, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "key",
      "environment_key",
      "name",
      "description",
      "created_at",
      "updated_at",
    ],
    exclude: undefined,
    filter: {
      data: {
        ...filter,
        environment_key: data.environment_key,
      },
      meta: {
        name: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: sort,
    page: page,
    per_page: per_page,
  });

  const menus = await Menu.getMultiple(SelectQuery);

  let menuItems: MenuItemT[] = [];
  if (include && include.includes("items")) {
    menuItems = await menuServices.getItems({
      menu_ids: menus.data.map((menu) => menu.id),
    });
  }

  return {
    data: menus.data.map((menu) => formatMenu(menu, menuItems)),
    count: menus.count,
  };
};

export default getMultiple;
