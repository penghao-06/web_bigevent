$(function () {
    // function fn() {
    //     const layer = layui.layer
    //     let indexAdd = null
    //     let indexEdit = null
    //     const form = layui.form
    // }
    const layer = layui.layer
    let indexAdd = null
    let indexEdit = null
    const form = layui.form

    function getArticleCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            dataType: 'json',
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg(backData.message)
                const HTMLStr = template('article_cate_tody', backData)
                $('#tbody').html(HTMLStr)
            }
        });
    }
    getArticleCate()
    // 点击添加按钮的事件
    $('#addArticle').on('click', function (e) {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章页面',
            content: $('#article-add').html(),
        })
    })
    $('#btn-reset').on('click', function (e) {
        e.preventDefault()
        $('#articleAdd-form')[0].reset()
    })
    //事件委托动态添加
    $('#body-item').on('submit', '#articleAdd-form', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (backData) {
                if (backData.status != 0) return layer.msg('添加失败')
                // 调用函数 渲染页面
                getArticleCate()
                layer.close(indexAdd)
            }
        });
    })
    $('#tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章页面',
            content: $('#article-edit').html(),
        })
        let id = $(this).data('id')
        // 发送ajax请求 获取数据
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'get',
            dataType: 'json',
            success: function (backData) {
                if (backData.status !== 0) return layer.msg(backData.message)
                form.val('article_edit_form', backData.data)
            }
        });
    })
    // 添加的元素讲所有的绑定时间
    $('#body-item').on('submit', '#articleAdd-form-edit', function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        // console.log($(this).serializeArray());
        //  对象或者是&符号分隔的
        let obj = {}
        $(this).serializeArray().forEach((item, index) => {
            obj[item.name] = item.value
        })
        // console.log(obj);
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (backData) {
                if (backData.status !== 0) return layer.msg(backData.message)
                layer.close(indexEdit)
                getArticleCate()
            }
        });
    })
    // 删除事件
    $('#body-item').on('click', '.layui-btn-danger', function () {
        let id = $(this).data('id')
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'get',
                dataType: 'json',
                success: function (backData) {
                    if (backData.status !== 0) return layer.msg(backData.message)
                }
            });
            layer.close(index);
            getArticleCate()
        });

    })
})