function MyWebpackPlugin(options) {
    this.options = options || {};
}

MyWebpackPlugin.prototype.apply = function (compiler) {
    compiler.hooks.done.tap('MyWebpackPlugin', function (stats) {
        console.log('MyWebpackPlugin: build successfully！');
    });
};

module.exports = MyWebpackPlugin;
