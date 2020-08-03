// window.onload = function () {

// }
// window.addEventListener('DOMContentLoaded', function () {

// })
$(function () {
    const form = layui.form
    const layer = layui.layer
    const id = location.search.split('=')[1]
    let state = '已发布'
    // 创建裁剪区域
    const options = {
        aspectRation: 1 / 1,
        preview: '.img-preview',
        guides: false,
        modal: false,
        // viewMode: 2,
    }
    $('#image').cropper(options)
    initEditor()
    //文章分类select渲染
    function getSelectDate(cate_id) {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            responseType: 'blob',
            success: function (backData) {
                if (backData.status !== 0) return layer.msg(backData.massage)
                backData.cate_id = cate_id
                let HtmlStr = template('select-article_pub', backData)
                $('[name="cate_id"]').html(HtmlStr)
                form.render()
            }
        });
    }

    // 点击button 相当于点击了button按钮
    $('.layui-btn-danger').click(function (e) {
        e.preventDefault()
        $('#file').click()
    })
    $('#file').off().on('change', function (e) {
        e.preventDefault()
        let firstFile = e.target.files
        console.log(firstFile);
        if (firstFile.length === 0) return layer.msg('获取图片失败')
        let firstOne = firstFile[0]
        let fileURL = URL.createObjectURL(firstOne)
        $('#image').cropper('destroy').prop('src', fileURL).cropper(options)
    })

    //发生ajax 重新获取数据
    function UpdataEdit() {
        $.ajax({
            url: '/my/article/' + id,
            method: 'get',
            responseType: 'blob',
            success: function (backData) {
                if (backData.status !== 0) return layer.msg(backData.message)
                // console.log(backData.data);
                form.val('article-edit', backData.data)
                getSelectDate(backData.data.cate_id)
                $('#image').cropper('destroy').prop('src', "http://ajax.frontend.itheima.net" + backData.data.cover_img).cropper(options)
                setTimeout(function () {
                    tinyMCE.activeEditor.setContent(backData.data.content)
                }, 100)
            }
        });
    }
    UpdataEdit()
    $('.draft-btn').on('click', function () {
        state = '草稿'
    })
    $('#article-pub-form').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData(this)
        fd.set('state', state)
        fd.set('Id', id)
        // 创建画布
        $('#image').cropper('getCroppedCanvas', {
            width: 400,
            height: 280,
        }).toBlob(function (blob) {
            fd.set('cover_img', blob)
            // console.log(...fd);
            //发生ajax改变
            $.ajax({
                url: '/my/article/edit',
                method: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function (backData) {
                    if (backData.status !== 0) return layer.msg(backData.message)
                    layer.msg(backData.message)
                    location.href = '/article/article_list.html'
                }
            });
        })
    })
})