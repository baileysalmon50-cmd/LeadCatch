globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as NodeResponse, i as defineLazyEventHandler, l as serve, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/add-lead-dialog-zL1Z_g--.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa4-CqnFvEPV1Bh22Pm1OKZltNlxtDw\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 2724,
		"path": "../public/assets/add-lead-dialog-zL1Z_g--.js"
	},
	"/assets/arrow-right-Cseobd3-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-tPrdTsC9sTtPDRImLDPReOx1slY\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 165,
		"path": "../public/assets/arrow-right-Cseobd3-.js"
	},
	"/assets/appointments-CXLUydq5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1618b-tYP5zV5fkTUSaOwlO4KDURq7W3A\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 90507,
		"path": "../public/assets/appointments-CXLUydq5.js"
	},
	"/assets/auth-middleware-Cm9zDJVd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116f-2ifykqO+dndIrWzEZxGPjEYwds8\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 4463,
		"path": "../public/assets/auth-middleware-Cm9zDJVd.js"
	},
	"/assets/auth-DE6HUxzC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dbe-d04oSeGW16MqwwQNqvhTTeJ/ym0\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 3518,
		"path": "../public/assets/auth-DE6HUxzC.js"
	},
	"/assets/bell-Da40fvxi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-Sw+QOrxKSFNXyYFZPRyCtVMU6bM\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 290,
		"path": "../public/assets/bell-Da40fvxi.js"
	},
	"/assets/calendar-days-B3YVN2im.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-1P9UIqxlwmimZeSWDobuciRXt4c\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 494,
		"path": "../public/assets/calendar-days-B3YVN2im.js"
	},
	"/assets/chart-column-tOf71Ekp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-wyo0sNTtnSzNsPOliYthNk0ALqk\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 251,
		"path": "../public/assets/chart-column-tOf71Ekp.js"
	},
	"/assets/card-DWRTYDQW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40b-W8VeN42hrKqI2nLxyYuOP5LG5kM\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 1035,
		"path": "../public/assets/card-DWRTYDQW.js"
	},
	"/assets/checkout.return-ohLM62Ue.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41f-GTbHEEhf4ihMyTZk0H0GgbZrzFc\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 1055,
		"path": "../public/assets/checkout.return-ohLM62Ue.js"
	},
	"/assets/check-cOqjefB5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-7uHFh/rd0YO3AANmyadhFjK3bOM\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 124,
		"path": "../public/assets/check-cOqjefB5.js"
	},
	"/assets/createLucideIcon-BXeNn-yJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f14-5APREEi0ecD08l7vxHYG76xBT9A\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 32532,
		"path": "../public/assets/createLucideIcon-BXeNn-yJ.js"
	},
	"/assets/clock-C4gJbkvM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-dF/mZj6tPg0IXjeZK4WIJY/0/Ns\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 169,
		"path": "../public/assets/clock-C4gJbkvM.js"
	},
	"/assets/credit-card-BA4fNe9f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-bbBpAwW4RoRVC1tiKOxdicbnj2M\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 207,
		"path": "../public/assets/credit-card-BA4fNe9f.js"
	},
	"/assets/dashboard-i_cjfmGW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"279a-Ghmna361bnKhDpsEo8oUHDN0XhI\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 10138,
		"path": "../public/assets/dashboard-i_cjfmGW.js"
	},
	"/assets/dialog-NAzaVZN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a8-zudM0MDBbMTVXJMxigMxTFqLaEg\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 6312,
		"path": "../public/assets/dialog-NAzaVZN2.js"
	},
	"/assets/dist-B4d_Lhja.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"239-RmkJtPPAB1tsTFk6YPCH4B4yS5k\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 569,
		"path": "../public/assets/dist-B4d_Lhja.js"
	},
	"/assets/dist-B_WATbMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e6-HdfQtUmPS5YFzK1GnqWss6XHFjM\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 4582,
		"path": "../public/assets/dist-B_WATbMC.js"
	},
	"/assets/download-BJFcff6N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-PlaP8wdU/2STCWZSSLFEeJg5h3w\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 232,
		"path": "../public/assets/download-BJFcff6N.js"
	},
	"/assets/es2015-Dd_nu5lm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"515d-wZofTNu7rMNolvX/2Z7ptY4NU6E\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 20829,
		"path": "../public/assets/es2015-Dd_nu5lm.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/label-CKZLJ00T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"465-WTqJYnpJAjeac58ZuY/nuWSGFOg\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 1125,
		"path": "../public/assets/label-CKZLJ00T.js"
	},
	"/assets/leads-DUvYUiXt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3462-vDfdwQ0BhWDDnMI5XwYIkZMmzD0\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 13410,
		"path": "../public/assets/leads-DUvYUiXt.js"
	},
	"/assets/analytics-CsleXLRA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6403e-b98FepyvtmeoX7+249JY3A5fB7o\"",
		"mtime": "2026-07-16T01:57:21.656Z",
		"size": 409662,
		"path": "../public/assets/analytics-CsleXLRA.js"
	},
	"/assets/index-zxTjxqyf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"94270-83fQtKsBkh8vow5lS/sbWEU+KGk\"",
		"mtime": "2026-07-16T01:57:21.655Z",
		"size": 606832,
		"path": "../public/assets/index-zxTjxqyf.js"
	},
	"/assets/link-BvodxWot.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8994-PPpJP3PlmxbkWiNahgq3dGWkcss\"",
		"mtime": "2026-07-16T01:57:21.657Z",
		"size": 35220,
		"path": "../public/assets/link-BvodxWot.js"
	},
	"/assets/logo-B7ZPBhTP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a8-awlXWFb3j+aWhQM2Vm44GUvh17E\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 936,
		"path": "../public/assets/logo-B7ZPBhTP.js"
	},
	"/assets/onboarding-CoM3VoC8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d65-QucQ9hvw4dCsjZbHzksklVCODfE\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 11621,
		"path": "../public/assets/onboarding-CoM3VoC8.js"
	},
	"/assets/payments.functions-Bn8Nd7a0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c7-yjRy2gv3ONwMK680IM3+7o+NFq4\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 455,
		"path": "../public/assets/payments.functions-Bn8Nd7a0.js"
	},
	"/assets/phone-BBnN8o8U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-C6C04dMWXFhx5fGXVlrsDYkRxpQ\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 322,
		"path": "../public/assets/phone-BBnN8o8U.js"
	},
	"/assets/phone-off-DFBpt7Xd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c0-j7NFSATYaTeuoD0hGZbAVxf7M9k\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 448,
		"path": "../public/assets/phone-off-DFBpt7Xd.js"
	},
	"/assets/prop-types-YhqGBo7c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"323-Ftx552yr/sUbfPjidaabBR5FFCE\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 803,
		"path": "../public/assets/prop-types-YhqGBo7c.js"
	},
	"/assets/redirect-C-eRQtnH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d-XWldT6wFIL00QHpfP609loBAcNQ\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 557,
		"path": "../public/assets/redirect-C-eRQtnH.js"
	},
	"/assets/reset-password-CmL4NmXt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56e-wRL7Hlf7yiV4MDEAhPE1a1ezTxQ\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 1390,
		"path": "../public/assets/reset-password-CmL4NmXt.js"
	},
	"/assets/route-DhlLPRtI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108a-dw7bnF8AIIlZaS+kt7pvN3yMw74\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 4234,
		"path": "../public/assets/route-DhlLPRtI.js"
	},
	"/assets/pricing-CDKmWogI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4abe-8A3ZkcFE8C2KIXA3+uV3RhwKO6A\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 19134,
		"path": "../public/assets/pricing-CDKmWogI.js"
	},
	"/assets/select-Cevyuxwk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3e7-61A8l9UQJB5whz/WD5+MjymNGqI\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 50151,
		"path": "../public/assets/select-Cevyuxwk.js"
	},
	"/assets/settings-BoDDEeCn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5190-uH0L8ukPifgaoYozaWTti/yXESA\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 20880,
		"path": "../public/assets/settings-BoDDEeCn.js"
	},
	"/assets/status-badge-Co6k1pOH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"655-4+IA8w4t3w8M3ePn9+/A4/JFxSc\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 1621,
		"path": "../public/assets/status-badge-Co6k1pOH.js"
	},
	"/assets/stripe-QGaUrOIo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c96-PBAq1/97NRWZzDgnrLia2OGWgHY\"",
		"mtime": "2026-07-16T01:57:21.659Z",
		"size": 3222,
		"path": "../public/assets/stripe-QGaUrOIo.js"
	},
	"/assets/styles-CPtacmZ6.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1577c-ITzDX+6yOJgqseJhXB2qII2iuzU\"",
		"mtime": "2026-07-16T01:57:21.659Z",
		"size": 87932,
		"path": "../public/assets/styles-CPtacmZ6.css"
	},
	"/assets/textarea-CYCCcmsR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"258-N0qn94Y1+oQf88hFclzakdH7x9o\"",
		"mtime": "2026-07-16T01:57:21.659Z",
		"size": 600,
		"path": "../public/assets/textarea-CYCCcmsR.js"
	},
	"/assets/trash-2-DT566Xz9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-hTe2HTQV+0BS0WLGJSrcje9/VEw\"",
		"mtime": "2026-07-16T01:57:21.659Z",
		"size": 328,
		"path": "../public/assets/trash-2-DT566Xz9.js"
	},
	"/assets/users-Bj00_O-y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-T9pHTFBlbi65wLrTlD8J734Zalo\"",
		"mtime": "2026-07-16T01:57:21.659Z",
		"size": 306,
		"path": "../public/assets/users-Bj00_O-y.js"
	},
	"/assets/routes-NvCPvvNe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2215-7P7FLAc41DFO86cZU6hOBeIYd80\"",
		"mtime": "2026-07-16T01:57:21.658Z",
		"size": 8725,
		"path": "../public/assets/routes-NvCPvvNe.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_7Q2Af5 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_7Q2Af5
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
