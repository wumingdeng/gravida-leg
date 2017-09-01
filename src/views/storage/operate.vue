<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.pid" placeholder="货号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods(filters)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="onOperate(true)">入库</el-button>
                </el-form-item>
                <!--
                <el-form-item>
                    <el-button type="primary" v-on:click="onOperate(false)">出库</el-button>
                </el-form-item>
                -->
            </el-form>
        </div>
        <el-dialog　:visible.sync="form_visible" :title="dialog_title">
            <el-form ref="form" :model="form" :rules="formrules" label-width="80px">
                <el-form-item v-if="isIn" label="货号">
                    <el-input v-model="form.pid"></el-input>
                </el-form-item>
                <el-form-item v-if="isIn" label="尺码" >
                    <el-input v-model="form.size"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item v-if="isIn" label="货物颜色" >
                    <el-select id = 'color' v-model="form.color" placeholder="请选择颜色" >
                        <el-option v-for="(color,idx) in colors" :label="color" :value="idx" :key="idx"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原因" >
                    <el-radio-group v-model="form.desc">
                        <el-radio v-for="(desc,idx) in desc_statics" :key="idx" :label="idx">{{desc}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.desc_con"></el-input>
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
                    <el-table-column prop="name" label='货名' align='center'>
                    </el-table-column>
                    <el-table-column width='80' prop="color" label='颜色' align='center' :formatter="getColor">
                    </el-table-column>
                    <el-table-column width='80' prop="size" label='尺寸' align='center'>
                    </el-table-column>
                    <el-table-column prop="amount" label='数量' align='center'>
                    </el-table-column>
                    <el-table-column label='最新出入库时间' align='center' prop="updatedAt" :formatter="createdateformatter">
                    </el-table-column>
                    <el-table-column  width='80' label='操作' align='center'>
                        <template scope="scope">
                            <el-row>
                                <el-button size="small" type="primary" @click="onOperate(false,scope.row)">出库</el-button>
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
import storage from "../../../storage.json";
export default {
    data() {
        return {
            form: {
                pid: '',
                size: '',
                name: '',
                amount: '',
                color: '',
                desc_con:'',
                desc: ''
            },
            filters: {
                pid: ''
            },
            colors: storage.color,
            desc_statics: {},
            form_visible: false,
            out_visible: false,
            listLoading: false,
            tableData: [],
            curPage: 1,
            pageSize: 10,
            total: 10,
            dialog_title: "",
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
            }else{
                if (!re.test(this.form.size)) {
                    this.$alert('尺寸必须为数字');
                    return
                }
            }
            if (this.form.amount.toString().trim() == '') {
                this.$alert('请输入数量');
                return
            }else{
                if (!re.test(this.form.amount)) {
                    this.$alert('数量必须为数字');
                    return
                }
            }
            if (this.form.desc == '') {
                this.$alert('请选择入库理由');
                return
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var url=""
                    if(!this.isIn){
                        this.$data.form.amount = -Number(this.$data.form.amount)
                        console.log(this.$data.form.amount)
                    }
                    this.$http.post(window.global.debugUrl + "saveGoods", this.$data.form).then((res) => {
                        if (res.body.ok == 1) {
                            this.$message({
                                type: 'success',
                                message: '录入成功'
                            })
                            this.$data.form_visible = false
                            this.$data.form = {
                                pid: "",
                                name: '',
                                amount:'',
                                color: '',
                                size: '',
                                desc_con:'',
                                desc: ''
                            }
                        } else if(res.body.ok == 0){
                            this.$alert('库存不足', '提示', {
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
        getGoods(_filter) {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
            }
            if(_filter) pos.v = _filter
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
        onOperate(arg, row) {
            delete this.form.id;
            console.log(this.form.id)
            this.form.pid = ''
            this.form.name = ''
            this.form.color = ''
            this.form.size = ''
            this.form.desc = ''
            this.form.desc_con = ''
            this.isIn = arg
            this.form_visible = true
            if (arg) {
                this.dialog_title = "入库操作"
                this.desc_statics = storage.in
            } else {
                this.dialog_title = "出库操作"
                this.desc_statics = storage.out
            }
            if (row) {
                this.form.pid = row.pid
                this.form.name = row.name
                this.form.size = row.size
                this.form.color = row.color
                this.form.desc = row.desc
                if(arg){ // 修改
                    console.log(row.id)
                    this.form.desc_con = row.desc_con
                    this.form.amount = row.amount
                    this.form.id = row.id
                }
            }
        },
        getColor(row, column) {
            var value = row.color
            return this.$data.colors[value]
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
        onDelete() {

        },
        handleChange(self) {
            console.log('dkdjkdjk')
            self.value = self.value.replace(/\D/gi, "")
        }
    },
    mounted() {
        this.getGoods()
    }
}
</script>