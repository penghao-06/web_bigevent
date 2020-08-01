$(function () {
    $('#login-box-item').on('click', () => {
        $('.login-reg').show()
        $('.login-box').hide()
    })
    $('#login-reg-item').on('click', () => {
        $('.login-reg').hide()
        $('.login-box').show()
    })
    let form = layui.form
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            let psd = $('.password-reitem').val()
            if (psd !== value) return '两次密码不一致'
        }
    });
    // 导出layer 调用内置对象msg 弹出框
    const layer = layui.layer
    $('.login-reg input[type="text"]').on('blur', () => {
        let value = $('.login-reg input[type="text"]').val()
        if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
            $('.reset-data ').text('用户名不能有特殊字符').show()
            setTimeout(() => {
                $('.reset-data ').hide()
            }, 2000)

        }
        if (/(^\_)|(\__)|(\_+$)/.test(value)) {
            $('.reset-data ').text('用户名首尾不能出现下划线\'_\'').show()
            setTimeout(() => {
                $('.reset-data ').hide()
            }, 2000)

        }
        if (/^\d+\d+\d$/.test(value)) {
            $('.reset-data ').text('用户名不能全为数字').show()
            setTimeout(() => {
                $('.reset-data ').hide()
            }, 2000)

        }
    })
    // 点击注册的时候在发送ajax 请求
    $('.login-reg .login-item').on('submit', function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        data = data.substr(0, data.lastIndexOf('&'))
        $.ajax({
            url: '/api/reguser',
            method: 'post',
            dataType: 'json',
            data: data,
            success: function (backData) {
                console.log(backData);
                if (backData.status !== 0) {
                    $('.reset-data ').text(backData.message).show()
                    setTimeout(() => {
                        $('.reset-data ').hide()
                    }, 1000)
                    return
                }
                // 调用弹出msg 对话框
                layer.msg(backData.message)
                // 手动调用点击事件
                $('#login-reg-item').click()
                $(this)[0].reset()
            }.bind(this)
        });
    })
    // 点击注册的时候 ajax post请求 
    $('.login-box .login-item').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (backData) {
                if (backData.status !== 0) {
                    return layui.layer.msg('登录失败')
                }
                localStorage.setItem('token', backData.token)
                location.href = "/index.html"
            }
        });
    })
})