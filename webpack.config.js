module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module, chunks, cacheGroupKey) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `${cacheGroupKey}.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
};
