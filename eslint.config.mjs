import eslint from "@eslint/js";
import obsidianmd from "eslint-plugin-obsidianmd";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

// Obsidian 注入到全局作用域的辅助函数/对象
const obsidianGlobals = {
	createEl: "readonly",
	createDiv: "readonly",
	createSpan: "readonly",
	createSvg: "readonly",
	createFragment: "readonly",
	activeDocument: "readonly",
	activeWindow: "readonly",
};

// Jest 注入到测试文件的全局变量
// 浏览器/DOM 全局变量（document、window 等）由
// obsidianmd.configs.recommended 提供，无需在此重复声明
const testGlobals = {
	describe: "readonly",
	it: "readonly",
	test: "readonly",
	expect: "readonly",
	jest: "readonly",
	beforeAll: "readonly",
	beforeEach: "readonly",
	afterAll: "readonly",
	afterEach: "readonly",
};

export default defineConfig([
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...obsidianGlobals,
				...testGlobals,
				React: "readonly",
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						"eslint.config.mjs",
						"manifest.json",
						"package.json",
						"tsconfig.json",
					],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".json"],
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		files: ["**/*.json"],
		rules: {
			"obsidianmd/no-plugin-as-component": "off",
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},
	{
		// src/i18n 下除 <locale>/index.ts 外全是 typesafe-i18n 自动生成的文件，
		// 手改会被覆盖。生成器会写入一条无描述的 `/* eslint-disable */`，且在本
		// 覆盖块把相关规则关掉后该指令会被判为「未使用」——两者都放行，避免每次
		// 重新生成类型都要手动补注释。
		files: ["src/i18n/**/*"],
		linterOptions: {
			reportUnusedDisableDirectives: "off",
		},
		rules: {
			"eslint-comments/no-unlimited-disable": "off",
			"eslint-comments/disable-enable-pair": "off",
			"eslint-comments/no-restricted-disable": "off",
			"eslint-comments/require-description": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"no-irregular-whitespace": "off",
		},
	},
	globalIgnores([
		"node_modules",
		"dist",
		".obsidian-cache",
		".vscode",
		"versions.json",
		"main.js",
		"package-lock.json",
	]),
]);
