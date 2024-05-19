import T from "@/translations";
import { type Component, Index } from "solid-js";
import { FaSolidT, FaSolidCalendar, FaSolidEnvelope } from "solid-icons/fa";
import api from "@/services/api";
import useRowTarget from "@/hooks/useRowTarget";
import type useSearchParams from "@/hooks/useSearchParams";
import Table from "@/components/Groups/Table";
import UserRow from "@/components/Tables/Rows/UserRow";
import UpdateUserPanel from "@/components/Panels/User/UpdateUserPanel";
import DeleteUser from "@/components/Modals/User/DeleteRole";

interface UsersTableProps {
	searchParams: ReturnType<typeof useSearchParams>;
}

const UsersTable: Component<UsersTableProps> = (props) => {
	// ----------------------------------
	// Hooks
	const rowTarget = useRowTarget({
		triggers: {
			update: false,
			delete: false,
		},
	});

	// ----------------------------------
	// Queries
	const users = api.users.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
			exclude: {
				current: true,
			},
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Table.Root
				key={"users.list"}
				rows={users.data?.data.length || 0}
				meta={users.data?.meta}
				searchParams={props.searchParams}
				head={[
					{
						label: T()("username"),
						key: "username",
						icon: <FaSolidT />,
					},
					{
						label: T()("first_name"),
						key: "firstName",
						icon: <FaSolidT />,
					},
					{
						label: T()("last_name"),
						key: "lastName",
						icon: <FaSolidT />,
					},
					{
						label: T()("super_admin"),
						key: "superAdmin",
						icon: <FaSolidT />,
					},
					{
						label: T()("email"),
						key: "email",
						icon: <FaSolidEnvelope />,
					},
					{
						label: T()("created_at"),
						key: "createdAt",
						icon: <FaSolidCalendar />,
						sortable: true,
					},
				]}
				state={{
					isLoading: users.isLoading,
					isError: users.isError,
					isSuccess: users.isSuccess,
				}}
				options={{
					isSelectable: false,
				}}
				callbacks={{
					deleteRows: async () => {
						alert("Delete rows");
					},
				}}
			>
				{({ include, isSelectable, selected, setSelected }) => (
					<Index each={users.data?.data || []}>
						{(user, i) => (
							<UserRow
								index={i}
								user={user()}
								include={include}
								selected={selected[i]}
								rowTarget={rowTarget}
								options={{
									isSelectable,
								}}
								callbacks={{
									setSelected: setSelected,
								}}
							/>
						)}
					</Index>
				)}
			</Table.Root>
			<UpdateUserPanel
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().update,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("update", state);
					},
				}}
			/>
			<DeleteUser
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
			/>
		</>
	);
};

export default UsersTable;
