import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone.functions-Cj7dUbGB.js
function formatAssignedPhone(e164) {
	const match = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
	if (!match) return e164;
	const [, area, prefix, line] = match;
	return `1(${area})${prefix}-${line}`;
}
var provisionPhoneNumber_createServerFn_handler = createServerRpc({
	id: "328cf899c02c22aaf215cecc118f83d0d6d31ff8882d1b4ffec8aba633cc01c2",
	name: "provisionPhoneNumber",
	filename: "src/utils/phone.functions.ts"
}, (opts) => provisionPhoneNumber.__executeServer(opts));
var provisionPhoneNumber = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!/^\d{3}$/.test(data.areaCode)) throw new Error("Area code must be exactly 3 digits");
	return data;
}).handler(provisionPhoneNumber_createServerFn_handler, async ({ data, context }) => {
	const { userId, supabase } = context;
	const { data: profile, error: profileError } = await supabase.from("profiles").select("assigned_phone, business_name").eq("id", userId).maybeSingle();
	if (profileError) {
		console.error("Failed to load profile before provisioning", {
			userId,
			error: profileError
		});
		throw new Error("Could not load your profile. Please try again.");
	}
	if (profile?.assigned_phone) return {
		phone: profile.assigned_phone,
		alreadyProvisioned: true
	};
	const retellApiKey = process.env.RETELL_API_KEY;
	if (!retellApiKey) throw new Error("RETELL_API_KEY is missing on the server");
	const response = await fetch("https://api.retellai.com/create-phone-number", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${retellApiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			area_code: Number(data.areaCode),
			inbound_agent_id: "agent_34a0e868acce3d45d684408992",
			nickname: profile?.business_name || "LeadCatch User"
		})
	});
	if (!response.ok) {
		const bodyText = await response.text();
		console.error("Retell phone provisioning failed", {
			userId,
			status: response.status,
			body: bodyText
		});
		throw new Error("Could not get a number for that area code — try a nearby one");
	}
	const retellResponse = await response.json();
	const phoneNumber = retellResponse.phone_number;
	const retellPhoneId = retellResponse.phone_number_id || retellResponse.id || phoneNumber;
	if (!phoneNumber) {
		console.error("Retell provisioning response missing required fields", {
			userId,
			response: retellResponse
		});
		throw new Error("Could not get a number for that area code — try a nearby one");
	}
	const formattedPhone = formatAssignedPhone(phoneNumber);
	const { error: updateError } = await supabase.from("profiles").update({
		assigned_phone: formattedPhone,
		retell_phone_id: retellPhoneId
	}).eq("id", userId);
	if (updateError) {
		console.error("Retell purchase succeeded but profile update failed", {
			userId,
			phoneNumber,
			error: updateError
		});
		throw new Error("Phone number was created but could not be saved. Please contact support.");
	}
	return {
		phone: formattedPhone,
		alreadyProvisioned: false
	};
});
//#endregion
export { provisionPhoneNumber_createServerFn_handler };
