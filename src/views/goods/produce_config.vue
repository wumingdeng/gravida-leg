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
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="0">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="goods" label='商品内容' align='center'>
                </el-table-column>
                <el-table-column prop="name" label='商品名称' align='center'>
                </el-table-column>
                <el-table-column prop="showPrice" label='价格' width='100' align='center'>
                </el-table-column>
                <el-table-column prop="intro" label='介绍' align='center'>
                </el-table-column>
                <el-table-column prop="introNum" label='介绍图数' width='100' align='center'>
                </el-table-column>
                <el-table-column prop="showType" label='款型' width='100' align='center'>
                </el-table-column>
                <el-table-column  label='首页显示图片' align='center'>
                    <template scope="scope">
                       <img style="width:50%" :src="scope.row.smallPic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="swipePic" label='轮播图片' align='center'>
                </el-table-column>
                <el-table-column label='操作' align='center' width='150'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" type="primary" @click="onDelete(scope.$index, scope.row.id)">删除</el-button>
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
        <el-dialog :visible.sync="v_form" :close-on-press-escape="false" :close-on-click-modal="false">
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
                        <img v-if="form.smallPic" :src="imgSrc" class="avatar" style="max-width:100px">
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
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
                swiperPic: ''
            },
            filters: {
                name: ''
            },
            goods:{
                pid:'',
                alias:'',
                price:''
            },
            fileDisplayList:[], //轮播图片的显示列表
            fileList_1:[], //首页的图片
            fileList_2:[], //轮播的图片
            deleteList:[], //删除的图片的列表
            options4: [],
            tableData: [],
            produceTable:[],
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
                return window.gloabl.serverAdr+'/'+this.form.smallPic
            }else{
                return this.form.smallPic
            }
        }
    },
    methods: {
        onSelected(value) {
            if (value == '') return
            var storage = this.storages[value]
            // this.sizes = storage.size.split(',')
            // this.colors = storage.color.split(",");
            // console.log(this.colors)
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
            this.produceTable.push(this.goods)
            this.resetProduce()
        },
        onGoodDelete(idx) {
            this.produceTable.splice(idx,1)
        },
        handleRemove(file, fileList) {
            this.fileDisplayList = fileList
            if(fileList.length==0){
                this.fileList_2.splice(0,1)
            }else{
                for (var key in fileList) {
                    var _file = fileList[key]
                    if (_file.uid > file.uid) {
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
                console.log(newImg)
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
            }
        },
        handleClick(e) {
            document.getElementById('uploadfile').click()
        },
        handleSwiperClick(e) {
            document.getElementById('uploadSwiperfile').click()
        },
        onDelete(_idx,_id) {
            this.$confirm('是否删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(_id)
                this.$http.post(window.global.debugUrl + "delProduce", {id:_id}).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        window.global.staticConfigs.gravida_produce_configs = res.body.ok
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
            return goods
        },
        onSubmit() {
            // if (this.form.name.toString().trim() == '') {
            //     this.$alert('请输入货号');
            //     return
            // }
            // if (this.form.showPrice.toString().trim() == '') {
            //     this.$alert('请输入货品名称');
            //     return
            // }
            
            // if (this.form.intro.toString().trim() != '') {
            //     this.$alert('未提交图片颜色配置');
            //     return
            // }
            // if (this.form.introNum.toString().trim() != '') {
            //     this.$alert('未提交图片颜色配置');
            //     return
            // }
            // if (this.form.showType.toString().trim() != '') {
            //     this.$alert('未提交图片颜色配置');
            //     return
            // }
            // if (this.form.smallPic.toString().trim() != '') {
            //     this.$alert('未提交图片颜色配置');
            //     return
            // }
            // if (this.form.swiperPic.toString().trim() != '') {
            //     this.$alert('未提交图片颜色配置');
            //     return
            // }

            // if (this.produceTable.length == 0) {
            //     this.$alert('请配置货品信息');
            //     return
            // }

            var formData = new FormData()
            formData.append('showPrice', this.form.showPrice);
            formData.append('name', this.form.name);
            formData.append('intro', this.form.intro);
            formData.append('introNum', this.form.introNum);
            formData.append('showType', this.form.showType);
            formData.append('goods', this.getProduceContent());
            if(this.isModify){
                var idxstr = ''
                for (var key in this.updateList) {
                    var co = this.updateList[key]
                    formData.append('cps', co.file);
                }
            }else{
                formData.append('cps', this.fileList_1[0]);
                for (var key in this.fileList_2) {
                    var co = this.fileList_2[key]
                    formData.append('cps', co);
                }
            }

            if(this.deleteList.length>0){
                var delPos = {}
                delPos.fileNames = this.deleteList
                this.$http.post(window.global.debugUrl + "/delimgs", delPos).then((res) => {
                if (res.body.ok==1) {
                   this.saveProduce(formData)
                }
                this.deleteList = []
            },
                (res) => {
                    this.deleteList = []
                })
            }
            else{
                this.saveProduce(formData)
            }
        },
        saveProduce(formData){
            console.log(window.global.debugUrl)
            this.$http.post(window.global.serverAdr + "/saveProduceConfig", formData).then((res) => {
                if (res.body.ok) {
                    this.$message({
                        type: 'success',
                        message: '录入成功'
                    })
                    this.$data.v_form = false
                    this.$data.form = {
                        color: '',
                    }
                    window.global.staticConfigs.gravida_produce_configs = res.body.ok
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
                    swiperPic: row.swiperPic
                }
            } else {
                this.isModify = false
                delete this.form.id;
                this.form =  {
                    id:'',
                    name: '',
                    showPrice: '',
                    intro: '',
                    introNum: '',
                    showType: '',
                    smallPic: '',
                    swiperPic: ''
                }
                this.fileDisplayList = []
                this.fileList_1 = []
                this.fileList_2 = []
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