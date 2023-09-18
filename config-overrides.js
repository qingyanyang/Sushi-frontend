const webpack = require('webpack');

module.exports = function override(config, env) {

    config.plugins.push(new webpack.DefinePlugin({
        'process.env.REACT_APP_BASE_IMG_URL': JSON.stringify(process.env.REACT_APP_BASE_IMG_URL),
        'process.env.REACT_APP_BASE_URL': JSON.stringify(process.env.REACT_APP_BASE_URL),
    }));

    config.optimization = config.optimization || {};

    config.optimization.splitChunks = config.optimization.splitChunks || {};

    config.optimization.splitChunks.cacheGroups = config.optimization.splitChunks.cacheGroups || {};

    config.optimization = {
        ...config.optimization,
        splitChunks: {
            ...config.optimization.splitChunks,
            chunks: 'all',
            cacheGroups: {
                ...config.optimization.splitChunks.cacheGroups,
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module, chunks, cacheGroupKey) {
                        const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                        const packageName = match ? match[1] : 'unknown';
                        return `${cacheGroupKey}.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    };

    return config;
};
