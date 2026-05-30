import { GoogleLogin } from "@react-oauth/google";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAccessTokenQuery from "@/hooks/useAccessTokenQuery";
import { useLogInMutation } from "@/hooks/useLogInMutation";
import { useLogOutMutation } from "@/hooks/useLogOutMutation";
import { useUserQuery } from "@/hooks/users";

export default function AccountMenu() {
	const { data: accessToken, isLoading } = useAccessTokenQuery();

	if (isLoading) {
		return <LoadingComponent loadingMessage="Checking login status..." />;
	}

	if (!accessToken) {
		return <LogInMenu />;
	}

	return <LogOutMenu />;
}

function LogInMenu() {
	const loginMutation = useLogInMutation();

	return (
		<div className="flex flex-col items-center">
			<GoogleLogin
				onSuccess={(response) => {
					// biome-ignore lint/style/noNonNullAssertion: The GoogleLogin response is guaranteed to have a credential
					loginMutation.mutate(response.credential!);
				}}
				onError={() => {
					console.error("Error logging in");
				}}
			/>
		</div>
	);
}

function LogOutMenu() {
	const { data: user, isFetching, error } = useUserQuery();
	const logoutMutation = useLogOutMutation();

	if (isFetching) {
		return <LoadingComponent loadingMessage="Fetching user..." />;
	}

	if (error || !user) {
		return <ErrorComponent errorMessage="Failed while fetching user" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer w-full">
				<User2 />
				{user.fullName}
				<ChevronUp className="ml-auto" />
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top">
				<DropdownMenuItem
					onClick={async () => await logoutMutation.mutateAsync()}
				>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
