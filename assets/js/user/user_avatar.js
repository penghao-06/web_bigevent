$(function () {
    // 创建裁剪区域
    const options = {
        aspectRatio: 1,
        viewMode: 2,
        // center: true,
        // 设置遮罩层的图片的虚线
        guides: false,
        modal: false,
        preview: '.img-preview'
    }
    $('#image').cropper(options)
    // 点击上传就是点击file文件
    $('#UploadBtn').on('click', function () {
        $('#file').click()
    })
    // 上传文件绑定事件
    $('#file').off().on('change', function (e) {
        let firstFile = e.target.files
        console.log(firstFile);
        if (firstFile.length === 0) return layui.layer.msg('选择上传的文件')
        let firstFiles = firstFile[0]
        // URl.createObjectURL 静态创建一个DOMstring 包括这个对象的url 生命周期包括开始到页面结束,跟创建页面的document绑定
        let fileURL = URL.createObjectURL(firstFiles)
        // console.log(fileURL);
        // 图片之前的路径销毁掉 重新赋值给src新的文件路径 重新创建一个新的cropper的裁剪区域
        $('#image').cropper('destroy').prop('src', fileURL).cropper(options)
    })
    $('#btnSure').on('click', function () {
        let imageData = $('#image').cropper('getCroppedCanvas', {
            // 裁剪后的长宽
            height: 100,
            width: 100,
        }).toDataURL('image/png')
        $.ajax({
            url: '/my/update/avatar',
            method: 'post',
            data: {
                avatar: imageData
            },
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg('更新头像失败')
                layui.layer.msg('更新头像成功')
                window.parent.getDataIndex()
                
            }
        });
    })
})