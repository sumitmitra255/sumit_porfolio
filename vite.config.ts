import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from 'lovable-tagger'

const base = '/sumit-mitra/' 

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	base,
	server: {
		host: '::',
		port: 8080,
	},
	plugins: [
		react({
			babel: {
				plugins: [
					["babel-plugin-react-compiler", {}],
				],
			},
		}),
		mode === 'development' && componentTagger()
	].filter(Boolean),
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			external: ['fsevents', 'fs', 'path', 'crypto', 'util', 'tty', 'string_decoder']
		}
	},
	ssr: {
		noExternal: ['react-dom']
	}
}))
