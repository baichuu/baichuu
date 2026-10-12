import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const quotesFilePath = path.resolve(__dirname, "quotes.json");
const readmePath = path.resolve(__dirname, "README.md");
const quoteSvgPath = path.resolve(__dirname, "quote.svg");
const websiteLabels = readFileSync(path.resolve(__dirname, "website-labels.svg"), "utf8").trim();
const helloSvg = readFileSync(path.resolve(__dirname, "hello.svg"), "utf8").trim();
const quoteFontFamily = "KaiTi, STKaiti, 'Noto Serif CJK SC', 'Noto Serif SC', serif";
const quoteTextColor = "#ffffff";
const quoteFontSize = 30;
const quoteLineHeight = 40;

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
	const height = Math.max(280, 160 + lines.length * quoteLineHeight);
	const quoteStartY = Math.round(height / 2 - (lines.length - 1) * (quoteLineHeight / 2) - 18);
	const authorY = quoteStartY + (lines.length - 1) * quoteLineHeight + 44;

	const quoteLines = lines
		.map(
			(line, index) =>
				`		<tspan x="50%" y="${quoteStartY + index * quoteLineHeight}">${escapeXml(line)}</tspan>`,
		)
		.join("\n");

	return `<svg width="720" height="${height}" viewBox="0 0 720 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
	<title id="title">Random quote</title>
	<desc id="desc">${escapeXml(`${quote} - ${author}`)}</desc>
	<rect width="720" height="${height}" rx="15" fill="#000000" />
	<text text-anchor="middle" fill="${quoteTextColor}" font-family="${quoteFontFamily}" font-size="${quoteFontSize}" font-weight="700">
${quoteLines}
	</text>
	<text x="50%" y="${authorY}" text-anchor="middle" fill="${quoteTextColor}" font-family="${quoteFontFamily}" font-size="18" font-weight="700">- 《${escapeXml(author)}》 -</text>
	<g transform="translate(8 ${height - 41})">
		${helloSvg}
	</g>
	<!-- Lucide globe and orbit icons; see lucide-LICENSE. -->
	<g transform="translate(494 ${height - 30})" fill="#ffffff" font-family="'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13">
		<g transform="scale(0.666667)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
			<path d="M2 12h20" />
		</g>
		${websiteLabels}
		<g transform="translate(108 0) scale(0.666667)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" />
			<path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" />
			<circle cx="12" cy="12" r="3" />
			<circle cx="19" cy="5" r="2" />
			<circle cx="5" cy="19" r="2" />
		</g>
	</g>
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

const updateReadme = () => {
	try {
		let readmeContent = readFileSync(readmePath, "utf8");
		const quoteBlock = '<img src="./quote.svg" alt="Quote" width="100%" />';

		const quoteRegex = /(?:<p><i><b>.*?<\/b><\/i>\s*-\s*.*?<\/p>|<img src="\.\/quote\.svg" alt="Quote" width="(?:900|720|100%)" \/?>)/i;
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
		updateReadme();
	}
})();
