<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.desc" placeholder="关键词"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.type" placeholder="入库/出库">
                        <el-option label="入库" value="1"></el-option>
                        <el-option label="出库" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getConfigs(filters)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="onOpenDialog()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="type" label='类型' align='center' :formatter="typeFormatter">
                </el-table-column>
                <el-table-column prop="desc" label='原因' align='center'>
                </el-table-column>
                <el-table-column label='操作' align='center'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" type="primary" @click="onDelete(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="类型">
                    <el-select v-model="form.type"  placeholder="入库/出库" >
                        <el-option label="入库" value="1"></el-option>
                        <el-option label="出库" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原因">
                    <el-input v-model="form.desc"></el-input>
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
                type: '1',
                index: '',
                desc: ''
            },
            filters: {
                type: '',
                desc: ''
            },
            tableData: [],
            listLoading: false,
            v_form: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
            in_max_index:0,
            out_max_index:0,
        }
    },
    methods: {
        //顺便统计了下每个行为的最高的索引数目
        typeFormatter(row, column){
            var type= row.type
            if(type == 1){
                if(row.index>this.in_max_index){
                    this.in_max_index = row.index
                }
                return '入库'
            }else{
                if(row.index>this.out_max_index){
                    this.out_max_index = row.index
                }
                return '出库'
            }
        },
        onDelete(_idx,row) {
            var _id = row.id
            var _type = row.type
            var _idx = row.index
            this.$confirm('是否删除该配置条目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(_id)
                this.$http.post(window.global.debugUrl + "delDescConfig", {id:_id,type:_type,index:_idx}).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.$data.tableData.splice(_idx,1)
                         window.global.staticConfigs.gravida_desc_configs = res.body.ok
                    }else if(res.body.err === 0){
                        this.$alert("当前配置已有记录生成,无法删除", '提示', {
                            confirmButtonText: '确定'
                        });
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
        onSubmit() {
            if (this.form.desc.toString().trim() == '') {
                this.$alert('原因');
                return
            }
            if(this.$data.form.type=='1'){
                this.$data.form.index = this.in_max_index
            }else{
                this.$data.form.index = this.out_max_index
            }
            this.$http.post(window.global.debugUrl + "saveDescConfig", this.$data.form).then((res) => {
                if (res.body.ok) {
                    this.$message({
                        type: 'success',
                        message: '录入成功'
                    })
                    this.$data.v_form = false
                    this.$data.form = {
                        desc: '',
                        type: ''
                    }
                    console.log(res.body.ok)
                    window.global.staticConfigs.gravida_desc_configs = res.body.ok
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
                this.form.id = row.id
                this.form.desc = row.desc
                this.form.type = row.type.toString()
            } else {
                delete this.form.id;
                this.form.desc = ''
                this.form.type = '1'
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
        getConfigs(_filter) {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
            }
            if (_filter) pos.v = _filter
            this.$http.post(window.global.debugUrl + "getDescConfigs", pos).then((res) => {
                if (res.body.d) {
                    this.$data.total = res.body.d.count;
                    this.$data.tableData = res.body.d.rows;
                } else {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.filters = {
                        desc: '',
                        type: ''
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