$(function () {
    const layer = layui.layer
    const form = layui.form
    let state = '已发布'
    //文章分类select渲染
    function getSelectDate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (backData) {
                if (backData.status !== 0) return layer.msg(backData.massage)
                let HtmlStr = template('select-article_pub', backData)
                $('[name="cate_id"]').html(HtmlStr)
                form.render()
            }
        });
    }
    getSelectDate()
    // 初始化富文本编辑器
    initEditor()
    // 点击button 相当于点击了button按钮
    $('.layui-btn-danger').click(function (e) {
        e.preventDefault()
        $('#file').click()
    })
    // 创建裁剪区域
    const options = {
        aspectRation: 1 / 1,
        preview: '.img-preview',
        guides: false,
        modal: false,
        // viewMode: 2,
    }
    $('#image').cropper(options)
    $('#file').off().on('change', function (e) {
        e.preventDefault()
        let firstFile = e.target.files
        console.log(firstFile);
        if (firstFile.length === 0) return layer.msg('获取图片失败')
        let firstOne = firstFile[0]
        let fileURL = URL.createObjectURL(firstOne)
        $('#image').cropper('destroy').prop('src', fileURL).cropper(options)
    })
    $('.draft-btn').on('click', function (e) {
        state = '草稿'
    })
    $('#article-pub-form').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData(this)
        fd.set('state', state)
        $('#image').cropper('getCroppedCanvas', {
            width: 400,
            height: 280,
        }).toBlob(function (blob) {
            fd.set('cover_img', blob)
            $.ajax({
                url: '/my/article/add',
                method: 'post',
                contentType: false,
                processData: false,
                data: fd,
                success: function (backData) {
                    if (backData.status !== 0) layer.msg(backData.message)
                    layer.msg(backData.message)
                    // window 页面跳转
                    window.parent.document.querySelector('#target-article-list').children[0].click();
                    // location.href = '/article/article_list.html'
                    // window.parent.document.getElementById('target-article-list').classList.add('layui-this');
                    // window.parent.document.getElementById('target-article-pub').classList.remove('layui-this');
                }
            });
        })

    })
})