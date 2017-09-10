<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.pid" placeholder="货号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.type" placeholder="入库/出库" @change="selectType">
                        <el-option label="入库" value="1"></el-option>
                        <el-option label="出库" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.desc" placeholder="请选择行为">
                        <el-option v-for="(item,idx) in option_descs" :key="idx" :label="item.desc" :value="item.idx">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="pid" label='货号' align='center'>
                </el-table-column>
                <el-table-column label='货名' align='center'>
                    <template scope="scope">
                            {{scope.row.gravida_storage_config.name}}
                        </template>
                </el-table-column>
                <el-table-column  width='100' prop="amount" label='数量' align='center'>
                </el-table-column>
                <el-table-column  width='100' prop="color" label='颜色' align='center'>
                </el-table-column>
                <el-table-column  width='100' prop="size" label='尺寸' align='center'>
                </el-table-column>
                <el-table-column prop="desc" label='原因' :formatter="desc_formatter" align='center'>
                </el-table-column>
                <el-table-column prop="desc_con" label='备注' align='center'>
                </el-table-column>
                <el-table-column label='执行时间' align='center' prop="createtime" :formatter="createdateformatter">
                </el-table-column>
                <el-table-column width='80' label='操作' align='center'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" type="primary" @click="onDelete(scope.$index, scope.row)">删除</el-button>
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
            filters: {
                pid: '',
                desc: '',
                type: ''
            },
            option_descs:{},
            listLoading: false,
            tableData: [],
            curPage: 1,
            pageSize: 10,
            total: 10,
            in_desc:{},
            out_desc:{},
            txt_in_desc:{},
            txt_out_desc:{},
        }
    },
    methods: {
        getGoods() {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v:this.filters
            }
            this.$http.post(window.global.debugUrl + "getStorage_records", pos).then((res) => {
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
        selectType(value) {
            this.filters.desc = ''
            if (value == 1) {
                this.option_descs = this.in_desc
                console.log(this.option_descs)
            } else {
                this.option_descs = this.out_desc
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
            var value = row.createtime
            var unixTimestamp = new Date(value * 1000);
            return unixTimestamp.toLocaleString();
        },
        desc_formatter(row, column) {
            var value = row.desc
            if(row.type == 1){
                return this.txt_in_desc[value]
            }else{
                return this.txt_out_desc[value]
            }
        },
        sortStaicData(){
            this.in_desc=[]
            this.out_desc=[]
            var descs = window.global.staticConfigs.gravida_desc_configs
            for(var key in descs){
               var desc = descs[key]
               if(desc['type']==1){
                   this.txt_in_desc[desc.index] = desc.desc
                   this.in_desc.push({idx:desc.index,desc:desc.desc})
               }else{
                   this.txt_out_desc[desc.index] = desc.desc
                   this.out_desc.push({idx:desc.index,desc:desc.desc})
               }
            }
        },
        getConfigs() {
            this.$http.get(window.global.debugUrl + "getStorageConfigs").then((res) => {
                if (res.body.ok) {
                    window.global.staticConfigs = res.body.ok
                    this.sortStaicData()
                }
            },
                (res) => {
                })
        },
    },
    mounted() {
        this.getConfigs()
        this.getGoods()
    }
}
</script>