$(function () {
    getDataIndex()
    // 点击按钮 实现退出功能
    $('.layui-nav-item #logout').on('click', function () {
        layer.confirm('确认退出吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layui.layer.close(index)
        });
    })
})
// 定义全局变量
//  渲染用户头像函数 
function renderUser(user) {
    const name = user.nickname || user.username
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    if (user.user_pic != null) {
        // 有就渲染图片
        $('.layui-nav-img').prop('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        const first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(
            first
        ).show()
    }
}

function getDataIndex() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        dataType: 'json',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success: function (backData) {
            if (backData.status !== 0) return layui.layer.msg('获取文件失败')
            renderUser(backData.data)
        }
    });
}