<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="createdAt" :formatter="createdateformatter" label="创建日期" style="width: 15%">
                </el-table-column>
                <el-table-column prop="username" label="用户名" style="width: 10%">
                </el-table-column>
                <el-table-column prop="password" label="密码" style="width: 10%">
                </el-table-column>
                <el-table-column prop="weight" :formatter="statusFor" label="权限" style="width: 5%">
                </el-table-column>
                <el-table-column prop="familyname" label="真实姓名" style="width: 10%">
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
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" @open="openModifyDialog">
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
                <el-form-item label="权限" prop='weight'>
                    <el-tree :data="weight" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
                    </el-tree>
                    <el-button @click="resetChecked(true)">清空</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="handleEdit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="真实姓名" prop="familyname">
                    <el-input v-model="addForm.familyname"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop='weight'>
                    <el-tree :data="weight" show-checkbox node-key="id" ref="tree_add" highlight-current :props="defaultProps">
                    </el-tree>
                    <el-button @click="resetChecked(false)">清空</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
                id: 0,
                familyname: '',
                username: '',
                weight: [],
                password: ''
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                familyname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                // weight: [
                //     { type: 'array',required: true, message: '请至少选择一个权限', trigger: 'change' }
                // ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ]
            },
            //新增界面数据
            addForm: {
                familyname: '',
                username: '',
                weight: [],
                password: ''
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
            }, {
                id: 2,
                label: '用户管理',
            }, {
                id: 3,
                label: '医院管理',
            }, {
                id: 4,
                label: '文本配置',
                children: [{
                    id: 401,
                    label: '孕周配置'
                }, {
                    id: 402,
                    label: '体重评估配置'
                }]
            }, {
                id: 5,
                label: '入库分销',
                children: [{
                    id: 501,
                    label: '入库'
                }, {
                    id: 502,
                    label: '出库'
                }, {
                    id: 503,
                    label: '记录明细'
                }]
            }, {
                id: 6,
                label: '货品配置',
                children: [
                    {
                        id: 601,
                        label: '货品配置',
                    }, {
                        id: 602,
                        label: '商品配置',
                    }, {
                        id: 603,
                        label: '原因配置',
                    }
                ]

            }, {
                id: 7,
                label: '平台配置',
                children: [
                    {
                        id: 701,
                        label: '平台配置',
                    }, {
                        id: 702,
                        label: '平台用户',
                    }
                ]
            }
            ],
        }
    },
    methods: {
        resetChecked(sign) {
            if (sign) {
                this.$refs.tree.setCheckedKeys([]);
            } else {
                this.$refs.tree_add.setCheckedKeys([]);
            }
        },
        openModifyDialog() {

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
                        this.$http.post(g.debugUrl + "saveAdmin", this.$data.editForm).then((res) => {
                            if (res.body.ok === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                            }
                            else if (res.body.ok == window.global.err.WRONG_WEIGHT) {
                                this.$alert('权限不足', '提示', {
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
        addSubmit: function() {
            if (this.$refs.tree_add.getCheckedKeys().length == 0) {
                this.$alert('请至少选择一个权限', '警告', { confirmButtonText: '确定' })
                return
            }
            this.$data.addForm.weight = this.$refs.tree_add.getCheckedKeys()
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        this.$http.post(g.debugUrl + "saveAdmin", this.$data.addForm).then((res) => {
                            if (res.body.ok === 1) {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.findByPage()
                            } else {
                                this.$alert('提交失败，用户名重复', '警告', {
                                    confirmButtonText: '确定'
                                })
                            }
                        });
                    });
                }
            });
        },
        handleAdd: function() {
            this.addFormVisible = true;
            this.$data.addForm = {
                familyname: '',
                username: '',
                weight: [],
                password: ''
            };
        },
        statusFor(row, column) {
            var value = row.weight
            if (value.length > 1) {
                return "管理员";
            } else {
                return "普通用户";
            }
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
        updateformatter(row, column) {
            var value = row.updatedAt
            var data = value.split('T')[0]
            var time = value.split('T')[1]
            time = time.split('.')[0]
            time = time.substring(0, 5)
            return data + " " + time
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
                status: 1
            }
            this.$http.post(g.debugUrl + "getAdmins", postData, { credentials: true }).then((res) => {
                this.$data.total = res.body.d.count;
                this.$data.tableData = res.body.d.rows;
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        getUsers() {
            this.$data.listLoading = true
            var postData = {
                offset: 0,
                limit: this.$data.pageSize,
                v: this.$data.filters.name,
            }
            console.log(postData)
            this.$http.post(g.debugUrl + "getAdminByName", postData).then((res) => {
                this.$data.total = res.body.d.count;
                this.$data.tableData = res.body.d.rows;
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        }
    },

    mounted() {
        this.findByPage()
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
