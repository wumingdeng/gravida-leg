<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="订单号/手机号/收货人"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="0">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column width='330' label='商品信息' align='center'>
                    <template scope="scope">
                        <el-col :span="7" style='padding-top:10px;padding-left:0px;padding-right:20px'><img width='100' :src="scope.row.img" class="image">
                        </el-col>
                        <el-col :span="17" style='padding-top:10px;padding-left:20px'>
                            <el-row style='text-align:left'>{{scope.row.shoeName}}</el-row>
                            <el-row style='text-align:left'>
                                <div style='float:left;color:#c0c0c0'>颜色：</div>
                                <div style='color:#ff0000;float:left'>{{scope.row.color}}</div>
                                <div style='float:left;margin-left:20px'>尺码：</div>
                                <div style='color:#ff0000;float:left'>{{scope.row.size}}码</div>
                            </el-row>
                            <el-row style='text-align:left'>
                                <div style='float:left;color:#c0c0c0'>数量：</div>
                                <div style='color:#ff0000;float:left'>{{scope.row.count}}双</div>
                                <div style='float:left;margin-left:20px'>类型: </div>
                                <div style='color:#ff0000;float:left'>{{scope.row.type}}</div>
                            </el-row>
                        </el-col>
                    </template>
                </el-table-column>
                <el-table-column label='金额' width='150' align='center'>
                    <template scope="scope">
                        <el-row>单价:{{scope.row.originalPrice}}￥</el-row>
                        <el-row style='color:#ff0000'>优惠:{{scope.row.originalPrice-scope.row.price}}￥</el-row>
                        <el-row>合计:{{scope.row.price}}￥</el-row>
                    </template>
                </el-table-column>
                <el-table-column width='200' label='订单信息' align='center'>
                    <template scope="scope">
                        <el-row v-if="status==5">NO:{{scope.row.orderid}}</el-row>
                        <el-row v-else>NO:{{scope.row.id}}</el-row>
                        <el-row>{{createdateformatter(scope.row)}}</el-row>
                    </template>
                </el-table-column>
                <el-table-column label='联系方式' align='center' :show-overflow-tooltip="true">
                    <template scope="scope">
                        <el-row>{{scope.row.contact}} {{scope.row.tel}}</el-row>
                        <el-row>{{scope.row.province+" "+scope.row.city+" "+scope.row.area}}</el-row>
                        <el-row>{{scope.row.address}}</el-row>
                    </template>
                </el-table-column>
                <el-table-column v-if="isOprStatus" :label="statusLabel" width="200" align='center' :show-overflow-tooltip="true">
                    <template scope="scope">
                        <el-row>
                            <el-button v-if="scope.row.status == 1" size="small" @click="open2(scope.$index, scope.row)">开始备货</el-button>
                            <el-button v-else-if="scope.row.status == 2" size="small" @click="open2(scope.$index, scope.row)">开始发货</el-button>
                            <el-button v-else-if="scope.row.status == 3" size="small" @click="open2(scope.$index, scope.row)">查看物流</el-button>
                            <el-col v-else-if="scope.row.status == 5" >{{scope.row.content}}</el-col>
                            <el-col v-else-if="scope.row.status == 8" >默认收货</el-col>
                            <el-col v-else-if="scope.row.status == 4" >买家收货</el-col>
                        </el-row>
                        <el-row v-if="scope.row.status == 3">
                            <el-button size="small" @click="open3(scope.$index, scope.row)">修改物流</el-button>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column v-if="isAll" label="状态" width="200" align='center'>
                    <template scope="scope">
                        <el-row>
                            <el-col v-if="scope.row.status == 0" >待付款</el-col>
                            <el-col v-else-if="scope.row.status == 1" >待备货</el-col>
                            <el-col v-else-if="scope.row.status == 2" >待发货</el-col>
                            <el-col v-else-if="scope.row.status == 3" >已发货</el-col>
                            <el-col v-else-if="scope.row.status == 4" >买家收货</el-col>
                            <el-col v-else-if="scope.row.status == 5" >已评价</el-col>
                            <el-col v-else-if="scope.row.status == 6" >用户取消订单</el-col>
                            <el-col v-else-if="scope.row.status == 7" >已退款</el-col>
                            <el-col v-else-if="scope.row.status == 8" >默认收货</el-col>
                            <el-col v-else-if="scope.row.status == 9" >默认取消订单</el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
            </el-pagination>
        </el-row>
        <el-dialog title="快递信息" :visible.sync="dialogFormVisible">
            <el-form :model="expForm">
                <el-form-item label="快递编号" :label-width='formLabelWidth'>
                    <el-input v-model="expForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="快递公司" :label-width="formLabelWidth">
                    <el-select v-model="expForm.no" placeholder="请选择快递公司">
                        <el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit(expForm.idx,expForm.row)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流信息" :visible.sync="dialog_exp_visible">
            <tr v-for="item in info_exps" :label="item.AcceptStation">{{item.AcceptTime}} : {{item.AcceptStation}}</tr>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialog_exp_visible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "../../util/api.js";
import g from "../../globals/global.js";
import expNos from "../../../static/expressNo.json";
export default {
    data() {
        return {
            statusName: [
                '待付款',
                '已付款',
                '未发货',
                '已发货'
            ],
            dialogFormVisible: false,
            dialog_exp_visible: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            listLoading: false,
            status: 0,
            filters: {
                name: ''
            },
            expForm: {
                idx: 0,
                row: {},
                name: '',
                no: ''
            },
            change: false,
            formLabelWidth: '120px',
            options:expNos.data,
            info_exps: []
        }
    },
    methods: {
        fixExpress(row){
            var pos = { 
                    id: row.id,
                    com_no:this.$data.expForm.no,
                    exp_order_no:this.$data.expForm.name
                }
            this.$http.post(g.debugUrl + "fixExpress", pos).then((res) => {
                if (res.body.ok == -2) {
                    this.$alert('session过期', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == -1) {
                    this.$alert('数据库执行失败', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == 102) {
                    this.$alert('参数异常', '提示', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == 1) {
                    this.$message({
                        type: 'success',
                        message: '物流修改成功'
                    })
                    row.exp_com_no = this.$data.expForm.no
                    row.exp_no = this.$data.expForm.name
                    this.$data.expForm = {
                        idx: 0,
                        row: {},
                        name: '',
                        no: ''
                    }
                } else if (res.body.ok == 0) {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.$data.listLoading = false
                this.$data.dialogFormVisible = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        handleEdit(idx, row) {
            this.$data.listLoading = true
            if (this.$data.change) {
                this.fixExpress(row)
                return 
            }
            var st = row.status + 1
            var pos = { id: row.id,status:st}
            if (row.status == 2) {
                pos.com_no = this.$data.expForm.no
                pos.exp_order_no = this.$data.expForm.name
                pos.color=row.color,
                pos.size=row.size,
                pos.amount=row.count,
                pos.pid=row.shoeid
            }
            this.$http.post(g.debugUrl + "updateOrders", pos).then((res) => {
                if (res.body.ok == -2) {
                    this.$alert('session过期,请重新登陆', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == -1) {
                    this.$alert('数据库执行失败', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == 11) {
                    this.$alert('库存不足', '提示', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == window.global.err.WRONG_WEIGHT) {
                    this.$alert('权限不足', '提示', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == 1) {
                    this.$message({
                        type: 'success',
                        message: '订单状态修改成'
                    })
                    this.$data.tableData.splice(idx, 1)
                    this.total -= 1
                    this.onUpdateNavCount()
                    this.$data.expForm = {
                        idx: 0,
                        row: {},
                        name: '',
                        no: ''
                    }
                } else if (res.body.ok == 0) {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.$data.listLoading = false
                this.$data.dialogFormVisible = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        createdateformatter(row) {
            var st = row.status
            var temptime = row.updatetime
            if(temptime==null || st == 0){
                temptime = row.createtime
            }else if(st==5){
                temptime = row.time
            }else if(st == 8 || st == 9 ){
                temptime = row.delivertime
            }
            var unixTimestamp = new Date(temptime * 1000);
            return unixTimestamp.toLocaleString();
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
                status: this.status
            }
            this.$http.post(g.debugUrl + "getOrders", postData).then((res) => {
                if (res.body.d) {
                    if(this.status==5){
                        this.$data.total = res.body.count;
                        this.$data.tableData = res.body.d;
                    }else{
                        this.$data.total = res.body.d.count;
                        this.$data.tableData = res.body.d.rows;
                    }
                }
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        open3(idx, row) {
            this.$data.dialogFormVisible = true
            this.$data.expForm.idx = idx
            this.$data.expForm.row = row
            this.$data.expForm.name = row.exp_no
            this.$data.expForm.no = row.exp_com_no
            this.$data.change = true
        },
        open2(idx, row) {
            this.$data.change = false
            if (this.status == 2) {
                this.$data.dialogFormVisible = true
                this.$data.expForm.idx = idx
                this.$data.expForm.row = row
                this.$data.expForm.name = ''
                this.$data.expForm.no = ''
            } else if (this.status == 3) {
                var pos = {
                    expNo: row.exp_no,
                    expCode: row.exp_com_no,
                  
                }
                this.$data.listLoading = true
                this.$http.post(g.debugUrl + "getExpInfo", pos).then((res) => {
                    if (res.body.ok == -2) {
                        this.$alert('session过期', '异常', {
                            confirmButtonText: '确定'
                        });
                    } else if (res.body.ok == -1) {
                        this.$alert('数据库执行失败', '异常', {
                            confirmButtonText: '确定'
                        });
                    } else if (res.body.ok == 1) {
                        var info = res.body.d
                        if (info["Success"] && !info["Reason"]) {
                            this.$data.info_exps = info["Traces"]
                            this.$data.dialog_exp_visible = true
                        } else {
                            info = info["Reason"]
                            this.$alert(info, '物流信息', {
                                confirmButtonText: '确定'
                            });
                        }
                    }
                    this.$data.listLoading = false
                },
                    (res) => {
                        this.$data.listLoading = false
                    })
            } else if (this.status === 0) {
                return
            } else {
                this.$confirm('是否修改该订单的状态, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleEdit(idx, row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        getUsers() {
            this.$data.listLoading = true
            var postData = {
                offset: 0,
                limit: this.$data.pageSize,
                status: this.status,
                v: this.$data.filters.name,
            }
            this.$http.post(g.debugUrl + "getOrdersBylike", postData).then((res) => {
                if (res.body.d) {
                    if(this.status==5){
                        this.$data.total = res.body.count;
                        this.$data.tableData = res.body.d;
                    }
                    else{
                        this.$data.total = res.body.d.count;
                        this.$data.tableData = res.body.d.rows;
                    }
                } else {
                    this.$alert("数据获取异常", '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        getStatus(path) {
            switch (path) {
                case "/weifukuan":
                    this.status = 0
                    break;
                case "/fukuan":
                    this.status = 1
                    break;
                case "/weishouhuo":
                    this.status = 2
                    break;
                case "/fahuo":
                    this.status = 3
                    break;
                case "/shouhuo":
                    this.status = 4
                    break;
                case "/pingjia":
                    this.status = 5
                    break;
                case "/all":
                    this.status = -1
                    break;
                default:
                    this.status = -1
                    break
            }
            console.log("当前状态为："+this.status)
        },
        //更新导航栏的计数
        onUpdateNavCount() {
            eventBus.$emit("onselectedOrder", { st: this.status, count: this.total })
        },
        setStatutTxt(status){

        }
    },
    computed:{
        isOprStatus(){
            return this.status===1 || this.status===2 || this.status===3 || this.status===4 ||this.status===5
        },
        isAll(){
            return this.status===-1
        },
        ispjOprStatus(){
            return this.status==5
        },
        statusLabel(){
            if(this.status==1 || this.status==2 || this.status==3 || this.status==4){
                return '操作'
            }else if(this.status==5){
                return '评价内容'
            }else{

            }
        }
    },
    mounted() {
        this.getStatus(this.$route.path)
        this.findByPage()
    },
    watch: {
        '$route'(to, from) {
            this.filters.name = ''
            this.getStatus(this.$route.path)
            this.curPage = 1
            this.pageSize = 10
            this.findByPage()
        }
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
