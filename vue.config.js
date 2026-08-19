module.exports = {
    parallel: false,
    transpileDependencies: [
        'vuetify',
        '@vueup/vue-quill',
        'quill'
    ],
    devServer: {
        port: 8888,     // 端口
    },
    lintOnSave: false   // 取消 eslint 验证
};
