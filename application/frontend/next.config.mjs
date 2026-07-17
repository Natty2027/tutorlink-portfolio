/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore optional Knex dependencies we don't use
      config.externals.push({
        'oracledb': 'commonjs oracledb',
        'pg-native': 'commonjs pg-native',
        'pg-query-stream': 'commonjs pg-query-stream',
        'sqlite3': 'commonjs sqlite3',
        'better-sqlite3': 'commonjs better-sqlite3',
        'tedious': 'commonjs tedious',
        'pg': 'commonjs pg',
      });
    }
    return config;
  },
};

export default nextConfig;
