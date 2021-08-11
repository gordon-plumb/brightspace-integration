
import cors from '@koa/cors';

export default {
	esbuildTarget: 'auto',
	hostname: process.env.npm_config_hostname || 'localhost',
	middleware: [
		cors({ origin: '*' }),
		function rewrite(context, next) {
			if (context.url.startsWith('/bsi.') || context.url.startsWith('/datagrid.') || context.url.startsWith('/homepages.') || context.url.startsWith('/images/')) {
				context.url = '/build' + context.url;
			}
			return next();
		}
	],
	plugins: [
		{
			transform(context) {
				// removing detection of "define" to avoid UMD time bomb with UMD FRAs
				if (context.path === '/node_modules/fastdom/fastdom.js' || context.path === '/node_modules/focus-visible/dist/focus-visible.js') {
					const transformedBody = context.body.replace(/\bdefine\b/g, 'defineNoYouDont');
					return { body: transformedBody };
				}
			}
		}
	],
	port: parseInt(process.env.npm_config_port) || 8080,
	preserveSymlinks: true,
	nodeResolve: {
		/*
		 * this mimics what es-dev-server did for deduping. This works because currently inside node-resolve they take the dedupe
		 * option and make it a function to run internally. If it's already a function they do nothing and just execute it later.
		 * https://github.com/open-wc/es-dev-server/blob/98dd47464c97c5ab5fc6ef86723b3f529bc8265c/src/config.ts#L300
		 * https://github.com/rollup/plugins/blob/b393bcb6fe600e27a33b643a20340dc5669d1f85/packages/node-resolve/src/index.js#L59
		 * https://github.com/rollup/plugins/blob/b393bcb6fe600e27a33b643a20340dc5669d1f85/packages/node-resolve/src/index.js#L81
		 */
		dedupe: importee => !['.', '/'].includes(importee[0])
	}
};
