import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-a0HX1RP9.js
function createSupabaseClient() {
	return createClient("https://bdgeiyyqxvbrajyzbrlc.supabase.co", "sb_publishable_USQVcBfpE-b_nbB4XpTzSw_FvHRDoXv", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
