import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const quotesFilePath = path.resolve(__dirname, "quotes.json");
const readmePath = path.resolve(__dirname, "README.md");
const quoteSvgPath = path.resolve(__dirname, "quote.svg");
const linkSvgPaths = {
	portfolio: path.resolve(__dirname, "portfolio.svg"),
	space: path.resolve(__dirname, "space.svg"),
};
const quoteFontFamily = "KaiTi, STKaiti, 'Noto Serif CJK SC', 'Noto Serif SC', serif";
const quoteTextColor = "#d1242f";
const linkFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const DefaultQuote = {
	quote: "\u201c醉里挑灯看剑，醒时一笑看尽红尘。\u201d",
	author: "Baiyuechu111",
};

const getQuote = () => {
	try {
		const data = readFileSync(quotesFilePath, "utf8");
		const quotes = JSON.parse(data);
		if (quotes.length > 0) {
			return quotes[Math.floor(Math.random() * quotes.length)] || DefaultQuote;
		}
		return DefaultQuote;
	} catch (err) {
		console.error("Error reading quotes file:", err);
		return DefaultQuote;
	}
};

const escapeXml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const wrapText = (text, maxLineLength = 24) => {
	const cleanText = String(text).trim();
	const lines = [];

	for (let index = 0; index < cleanText.length; index += maxLineLength) {
		lines.push(cleanText.slice(index, index + maxLineLength));
	}

	return lines.length ? lines : [DefaultQuote.quote];
};

const createQuoteSvg = ({ quote, author }) => {
	const lines = wrapText(quote);
	const height = Math.max(150, 96 + lines.length * 34);
	const quoteStartY = Math.round(height / 2 - (lines.length - 1) * 17 - 8);
	const authorY = quoteStartY + lines.length * 34 + 18;

	const quoteLines = lines
		.map(
			(line, index) =>
				`		<tspan x="50%" y="${quoteStartY + index * 34}">${escapeXml(line)}</tspan>`,
		)
		.join("\n");

	return `<svg width="900" height="${height}" viewBox="0 0 900 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
	<title id="title">Random quote</title>
	<desc id="desc">${escapeXml(`${quote} - ${author}`)}</desc>
	<text text-anchor="middle" fill="${quoteTextColor}" font-family="${quoteFontFamily}" font-size="24" font-weight="700" font-style="italic">
${quoteLines}
	</text>
	<text x="50%" y="${authorY}" text-anchor="middle" fill="${quoteTextColor}" font-family="${quoteFontFamily}" font-size="18" font-weight="700" font-style="italic">- 《${escapeXml(author)}》 -</text>
</svg>
`;
};

const writeQuoteSvg = (quoteData) => {
	try {
		writeFileSync(quoteSvgPath, createQuoteSvg(quoteData), "utf8");
	} catch (err) {
		console.error("Error writing quote SVG:", err);
	}
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
	<circle cx="44" cy="38" r="20" fill="${accentColor}" fill-opacity="0.12"/>
	<text x="44" y="46" text-anchor="middle" fill="${accentColor}" font-family="${linkFontFamily}" font-size="22" font-weight="700">${escapeXml(icon)}</text>
	<text x="82" y="34" fill="${accentColor}" font-family="${linkFontFamily}" font-size="18" font-weight="700">${escapeXml(label)}</text>
	<text x="82" y="55" fill="#57606a" font-family="${linkFontFamily}" font-size="14">${escapeXml(domain)}</text>
	<path d="M314 31h12v12" stroke="${accentColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M326 31l-18 18" stroke="${accentColor}" stroke-width="2.4" stroke-linecap="round"/>
</svg>
`;

const writeLinkSvgs = () => {
	try {
		writeFileSync(
			linkSvgPaths.portfolio,
			createLinkSvg({
				id: "portfolio",
				label: "Portfolio",
				domain: "baichu.dev",
				accentColor: "#d1242f",
				icon: "P",
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
				icon: "S",
			}),
			"utf8",
		);
	} catch (err) {
		console.error("Error writing link SVGs:", err);
	}
};

const updateReadme = () => {
	try {
		let readmeContent = readFileSync(readmePath, "utf8");
		const quoteBlock = '<img src="./quote.svg" alt="Quote" width="900" />';

		const quoteRegex = /(?:<p><i><b>.*?<\/b><\/i>\s*-\s*.*?<\/p>|<img src="\.\/quote\.svg" alt="Quote" width="900" \/?>)/i;
		const match = readmeContent.match(quoteRegex);
		if (!match) return;

		const updatedContent = readmeContent.replace(quoteRegex, quoteBlock);

		writeFileSync(readmePath, updatedContent, "utf8");
	} catch (err) {
		console.error("Error updating README:", err);
	}
};

(async () => {
	const { quote, author } = getQuote();

	if (quote && author) {
		writeQuoteSvg({ quote, author });
		writeLinkSvgs();
		updateReadme();
	}
})();
