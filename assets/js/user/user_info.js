$(function () {
    // obj 讲接受全局变量
    let obj = null
    const form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) return '昵称请保持6个字符之内'
        }
    })

    function getUserData() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg('获取用户基本信息失败')
                // 表单添加lay-filter属性 
                obj = backData.data
                form.val('formUserInfo', backData.data)
            }
        });
    }
    getUserData()
    // 点击重置的时候重新调用函数 渲染页面 阻止submit的默认行为
    $('#resetBtn').on('click', function (e) {
        e.preventDefault()
        // 重新发送ajax 渲染页面 
        //  getUserData()
        // 使用全局变量减少发送ajax 请求
        form.val('formUserInfo', obj)
    })
    // 点击提交按钮 添加到数据库 重新渲染页面
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg('更新数据失败')
                // 失败方法
                // getUserData()
                // location.reload()
                layui.layer.msg('恭喜你,修改成功')
                // 调用父元素中的全局变量方法 重新渲染页面
                window.parent.getDataIndex()
            }
        });
    })
})