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
	portfolio: `<path d="M25 25h16a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
	<path d="M29 25v-3a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 37 22v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
	<path d="M22 31h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
	<path d="M33 30v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
	space: `<path d="M33 20l2.1 6 5.9 2.1-5.9 2.1-2.1 6-2.1-6-5.9-2.1 5.9-2.1L33 20Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
	<path d="M23 37c6 4.4 16.2 1 21.5-7.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
	<path d="M43.5 22c-6-4.4-16.2-1-21.5 7.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
};

const createLinkSvg = ({ id, label, domain, accentColor, icon }) => `<svg width="260" height="58" viewBox="0 0 260 58" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc">
	<title id="${id}-title">${escapeXml(label)}</title>
	<desc id="${id}-desc">${escapeXml(domain)}</desc>
	<defs>
		<linearGradient id="${id}-line" x1="16" y1="9" x2="244" y2="49" gradientUnits="userSpaceOnUse">
			<stop stop-color="${accentColor}"/>
			<stop offset="1" stop-color="#d1242f"/>
		</linearGradient>
	</defs>
	<rect x="1" y="1" width="258" height="56" rx="10" fill="transparent" stroke="url(#${id}-line)" stroke-width="1.6"/>
	<g color="${accentColor}">
		${icon}
	</g>
	<text x="58" y="26" fill="${accentColor}" font-family="${linkFontFamily}" font-size="15" font-weight="700">${escapeXml(label)}</text>
	<text x="58" y="43" fill="#57606a" font-family="${linkFontFamily}" font-size="12">${escapeXml(domain)}</text>
	<path d="M229 22h9v9" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M238 22l-14 14" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
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
