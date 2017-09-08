<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.color" placeholder="颜色"></el-input>
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
                <el-table-column prop="color" label='颜色' align='center'>
                </el-table-column>
                <el-table-column label='操作' align='center'>
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
        <el-dialog :visible.sync="v_form">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="颜色">
                    <el-input v-model="form.color"></el-input>
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
                color: '',
            },
            filters: {
                color: ''
            },
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
                this.$http.post(window.global.debugUrl + "delColorConfig", {id:_id}).then((res) => {
                    if (res.body.ok) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        window.global.staticConfigs.gravida_color_configs = res.body.ok
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
        onSubmit() {
            if (this.form.color.toString().trim() == '') {
                this.$alert('请输入颜色');
                return
            }
            this.$http.post(window.global.debugUrl + "saveColorConfig", this.$data.form).then((res) => {
                if (res.body.ok) {
                    this.$message({
                        type: 'success',
                        message: '录入成功'
                    })
                    this.$data.v_form = false
                    this.$data.form = {
                        color: '',
                    }
                    window.global.staticConfigs.gravida_color_configs = res.body.ok
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
                this.form.color = row.color
            } else {
                delete this.form.id;
                this.form.color = ''
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
            this.$data.tableData = []
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
            }
            this.$http.post(window.global.debugUrl + "getColorConfigs",pos).then((res) => {
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
    }
}
</script>