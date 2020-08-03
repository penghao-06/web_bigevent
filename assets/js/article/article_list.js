$(function () {
    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }
    //获得之后toggle总数量
    function zero(n) {
        return n < 10 ? '0' + n : n
    }
    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date)
        let y = dt.getFullYear()
        let m = zero(dt.getMonth() + 1)
        let d = zero(dt.getDate())
        let hh = zero(dt.getHours())
        let mm = zero(dt.getMinutes())
        let ss = zero(dt.getSeconds())
        return y + '-' + m + '-' + d + '\xa0\xa0\xa0' + hh + ":" + mm + ":" + ss
    }
    // 模板引擎填充数据
    function getArticleList() {
        $.ajax({
            url: '/my/article/list',
            method: 'get',
            data: p,
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg(backData.message)
                let htmlStr = template('article-list-script', backData)
                $('#tbody').html(htmlStr)
                getpageNumDate(backData.total)
            }
        });
    }
    // 下拉表单的ajax 
    function getSelectData() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (backData) {
                if (backData.status !== 0) return layui.layer.msg(backData.message)
                let htmlStrData = template('article-select', backData)
                // console.log(htmlStrData);
                $('#cateSelect').html(htmlStrData)
                // layui中的form render 属性 可以重新渲染页面
                layui.form.render()
            }
        });
    }
    // 筛选 点击按钮
    // $('.layui-btn-normal').on('click', function () {
    //     // e.preventDefault()
    //     // console.log(123);
    //     let cate_id = $('#cateSelect').val()
    //     let state = $('[name="state"]').val()
    //     console.log(cate_id, state);
    //     p.cate_id = cate_id
    //     p.state = state
    //     getArticleList()
    // });
    // 表单的submit事件
    $('#article-list-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('#cateSelect').val()
        let state = $('[name="state"]').val()
        p.cate_id = cate_id
        p.state = state
        console.log($(this).serializeArray());
        let obj = {}
        $(this).serializeArray().forEach((item) => {
            obj[item.name] = item.value
        })
        getArticleList()
    })
    getArticleList()
    getSelectData()
    // 分页的函数
    function getpageNumDate(total) {
        // layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'textBox',
            count: total,
            limit: p.pagesize, // 一页几条数据
            curr: p.pagenum, // 第几页
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip', 'refresh'],
            limits: [1, 2, 3, 4, 5],
            // first 的表示layout触发的 只要render触发的就是true  首次不执行
            jump: function (obj, first) {
                p.pagenum = obj.curr
                p.pagesize = obj.limit
                // //首次不执行
                if (!first) {
                    getArticleList()
                }
            }
        });

        // });
    }
    // 删除按钮 事件委托
    $('#tbody').on('click', '.layui-btn-danger', function () {
        const id = $(this).data('id')
        let lengthBtn = $('.layui-btn-danger').length
        console.log(lengthBtn);
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'get',
                success: function (backData) {
                    if (backData.status !== 0) return layui.layer.msg(backData.message)
                    layer.msg(backData.message)
                    // 三元表达式
                    lengthBtn === 1 && p.pagenum >= 1 && p.pagenum--
                    if (lengthBtn === 1) {
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    getArticleList()

                }
            });
            layer.close(index);
        });
        $('#')
    })

})