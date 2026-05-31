import { useLocalStorage } from "usehooks-ts";

const ACCESS_TOKEN_KEY = "accessToken";

export function useAccessToken() {
	return useLocalStorage(ACCESS_TOKEN_KEY, "");
}
