import cors from '@koa/cors';

export default {
	hostname: 'localhost',
	port: 8080,
	esbuildTarget: 'esnext',
	middlewares: [
		cors()
	],
	rootDir: 'build'
};
