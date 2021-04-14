"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = void 0;
/* eslint no-console: 0 */
const fs_1 = __importDefault(require("fs"));
const globby_1 = __importDefault(require("globby"));
const prettier_1 = __importDefault(require("prettier"));
const gm_codes_1 = require("./src/data/gm-codes");
const client_1 = __importDefault(require("@sanity/client"));
const features_1 = require("./src/config/features");
const disabledRoutes = features_1.features
    .filter((x) => x.isEnabled === false)
    .map((x) => x.route);
// regioData being generated as we can't import an ES export into CommonJS
const regioData = [...Array(25).keys()].map((n) => `VR${(n + 1).toString().padStart(2, '0')}`);
/**
 * Generates an xml sitemap depending on the given locale.
 *
 * @param locale
 */
function generateSitemap(locale, dataset = 'production', projectId = '', useCdn = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            dataset,
            projectId,
            useCdn,
        };
        console.log(config);
        const client = client_1.default(config);
        console.log(`Generating sitemap '${locale || 'nl'}'`);
        const prettierConfig = yield prettier_1.default.resolveConfig('./.prettierrc.js');
        const slugsQuery = `{
    'articles': *[_type == 'article'] {"slug":slug.current},
    'editorials': *[_type == 'editorial'] {"slug":slug.current},
  }`;
        const slugsData = (yield client.fetch(slugsQuery));
        const domain = `${process.env.NEXT_PUBLIC_LOCALE === 'en' ? 'government' : 'rijksoverheid'}`;
        // Ignore Next.js specific files and API routes.
        const pages = yield globby_1.default([
            './src/pages/**/*{.tsx,.mdx}',
            '!./src/pages/404.tsx',
            '!./src/pages/500.tsx',
            '!./src/pages/_*.tsx',
            '!./src/pages/api',
        ]);
        const pathsFromPages = pages
            .map((page) => page
            .replace('./src/pages', '')
            .replace('.tsx', '')
            .replace('/index.tsx', '')
            .replace('/index', ''))
            .filter((x) => !disabledRoutes.includes(x));
        const priorities = [
            { path: 'landelijk', value: 0.8 },
            { path: 'gemeente', value: 0.8 },
            { path: 'regio', value: 0.8 },
        ];
        const pathsWithPriorities = pathsFromPages.map((path) => {
            const priority = priorities.find((priority) => path.includes(priority.path));
            return {
                path: path,
                priority: priority !== undefined ? priority.value : 0.6,
            };
        });
        const allPathsWithPriorities = pathsWithPriorities.filter((p) => p.path !== '' && !isParameterizedPath(p.path));
        const regioPaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('veiligheidsregio'));
        const gemeentePaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('gemeente'));
        const articlePaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('artikelen'));
        const editorialPaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('weekberichten'));
        articlePaths.forEach((p) => {
            slugsData.articles.forEach((article) => {
                const pathWithCode = p.path.replace('[slug]', article.slug);
                allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
            });
        });
        editorialPaths.forEach((p) => {
            slugsData.editorials.forEach((editorial) => {
                const pathWithCode = p.path.replace('[slug]', editorial.slug);
                allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
            });
        });
        regioPaths.forEach((p) => {
            regioData.forEach((regioCode) => {
                const pathWithCode = p.path.replace('[code]', regioCode);
                allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
            });
        });
        gemeentePaths.forEach((p) => {
            gm_codes_1.gmCodes.forEach((code) => {
                const pathWithCode = p.path.replace('[code]', code);
                allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
            });
        });
        const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>${`https://coronadashboard.${domain}.nl/`}</loc>
        <priority>1.00</priority>
      </url>
      ${allPathsWithPriorities
            .map((p) => {
            return `
                <url>
                    <loc>${`https://coronadashboard.${domain}.nl${p.path}`}</loc>
                    <priority>${p.priority}</priority>
                </url>
            `;
        })
            .join('')}
    </urlset>
  `;
        const formatted = prettier_1.default.format(sitemap, Object.assign(Object.assign({}, prettierConfig), { parser: 'html' }));
        fs_1.default.writeFileSync('public/sitemap.xml', formatted);
    });
}
exports.generateSitemap = generateSitemap;
function isParameterizedPath(path) {
    return ['code', 'slug'].some((fragment) => path.includes(fragment));
}
