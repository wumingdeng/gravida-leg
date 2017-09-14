<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.pid" placeholder="货号/货名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getConfigs()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="onOpenDialog()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="pid" label='货号' align='center'>
                </el-table-column>
                <el-table-column prop="name" label='货名' align='center'>
                </el-table-column>
                <el-table-column prop="color" label='颜色' align='center'>
                </el-table-column>
                <el-table-column prop="size" label='尺寸' align='center'>
                </el-table-column>
                <el-table-column label='操作' align='center'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" type="primary" @click="onDelete(scope.$index, scope.row.id)">删除</el-button>
                            <el-button size="small" type="primary" @click="onOpenDialog(scope.$index, scope.row)">修改</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" :disabled="false" @current-change="handle_setCurPage">
            </el-pagination>
        </el-row>
        <el-dialog :visible.sync="v_form">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="货品号">
                    <el-input v-model="form.pid"></el-input>
                </el-form-item>
                <el-form-item label="货品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="颜色显示">
                    <el-table :data="colorTable" border ref="singleTable" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column prop="color" label="颜色" width="180">
                        </el-table-column>
                        <el-table-column prop="pic" label="图片" width="180" align='center'>
                            <template scope="scope">
                                <img style='width:50%;' :src = "scope.row.pic" @click="onClikcPic"/>
                            </template>
                        </el-table-column>
                        <el-table-column label='操作' align='center'>
                            <template scope="scope">
                                <el-row>
                                    <el-button size="small" type="primary" @click="onColorDelete(scope.$index)">删除</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="颜色编辑">
                    <el-upload style="float:left" class="upload-demo" ref="upload" :action="updateUrl" disabled :show-file-list="false" :auto-upload="false" list-type="picture-card">
                        <img v-if="colorPic.pic" :src="colorPic.pic" class="avatar" style="max-width:100px">
                        <i v-else class="el-icon-plus avatar-uploader-icon" v-on:click="handleClick"></i>
                    </el-upload>
                    <input type="file" id="uploadfile" accept="audio/mpeg,image/png,image/jpeg" style="display:none;width:250px;" v-on:change="getFileInfo" />
                    <el-input v-model="colorPic.color" placeholder="请输入颜色值" style="width:30%;float:left;margin-left:10px"></el-input>
                    <el-button style="float:left;margin-left:10px"  type="primary" @click="addColorPic">提交</el-button>
                    <el-button style="float:left"  type="primary" @click="resetColorPic">重置</el-button>
                </el-form-item>
                <el-form-item label="货品尺寸">
                    <el-select v-model="form.size" multiple placeholder="请选择尺寸">
                        <el-option v-for="s in sizes" :label="s" :value="s" :key="s"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button @click="v_form=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="dialogVisible" size="tiny">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                name: '',
                pid: '',
                color: '',
                size: []
            },
            filters: {
                pid: ''
            },
            colorTable:[],
            sizes: ['32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
            tableData: [],
            listLoading: false,
            v_form: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
            colorPic:{
                color:'',
                pic:'',
                file:''
            },
            dialogVisible:false,
            dialogImageUrl: '',
            selectedRow:null
        }
    },
    computed: {
        updateUrl() {
            // return window.global.serverAdr+'/saveGoodCps'
            return ''
        }
    },
    methods: {
        rowClick(row, event, column) {
            if(this.selectedRow){
                console.log(row.$index)
            }else{
                this.selectedRow = row
            }
        },
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handleCurrentChange(val) {
            if(this.selectedRow){
                if(this.selectedRow.$index==val.$index){
                    console.log("取消")
                    this.$refs.singleTable.setCurrentRow();
                    this.selectedRow = null
                }else{

                }
            }else{
                this.selectedRow = val;
                console.log('赋值:'+this.selectedRow)
                
            }
        },
        onColorDelete(idx) {
            this.colorTable.splice(idx,1)
        },
        onClikcPic() {
            console.log('点击我干嘛')
            this.dialogImageUrl = this.colorPic.pic
            this.dialogVisible = true
        },
        resetColorPic() {
            this.colorPic.pic = ''
            this.colorPic.color = ''
            this.colorPic.file = ''
        },
        addColorPic() {
            if (this.colorPic.color.toString().trim() === '') {
                this.$alert('请输入颜色');
                return
            }
            
            if (this.colorPic.color.toString().replace(/[\u4e00-\u9fa5]/g, '') != '') {
                this.$alert('只能输入中文');
                return
            }
            if (this.colorPic.color.toString().indexOf('色')<0) {
                this.$alert('请输入正常的颜色值');
                return
            }
            console.log(this.colorPic.file)
            if (this.colorPic.file === '') {
                this.$alert('请选择图片');
                return
            }
            var colorpic = Object.assign({},this.colorPic)
            this.colorTable.push(colorpic)
            this.colorPic.pic = ''
            this.colorPic.color = ''
            this.colorPic.file = ''
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
        handleRemove(file, fileList) {
            var i = 0
            for (var key in this.fileList) {
                if (file.name === key) {
                    console.log(key)
                    this.fileList2.splice(i, 1)
                    delete this.fileList[key];
                }
                i++
            }
        },
        handlePreview(file) {

        },
        handleChange(file, _fileList) {
        },
        getFileInfo(evt) {
            for (var i = 0; i < evt.target.files.length; ++i) {
                var newImg = this.getObjectURL(evt.target.files[i])
                var imgName = evt.target.files[i].name;
                this.colorPic.file = evt.target.files[i];
                this.colorPic.pic = newImg
            }
        },
        handleClick(e) {
            document.getElementById('uploadfile').click()
        },
        onDelete(_idx, _id) {
            this.$confirm('是否删除该配置条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(_id)
                this.$http.post(window.global.debugUrl + "delGoodsConfig", { id: _id }).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        window.global.staticConfigs.gravida_storage_configs = res.body.ok
                        this.$data.tableData.splice(_idx, 1)
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
        refreshConfigs() {
            this.$http.get(window.global.debugUrl + "getStorageConfigs").then((res) => {
                if (res.body.ok) {
                    window.global.staticConfigs = res.body.ok
                }
            },
                (res) => {
                })
        },
        onSubmit() {
            if (this.form.pid.toString().trim() == '') {
                this.$alert('请输入货号');
                return
            }
            if (this.form.name.toString().trim() == '') {
                this.$alert('请输入货品名称');
                return
            }
            
            if (this.colorPic.pic.toString().trim() != '') {
                this.$alert('未提交图片颜色配置');
                return
            }

            if (this.colorPic.color.toString().trim() != '') {
                this.$alert('未提交图片颜色配置');
                return
            }

            if (this.colorTable.length == 0) {
                this.$alert('请配置货品颜色以及图片');
                return
            }

            var formData = new FormData()
            formData.append('pid', this.form.pid);
            formData.append('name', this.form.name);
            formData.append('size', this.form.size);
            var colorStr = ''
            for (var key in this.colorTable) {
                var co = this.colorTable[key]
                formData.append('cps', co.file);
                colorStr += co.color+","
            }
            colorStr = colorStr.substr(0,colorStr.length-1)
            formData.append('color', colorStr);
       
            this.$http.post(window.global.serverAdr + "/saveGoodCps", formData).then((res) => {
                if (res.body.ok) {
                    this.$message({
                        type: 'success',
                        message: '录入成功'
                    })
                    this.$data.v_form = false
                    this.$data.form = {
                        pid: "",
                        name: '',
                        color: '',
                        size: []
                    }
                    window.global.staticConfigs.gravida_storage_configs = res.body.ok
                    this.refreshConfigs()
                } else {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.colorTable = []
                this.getConfigs()
                this.$data.v_form = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        onOpenDialog(index, row) {
            if (row) {
                this.form.pid = row.pid
                this.form.name = row.name
                this.form.id = row.id
                this.form.color = row.color
                this.form.size = row.size.split(",")
            } else {
                delete this.form.id;
                this.form.pid = ''
                this.form.name = ''
                this.colorPic.color=''
                this.colorPic.pic=''
                this.colorPic.file=''
                this.form.size = [],
                this.colorTable =[]
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
        getConfigs() {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v: this.filters
            }
            this.$http.post(window.global.debugUrl + "getGoodsConfig", pos).then((res) => {
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
        getStaticConfigs() {
            this.$http.get(window.global.debugUrl + "getStorageConfigs").then((res) => {
                if (res.body.ok) {
                    window.global.staticConfigs = res.body.ok
                }
            },
                (res) => {
                })
        },
    },
    mounted() {
        console.log("mounted")
        this.getStaticConfigs()
        this.getConfigs()
    }
}
</script>
<style type="text/css">
.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
}

.el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
}

.el-upload--picture-card {
    cursor: pointer;
    line-height: 115px;
}
</style>