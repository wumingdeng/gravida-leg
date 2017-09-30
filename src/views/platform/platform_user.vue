<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="findByPage">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="createdAt" :formatter="createdateformatter" label="创建日期">
                </el-table-column>
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <el-table-column prop="password" label="密码">
                </el-table-column>
                <el-table-column prop="familyname" label="真实姓名">
                </el-table-column>
                <el-table-column prop="platform" label="平台">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
            </el-pagination>
        </el-row>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" @close="onclose">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="真实姓名" prop="familyname">
                    <el-input v-model="editForm.familyname"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select v-model="editForm.platform" filterable remote placeholder="请输入关键字" :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限">
                    <el-tree :data="weight" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
                    </el-tree>
                    <el-button @click="resetChecked">清空</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="handleEdit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "../../util/api.js";
import g from "../../globals/global.js";
export default {
    data() {
        return {
            curRow: {},
            curPage: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            listLoading: false,

            list:[], 
            options4:[],
            loading:false,
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                familyname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                weight: [
                    { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ]
            },
            //编辑界面数据
            editForm: {
                id: '',
                familyname: '',
                username: '',
                weight: [],
                password: '',
                platform:''
            },
            filters: {
                name: ''
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            weight: [{
                id: 1,
                label: '订单管理',
                children: [{
                    id: 101,
                    label: '待付款',
                }, {
                    id: 102,
                    label: '待备货'
                }, {
                    id: 103,
                    label: '待发货'
                }, {
                    id: 104,
                    label: '已发货'
                }, {
                    id: 105,
                    label: '已收货'
                }, {
                    id: 106,
                    label: '已评价'
                }, {
                    id: 107,
                    label: '所有订单'
                }
                ]
            },]
        }
    },
    methods: {
        onclose() {
             this.editForm = {
                id: '',
                familyname: '',
                username: '',
                weight: [],
                password: '',
                platform:''
            }
            this.editLoading = false
        },
        resetChecked() {
            this.$refs.tree.setCheckedKeys([]);
        },
        onEdit(idx, row) {
            this.$data.editFormVisible = true
            row.weight = row.weight.toString().split(',')
            this.$data.editForm = Object.assign({}, row);
            this.curRow = row
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(this.curRow.weight)
            })
        },
        handleEdit: function() {
            if (this.editForm.platform === '') {
                this.$alert('请选择平台', '警告', { confirmButtonText: '确定' })
                return
            }
            if (this.$refs.tree.getCheckedKeys().length == 0) {
                this.$alert('请至少选择一个权限', '警告', { confirmButtonText: '确定' })
                return
            }
            this.$data.editForm.weight = this.$refs.tree.getCheckedKeys()
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.$data.editLoading = true
                        Object.assign(this.curRow, this.$data.editForm);
                        this.$http.post(g.debugUrl + "savePlatformUser", this.$data.editForm).then((res) => {
                            if (res.body.ok === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.findByPage()
                            }
                            else if (res.body.ok == window.global.err.WRONG_WEIGHT) {
                                this.$alert('权限不足', '提示', {
                                    confirmButtonText: '确定'
                                });
                            }else if(res.body.ok == window.global.err.WRONG_SESSION_ERROR){
                                this.$alert('session过期，请重新登陆', '提示', {
                                    confirmButtonText: '确定'
                                });
                            }else if(res.body.ok == window.global.err.WRONG_USER_EXIST){
                                this.$alert('用户名已存在', '提示', {
                                    confirmButtonText: '确定'
                                });
                            }else{
                                this.$alert('执行异常', '提示', {
                                    confirmButtonText: '确定'
                                });
                            }
                            this.$data.editLoading = false
                        },
                            (res) => {
                                this.$data.listLoading = false
                            })
                    });
                }
            })
        },
        handleDelete(idx, row) {
            this.$confirm('确认删除吗？', '提示', {}).then(() => {
                this.$data.listLoading = true
                this.$http.post(g.debugUrl + "delAdmin", { id: row.id }).then((res) => {
                    if (res.ok == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$data.tableData.splice(idx, 1)
                    }
                    this.$data.listLoading = false
                },
                    (res) => {
                        this.$data.listLoading = false
                    })
            });
        },
        handleAdd: function() {
            this.editFormVisible = true;
            this.$data.editForm = {
                familyname: '',
                username: '',
                password: '',
                weight: [],
                platform:''
            };
            this.$nextTick(() => {
                this.resetChecked()
            })
        },
        createdateformatter(row, column) {
            var value = row.createdAt
            if (value) {
                var data = value.split('T')[0]
                var time = value.split('T')[1]
                time = time.split('.')[0]
                time = time.substring(0, 5)
                return data + " " + time
            } else {
                return ""
            }
        },
        handle_setPageSize(pageSize) {
            this.$data.pageSize = pageSize
            this.findByPage()
        },
        handle_setCurPage(currentPage) {
            this.$data.curPage = currentPage
            this.findByPage()
        },
        findByPage() {
            this.$data.listLoading = true
            var postData = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v: this.filters
            }
            this.$http.post(g.debugUrl + "getPlatformUsers", postData, { credentials: true }).then((res) => {
                if(res.body.d){
                    this.$data.total = res.body.d.count;
                    this.$data.tableData = res.body.d.rows;
                }
            },
                (res) => {
                })
            this.$data.listLoading = false
        },
        getPlatform() {
            this.$http.post(g.debugUrl + "getPlatforms",{}).then((res) => {
                if (res.body.d) {
                    var platforms = res.body.d.rows
                    var states = []
                    for (var key in platforms) {
                        var s = platforms[key]
                        states.push(s)
                    }
                    this.list = states.map(item => {
                        return { value: item.id, label: item.name };
                    });
                }
            },
                (res) => {
                })
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
    },

    mounted() {
        this.findByPage()
        this.getPlatform()
    },
    created() {
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
