<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.pid" placeholder="货号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods()">查询</el-button>
                </el-form-item>
                <el-form-item v-if="isIn">
                    <el-button type="primary" v-on:click="onOperate()">入库</el-button>
                </el-form-item>
                <el-form-item v-else>
                    <el-button type="primary" v-on:click="onOperate()">出库</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog　:visible.sync="form_visible" :title="isIn?'入库操作':'出库操作'">
            <el-form ref="form" :model="form" :rules="formrules" label-width="80px">
                <el-form-item label="货号">
                    <el-select v-model="form.pid" filterable remote placeholder="请输入关键字" :remote-method="remoteMethod" :loading="loading" @change="onSelected">
                        <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="尺码">
                    <el-select id='color' v-model="form.size" placeholder="请选择尺寸">
                        <el-option v-for="s in sizes" :label="s" :value="s" :key="s"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
                
                <el-form-item label="货物颜色">
                    <el-select id='color' v-model="form.color" placeholder="请选择颜色">
                        <el-option v-for="co in colors" :label="co" :value="co" :key="co"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原因">
                    <el-radio-group v-model="form.desc">
                        <el-radio v-for="desc in desc_statics" :key="desc.index" :label="desc.index">{{desc.desc}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.desc_con"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button @click="form_visible=false">取消</el-button>
                </el-form-item>
            </el-form>
            </el-dialog>
            <el-row type="flex" align="middle" :gutter="20">
                <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                    <el-table-column prop="pid" label='货号' align='center'>
                    </el-table-column>
                    <el-table-column label='货名' align='center'>
                        <template scope="scope">
                            {{scope.row.gravida_storage_config.name}}
                        </template>
                    </el-table-column>
                    <el-table-column width='80' prop="color" label='颜色' align='center'>
                    </el-table-column>
                    <el-table-column width='80' prop="size" label='尺寸' align='center'>
                    </el-table-column>
                    <el-table-column prop="amount" label='数量' align='center'>
                    </el-table-column>
                    <el-table-column :label="isIn?'最新入库时间':'最新出库时间'" align='center' prop="updatedAt" :formatter="createdateformatter">
                    </el-table-column>
                    <el-table-column v-if="!isIn" width='80' label='操作' align='center'>
                        <template scope="scope">
                            <el-row>
                                <el-button size="small" type="primary" @click="onOperate(scope.row)">出库</el-button>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row type="flex" justify="end" style="padding:20px 0; ">
                <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
                </el-pagination>
            </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                pid: '',
                size: '',
                name: '',
                amount: '',
                color: '',
                desc_con: '',
                desc: ''
            },
            filters: {
                pid: ''
            },
            options4: [],
            colors: [],
            sizes: [],
            storages: [],
            desc_statics: [],
            list: [],
            loading: false,
            form_visible: false,
            out_visible: false,
            listLoading: false,
            tableData: [],
            curPage: 1,
            pageSize: 10,
            total: 10,
            isIn: false, //是否为出库
            formrules: {
                pid: [
                    { required: true, message: '请输入货号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                size: [
                    { required: true, message: '请输入尺寸', trigger: 'blur' },
                    { type: 'number', message: '尺寸必须为数字值' }
                ],
                amount: [
                    { required: true, message: '请输入数量', trigger: 'blur' },
                    { type: 'number', message: '数量必须为数字值' }
                ],
                color: [
                    { required: true, message: '请选择颜色', trigger: 'change' },
                ],
                desc: [
                    { required: true, message: '请选择理由', trigger: 'change' },
                ],
            }
        }
    },
    methods: {
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
        onSelected(value) {
            if (value == '') return
            var storage = this.storages[value]
            this.sizes = storage.size.split(',')
            this.colors = storage.color.split(",");
            console.log(this.colors)
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
        onSubmit() {
            if (this.form.pid.toString().trim() == '') {
                this.$alert('请输入货号');
                return
            }
            if (this.form.color == '') {
                this.$alert('请选择颜色');
                return
            }
            var re = /^[0-9]+.?[0-9]*$/
            if (this.form.size.toString().trim() == '') {
                this.$alert('请输入尺寸');
                return
            } else {
                if (!re.test(this.form.size)) {
                    this.$alert('尺寸必须为数字');
                    return
                }
            }
            if (this.form.amount.toString().trim() == '') {
                this.$alert('请输入数量');
                return
            } else {
                if (!re.test(this.form.amount)) {
                    this.$alert('数量必须为数字');
                    return
                }
            }
            if (this.form.desc === '') {
                this.$alert('请选择入库理由');
                return
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var url = ""
                    var posData = Object.assign({},this.$data.form)
                    if (!this.isIn) {
                        posData.amount = -Number(this.$data.form.amount)
                    }
                    this.$http.post(window.global.debugUrl + "saveGoods", posData).then((res) => {
                        if (res.body.ok == 1) {
                            this.$message({
                                type: 'success',
                                message: '录入成功'
                            })
                            this.$data.form_visible = false
                            this.$data.form = {
                                pid: "",
                                name: '',
                                amount: '',
                                color: '',
                                size: '',
                                desc_con: '',
                                desc: ''
                            }
                        } else if (res.body.ok == 0) {
                            this.$alert('库存不足', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else if (res.body.ok == window.global.err.WRONG_WEIGHT) {
                            this.$alert('权限不足', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$alert('数据异常', '异常', {
                                confirmButtonText: '确定'
                            });
                        }
                        this.getGoods()
                        this.$data.dialogFormVisible = false
                    },
                        (res) => {
                            this.$data.listLoading = false
                        })
                } else {
                    return false;
                }
            });

        },
        getGoods() {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v:this.filters
            }
            this.$http.post(window.global.debugUrl + "getStorages", pos).then((res) => {
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
        //sign true 为入库，false 为出库
        onOperate(row) {
            delete this.form.id;
            this.form.pid = ''
            this.form.name = ''
            this.form.color = ''
            this.form.size = ''
            this.form.desc = ''
            this.form.desc_con = ''
            this.form_visible = true
            if (row) {
                this.form.pid = row.pid
                this.form.name = row.name
                this.form.size = row.size
                this.form.color = row.color
                this.form.desc = row.desc
                if (this.isIn) { // 修改
                    this.form.desc_con = row.desc_con
                    this.form.amount = row.amount
                    this.form.id = row.id
                }
            }
        },
        handle_setPageSize(pageSize) {
            this.$data.pageSize = pageSize
            this.getGoods()
        },
        handle_setCurPage(currentPage) {
            this.$data.curPage = currentPage
            this.getGoods()
        },
        createdateformatter(row, column) {
            var value = row.updatedAt
            // return value
            var timestamp = Number(Date.parse(new Date(value))) + (8*3600)
           
            return  new Date(timestamp).toLocaleString();
           
        },
        onDelete() {

        },
        handleChange(self) {
            self.value = self.value.replace(/\D/gi, "")
        },
        getStatus(path) {
            if (path == "/in_storage") {
                this.isIn = true
            } else if (path == "/out_storage") {
                this.isIn = false
            }
            this.curPage = 1
            this.pageSize= 10
            var descs = window.global.staticConfigs.gravida_desc_configs
            this.desc_statics = []
            for (var key in descs) {
                var desc = descs[key]
                if (this.isIn && desc['type'] == 1) {
                    this.desc_statics.push(desc)
                } else if (!this.isIn && desc['type'] == 2) {
                    this.desc_statics.push(desc)
                }
            }
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
            this.$http.get(window.global.debugUrl + "getStorageConfigs").then((res) => {
                if (res.body.ok) {
                    window.global.staticConfigs = res.body.ok
                    this.sortData()
                }
            },
                (res) => {
                })
        },
    },
    mounted() {
        this.getStatus(this.$route.path)
        this.getConfigs()
        this.getGoods()
    },
    watch: {
        '$route'(to, from) {
            this.filters.pid = ''
            this.getStatus(this.$route.path)
        }
    }
}
</script>