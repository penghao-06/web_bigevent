$(function () {
    const form = layui.form
    $('input[name="oldPwd"]').val()
    form.verify({
        // 密码验证规则
        pwd: [/^[\S]{6,12}$/, '密码不符合规则且不能出现空格'],
        // 新旧密码不能一样
        samePwd: function (value) {
            if (value === $('input[name="oldPwd"]').val()) {
                return '新旧密码不能一样'
            }
        },
        // 两次的密码判断是不是一样的
        rePwd: function (value) {
            if (value !== $('input[name="newPwd"]').val()) {
                return '两次密码不一样'
            }
        }
    })
    // 页面重置
    $('#resetBtn').on('click', function (e) {
        e.preventDefault()
        $('.layui-form')[0].reset()
    })
    // 提交密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            method: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (backData) {
                console.log(backData)
                if (backData.status !== 0) return layui.layer.msg('密码修改失败')
                layui.layer.msg('修改成功')
                // 页面元素清空
                $('#resetBtn').click()
                // 页面调转到首页
                localStorage.removeItem('token')
                location.reload()
                // location.href = '../../../login.html'
            }
        });
    })
})