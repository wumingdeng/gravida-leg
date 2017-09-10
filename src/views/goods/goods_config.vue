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
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
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
                <el-form-item label="颜色">
                    <el-input v-model="form.color"></el-input><label style='color:#898989'>多个颜色","隔开</label>
                </el-form-item>
                <el-form-item label="货品尺寸">
                    <el-select v-model="form.size" multiple  placeholder="请选择尺寸" >
                        <el-option v-for="s in sizes" :label="s" :value="s" :key="s"></el-option>
                    </el-select>
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
            colors: window.global.staticConfigs.gravida_color_configs,
            sizes:['32','33','34','35','36','37','38','39','40','41','42','43','44','45'],
            tableData: [],
            listLoading: false,
            v_form: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
        }
    },
    methods: {
        onDelete(_idx,_id) {
            this.$confirm('是否删除该配置条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(_id)
                this.$http.post(window.global.debugUrl + "delGoodsConfig", {id:_id}).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        window.global.staticConfigs.gravida_storage_configs = res.body.ok
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
        refreshConfigs() {
            this.$http.get(window.global.debugUrl+"getStorageConfigs").then((res)=>{
                if(res.body.ok){
                    window.global.staticConfigs = res.body.ok
                }  
            },
                (res)=>{
                })
        },
        onSubmit() {
            var regName =/[\u4e00-\u9fa5,/，]/g
            if (this.form.pid.toString().trim() == '') {
                this.$alert('请输入货号');
                return
            }
            if (this.form.name.toString().trim() == '') {
                this.$alert('请输入货品名称');
                return
            }
            if(this.form.color.toString().replace(regName,'') != ''){
                this.$alert('只能输入中文和逗号');
                return
            }
            if(this.form.color.toString().trim()===''){
                this.$alert('请选择颜色');
                return
            }
            if(this.form.size.toString().trim()===''){
                this.$alert('请选择尺寸');
                return
            }
            this.$data.form.color = this.$data.form.color.replace(/，/g,',')
            console.log(this.$data.form.color)
            this.$http.post(window.global.debugUrl + "saveGoodsConfig", this.$data.form).then((res) => {
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
                this.form.color = ''
                this.form.size = []
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
                v:this.filters
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
    mounted(){
        this.getStaticConfigs()
        this.getConfigs()
    }
}
</script>