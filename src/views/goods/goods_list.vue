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
                        <el-option v-for="(item,idx) in desc" :key="idx" :label="item" :value="idx">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods(filters)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="pid" label='货号' align='center'>
                </el-table-column>
                <el-table-column prop="name" label='货名' align='center'>
                </el-table-column>
                <el-table-column  width='100' prop="amount" label='数量' align='center'>
                </el-table-column>
                <el-table-column prop="desc" label='备注' :formatter="desc_formatter" align='center'>
                </el-table-column>
                <el-table-column prop="desc_con" label='备注' :formatter="desc_formatter" align='center'>
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
import storage from "../../../storage.json";
export default {
    data() {
        return {
            filters: {
                pid: '',
                desc: '',
                type: ''
            },
            desc:{},
            listLoading: false,
            tableData: [],
            curPage: 1,
            pageSize: 10,
            total: 10,
        }
    },
    methods: {
        getGoods(_filter) {
            this.$data.listLoading = true
            var pos = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
            }
            if(_filter) pos.v = _filter
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
                this.desc = storage.in
            } else {
                this.desc = storage.out
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
        createdateformatter(row, column) {
            var value = row.createtime
            var unixTimestamp = new Date(value * 1000);
            // var curTime = unixTimestamp.Format("yyyy-MM-dd");
            
            // return curTime;
            return unixTimestamp.toLocaleString();
        },
        desc_formatter(row, column) {
            var value = row.desc
            if(row.type == 1){
                return storage.in[value]
            }else{
                return storage.out[value]
            }
            
        }
    },
    mounted() {
        this.getGoods()
    }
}
</script>