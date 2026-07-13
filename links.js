import { writeFileSync } from "node:fs";
import path from "node:path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const linkSvgPaths = {
	portfolio: path.resolve(__dirname, "portfolio.svg"),
	space: path.resolve(__dirname, "space.svg"),
};
const linkFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const escapeXml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const linkIcons = {
	portfolio: `<path d="M34 34h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4V38a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
	<path d="M39 34v-4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
	<path d="M30 42h28" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
	<path d="M44 41v4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`,
	space: `<path d="M44 27l2.6 7.4L54 37l-7.4 2.6L44 47l-2.6-7.4L34 37l7.4-2.6L44 27Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
	<path d="M31 48c7.5 5.5 20.3 1.2 27-9.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
	<path d="M57 29c-7.5-5.5-20.3-1.2-27 9.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`,
};

const createLinkSvg = ({ id, label, domain, accentColor, icon }) => `<svg width="360" height="76" viewBox="0 0 360 76" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc">
	<title id="${id}-title">${escapeXml(label)}</title>
	<desc id="${id}-desc">${escapeXml(domain)}</desc>
	<defs>
		<linearGradient id="${id}-line" x1="22" y1="12" x2="338" y2="64" gradientUnits="userSpaceOnUse">
			<stop stop-color="${accentColor}"/>
			<stop offset="1" stop-color="#d1242f"/>
		</linearGradient>
	</defs>
	<rect x="1" y="1" width="358" height="74" rx="14" fill="transparent" stroke="url(#${id}-line)" stroke-width="2"/>
	<g color="${accentColor}">
		${icon}
	</g>
	<text x="82" y="34" fill="${accentColor}" font-family="${linkFontFamily}" font-size="18" font-weight="700">${escapeXml(label)}</text>
	<text x="82" y="55" fill="#57606a" font-family="${linkFontFamily}" font-size="14">${escapeXml(domain)}</text>
	<path d="M314 31h12v12" stroke="${accentColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M326 31l-18 18" stroke="${accentColor}" stroke-width="2.4" stroke-linecap="round"/>
</svg>
`;

const writeLinkSvgs = () => {
	writeFileSync(
		linkSvgPaths.portfolio,
		createLinkSvg({
			id: "portfolio",
			label: "Portfolio",
			domain: "baichu.dev",
			accentColor: "#d1242f",
			icon: linkIcons.portfolio,
		}),
		"utf8",
	);
	writeFileSync(
		linkSvgPaths.space,
		createLinkSvg({
			id: "space",
			label: "Space",
			domain: "baiyuespace.com",
			accentColor: "#8250df",
			icon: linkIcons.space,
		}),
		"utf8",
	);
};

writeLinkSvgs();
