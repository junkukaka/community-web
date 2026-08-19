module.exports = {
    parallel: false,    // Vue 2.7 compiler objects are not serializable by the legacy thread-loader
    devServer: {
        port: 8888,     // 端口
    },
    lintOnSave: false   // 取消 eslint 验证
};
