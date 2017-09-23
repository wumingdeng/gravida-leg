<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.color" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getConfigs()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="onOpenDialog()">添加</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="freshConfig()">刷新商品数据</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="0">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="id" label='商品ID' width='80' align='center'>
                </el-table-column>
                <el-table-column label='商品内容' align='center'>
                    <template scope="scope">
                        <el-row v-for="(item,idx) in sortGoodsContent(scope.row.goods)" :key="idx">
                            货号:{{item.pid}} 别名:{{item.alias}} 价格:{{item.price}}
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label='商品名称' align='center'>
                </el-table-column>
                <el-table-column prop="showPrice" label='价格' width='100' align='center'>
                </el-table-column>
                <el-table-column prop="intro" label='介绍内容' align='center'>
                </el-table-column>
                <el-table-column prop="introNum" label='介绍数' width='80' align='center'>
                </el-table-column>
                <el-table-column prop="showType" label='款型' width='100' align='center'>
                </el-table-column>
                <el-table-column  label='首页显示图片' align='center'>
                    <template scope="scope">
                       <img style="width:50%" :src="tableImgSrc(scope.row.smallPic)"/>
                    </template>
                </el-table-column>
                <el-table-column label='操作' align='center' width='140'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" type="primary" @click="onDelete(scope.$index, scope.row)">删除</el-button>
                            <el-button size="small" type="primary" @click="onOpenDialog(scope.row)">修改</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
            </el-pagination>
        </el-row>
        <el-dialog :visible.sync="v_form" :close-on-press-escape="false" :close-on-click-modal="false" @close="oncloseDialog">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="商品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.showPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品介绍">
                    <el-input v-model="form.intro"></el-input>
                </el-form-item>
                <el-form-item label="介绍图数">
                    <el-input v-model="form.introNum"></el-input>
                </el-form-item>
                <el-form-item label="款型">
                    <el-input v-model="form.showType"></el-input>
                </el-form-item>
                <el-form-item label="首页图片">
                    <el-upload style="float:left" class="upload-demo" ref="upload" :action="''" disabled :show-file-list="false" :auto-upload="false" list-type="picture-card">
                        <img v-if="form.smallPic" :src="imgSrc" class="avatar" style="max-width:100px" v-on:click="handleClick">
                        <i v-else class="el-icon-plus avatar-uploader-icon" v-on:click="handleClick"></i>
                    </el-upload>
                    <input type="file" id="uploadfile" accept="audio/mpeg,image/png,image/jpeg" style="display:none;width:250px;" v-on:change="getFileInfo" />
                </el-form-item>
                <el-form-item label="轮播图片">
                    <el-upload style="float:left" class="upload-demo" ref="upload" :action="''" disabled  show-file-list :on-remove="handleRemove" :file-list="fileDisplayList" :auto-upload="false" list-type="picture-card">
                        <i class="el-icon-plus avatar-uploader-icon" v-on:click="handleSwiperClick"></i>
                    </el-upload>
                    <input type="file" id="uploadSwiperfile" accept="audio/mpeg,image/png,image/jpeg" style="display:none;width:250px;" v-on:change="getSwiperFileInfo" />
                </el-form-item>
                <el-form-item label="货品配置">
                    <el-table :data="produceTable" border ref="singleTable">
                        <el-table-column prop="pid" label="货号">
                        </el-table-column>
                        <el-table-column prop="alias" label="别名" width="180">
                        </el-table-column>
                        <el-table-column prop="price" label="价格" width="180" align='center'>
                        </el-table-column>
                        <el-table-column label='操作' align='center'>
                            <template scope="scope">
                                <el-row>
                                    <el-button size="small" type="primary" @click="onGoodDelete(scope.$index)">删除</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-select style="float:left;width:30%;" v-model="goods.pid" filterable remote placeholder="请输入货号" :remote-method="remoteMethod" :loading="loading" @change="onSelected">
                        <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="goods.alias" placeholder="请输入别名" style="width:20%;float:left;margin-left:10px"></el-input>
                    <el-input v-model="goods.price" placeholder="请输入价格" style="width:20%;float:left;margin-left:10px"></el-input>
                    <el-button style="float:left;margin-left:10px"  type="primary" @click="addProduce">提交</el-button>
                    <el-button style="float:left"  type="primary" @click="resetProduce">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="v_form=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mp_vue from './modifyProduce.vue'
export default {
    data() {
        return {
            form: {
                id:'',
                name: '',
                showPrice: '',
                intro: '',
                introNum: '',
                showType: '',
                smallPic: '',
                swipePic: ''
            },
            filters: {
                name: ''
            },
            goods:{
                pid:'',
                alias:'',
                price:''
            },
            old_smallPic:'',
            fileDisplayList:[], //轮播图片的显示列表
            fileList_1:[], //首页的图片
            fileList_2:[], //轮播的图片
            options4: [],
            tableData: [],
            produceTable:[],
            updateList:[], //修改的补充
            deleteList:[], //修改的删除
            listLoading: false,
            loading: false,
            v_form: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
            isModify:false
        } 
    },
    components: {
        "mp": mp_vue
    },
    computed:{
        imgSrc() {
            if(this.form.smallPic.indexOf('http')<0){
                return window.global.serverAdr+'/'+this.form.smallPic
            }else{
                return this.form.smallPic
            }
        }
    },
    methods: {
        freshConfig:function(){
            this.$confirm('是否确定现在刷数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(window.global.debugUrl + "freshConfig").then((res) => {
                    if(res.body.ok===1){
                        this.$message({
                            type: 'success',
                            message: '刷新成功'
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            
        },
        sortGoodsContent(goods) {
            var goodsObj = JSON.parse(goods)
            var res = []
            for(var key in goodsObj){
                var g = goodsObj[key]
                var obj = {}
                obj.pid = key
                obj.alias = g.alias
                obj.price = g.price
                res.push(obj)
            }
            return res
        },
        oninitData(){
            this.isModify = false
            this.goods = {
                pid:'',
                alias:'',
                price:''
            }
            this.form = {
                name: '',
                showPrice: '',
                intro: '',
                introNum: '',
                showType: '',
                smallPic: '',
                swipePic:''
            },
            this.fileList_1=[] //首页的图片
            this.fileList_2=[] //轮播的图片
            this.fileDisplayList=[]
            this.produceTable=[]
            this.updateList=[]
            this.deleteList=[]
        },
        oncloseDialog() {
            console.log("关闭对话框")
            this.oninitData()
        },
        tableImgSrc(smallPic){
            return window.global.serverAdr+'/'+smallPic
        },
        onSelected(value) {
            if (value == '') return
            var storage = this.storages[value]
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.options4 = this.list.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.options4 = [];
            }
        },
        resetProduce() {
            this.goods={
                pid:'',
                alias:'',
                price:''
            }
        },
        addProduce() {
            if (this.goods.pid.toString().trim() === '') {
                this.$alert('请输入货号');
                return
            }
            if (this.goods.alias.toString().trim() === '') {
                this.$alert('请输入别名');
                return
            }
            if (this.goods.price.toString().trim()=== '') {
                this.$alert('请输入价格');
                return
            }
            if (this.goods.price.toString().replace(/^[1-9]\d*$/g,'') != '') {
                this.$alert('价格必须为正整数');
                return
            }
            this.produceTable.push(this.goods)
            this.resetProduce()
        },
        onGoodDelete(idx) {
            this.produceTable.splice(idx,1)
        },
        //判断删除的图片是否是新增加的图片
        checkRemoveInUpdate(file){
            for(var k in this.updateList){
                var url = this.updateList[k].name
                if(file.url == url){
                    this.updateList.splice(k,0)
                    return true
                }
            }
            this.deleteList.push(file.url)
            return false
        },
        handleRemove(file, fileList) {
            if(this.isModify)
                this.checkRemoveInUpdate(file)
            this.fileDisplayList = fileList
            if(fileList.length==0){
                this.fileList_2.splice(0,1)
            }else{
                for (var key in fileList) {
                    var _file = fileList[key]
                    if (_file.uid > file.uid) { //每天添加图片底层自动添加一个时间戳，通过添加的时间来判断在数组中的位置
                        this.fileList_2.splice(key,1)
                        return
                    }
                }
                this.fileList_2.splice(this.fileList_2.length-1,1)
            }
        },
        getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        getFileInfo(evt) {
                var newImg = this.getObjectURL(evt.target.files[0])
                var imgName = evt.target.files[0].name;
                this.form.smallPic = newImg
                this.fileList_1.push(evt.target.files[0])
        },
        getSwiperFileInfo(evt) {
            for (var i = 0; i < evt.target.files.length; ++i) {
                var newImg = this.getObjectURL(evt.target.files[i])
                var imgName = evt.target.files[i].name;
                var fileObj = {name:imgName,url:newImg}
                this.fileDisplayList.push(fileObj)
                this.fileList_2.push(evt.target.files[i]);
                if(this.isModify){
                    this.updateList.push({name:newImg,f:evt.target.files[i]})
                }
            }
        },
        handleClick(e) {
            document.getElementById('uploadfile').click()
        },
        handleSwiperClick(e) {
            document.getElementById('uploadSwiperfile').click()
        },
        onDelete(_idx,row) {
            this.$confirm('是否删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(window.global.debugUrl + "delProduce", {id:row.id,swipePic:row.swipePic,smallPic:row.smallPic}).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.$data.tableData.splice(_idx,1)
                    } else {
                        this.$alert('参数异常', '异常', {
                            confirmButtonText: '确定'
                        });
                    }
                    this.$data.v_form = false
                    this.$data.listLoading = false
                },
                    (res) => {
                        this.$data.listLoading = false
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        getProduceContent(){
            var goods = {}
            for(var key in this.produceTable){
                var _goods = this.produceTable[key]
                goods[_goods.pid] = {alias:_goods.alias,price:_goods.price}
            }
            return JSON.stringify(goods)
        },
        setProduceContent(_goods){
            console.log(_goods)
            var goods =  JSON.parse(_goods)
            console.log(goods)
            for(var key in goods){
                var g = goods[key]
                var obj = {}
                obj.pid = key
                obj.alias = g.alias
                obj.price = g.price
                this.produceTable.push(obj)
            }
        },
        onSubmit() {
            if (this.form.name.toString().trim() == '') {
                this.$alert('请输入商品名称');
                return
            }
            if (this.form.showPrice.toString().trim() == '') {
                this.$alert('请输入商品价格');
                return
            }
           
            if (this.form.introNum.toString().trim() == '') {
                this.$alert('请输入商品介绍的图片张数');
                return
            }
            if (this.form.showType.toString().trim() == '') {
                this.$alert('请输入显示鞋型');
                return
            }
            if (this.form.smallPic.toString().trim() == '') {
                this.$alert('请添加首页的图片');
                return
            }
            if (!this.isModify && this.fileList_1.length == 0) {
                this.$alert('请添加首页的图片');
                return
            }
            // fileList_1:[], //首页的图片
            // fileList_2:[], //轮播的图片
            if (this.fileDisplayList.length == 0) {
                this.$alert('请添加轮播的图片');
                return
            }

            if (this.produceTable.length == 0) {
                this.$alert('请配置货品信息');
                return
            }

            var formData = new FormData()
            formData.append('showPrice', this.form.showPrice);
            formData.append('name', this.form.name);
            formData.append('intro', this.form.intro);
            formData.append('introNum', this.form.introNum);
            formData.append('showType', this.form.showType);
            formData.append('goods', this.getProduceContent());
            formData.append('smallPic', this.old_smallPic);
            if(this.isModify){
                formData.append('id', this.form.id);
                formData.append('swipePic', this.form.swipePic);
                if(this.fileList_1.length>0){
                    formData.append('hasHome', 1)
                    formData.append('cps', this.fileList_1[0])
                }
                for (var key in this.updateList) {
                    var co = this.updateList[key]
                    formData.append('cps', co.f);
                }
            }else{
                formData.append('cps', this.fileList_1[0]);
                for (var key in this.fileList_2) {
                    var co = this.fileList_2[key]
                    formData.append('cps', co);
                }
            }

            if(this.deleteList.length>0){
                formData.append('del', this.deleteList);
            }
            this.saveProduce(formData)
        },
        saveProduce(formData){
            this.$http.post(window.global.serverAdr + "/saveProduceConfig", formData).then((res) => {
                if (res.body.ok) {
                    this.$message({
                        type: 'success',
                        message: '录入成功'
                    })
                    this.$data.v_form = false
                    this.oninitData()
                } else {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.getConfigs()
                this.$data.v_form = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        setImgDisplay(swiperPics){
            var swiperPicArr = swiperPics.split(',')
            for(var k in swiperPicArr){
                var swiperPic = window.global.serverAdr+'/'+swiperPicArr[k]
                var fileObj = {name:'',url:swiperPic}
                this.fileDisplayList.push(fileObj)
            }
            
        },
        onOpenDialog(row) {
            if (row) {
                this.isModify = true
                this.form =  {
                    id:row.id,
                    name: row.name,
                    showPrice: row.showPrice,
                    intro: row.intro,
                    introNum: row.introNum,
                    showType: row.showType,
                    smallPic: row.smallPic,
                    swipePic: row.swipePic,
                }
                this.setProduceContent(row.goods)
                this.setImgDisplay(row.swipePic)
                this.old_smallPic = row.smallPic
            } else {
                this.isModify = false
            }
            this.v_form = true
        },
        handle_setPageSize(pageSize) {
            this.$data.pageSize = pageSize
            this.getConfigs()
        },
        handle_setCurPage(currentPage) {
            this.$data.curPage = currentPage
            this.getConfigs()
        },
        sortData() {
            this.storages = window.global.staticConfigs.gravida_storage_configs
            var states = []
            console.log(this.storages.pid)
            for (var key in this.storages) {
                var s = this.storages[key]
                states.push(s['pid'])
            }
            this.list = states.map(item => {
                return { value: item, label: item };
            });
        },
        getConfigs() {
            this.$data.tableData = []
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v:this.filters
            }
            this.$http.post(window.global.debugUrl + "getProduceConfigs",pos).then((res) => {
                if (res.body.d) {
                    this.$data.total = res.body.d.count;
                    this.$data.tableData = res.body.d.rows;
                } else {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
    },
    mounted(){
        this.getConfigs()
        this.sortData()
    }
}
</script>