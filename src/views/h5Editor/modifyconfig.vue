

<template>
    <section>
        <div class="toolbar">
            <el-form :inline="true">
                <el-form-item v-if="type==1" label="体重评估标准">
                </el-form-item>
                <el-form-item v-if="type==0" label="孕周建议事项">
                </el-form-item>
            </el-form>
        </div>
        <el-form :inline="true" :model="formInline" label-width="40px">
            <el-form-item label="孕周">
                <el-input v-model="formInline.minweek" placeholder="起始周"></el-input>
            </el-form-item>
            <el-form-item label="到">
                <el-input v-model="formInline.maxweek" placeholder="起始周"></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="formInline" label-width="100px" style='margin-left:-5px'>
            <el-form-item v-if="type==1" label="体重评估标准">
                <el-radio-group v-model="formInline.type">
                    <el-radio :label="0">偏轻</el-radio>
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="2">偏重</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-else label="标签">
                <el-radio-group v-model="formInline.type">
                    <el-radio :label="0">关键词</el-radio>
                    <el-radio :label="1">饮食</el-radio>
                    <el-radio :label="2">运动</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form ref="form" label-width="40px">
            <el-form-item label="建议">
                <div id="Elem_1" style="text-align:left"></div>
                <el-collapse>
                    <el-collapse-item title="html代码">
                        <div style="text-align:left">
                            <el-input v-model="editorContent_1" type="textarea" rows=20 placeholder="html编辑区" @change="onChange_html_1" style='width:100%;min-height:300px;resize:none'></el-input>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item  :label="type==1?'饮食':''">
                <div id="Elem_2" style="text-align:left;flex:left"></div>
                <el-collapse v-if="type==1">
                    <el-collapse-item title="html代码">
                        <div style="text-align:left">
                            <el-input v-model="editorContent_2" type="textarea" rows=20 placeholder="html编辑区" @change="onChange_html_2" style='width:100%;min-height:300px;resize:none'></el-input>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="saveLoading">保存</el-button>
                <el-button type="primary" @click="onSubmitAndPush" :loading="saveLoading">保存并推送</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import E from 'wangeditor'
import g from "../../globals/global.js";
export default {
    name: 'editorweight',
    data() {
        return {
            html_enable: false,
            saveLoading: false,
            type: 0,
            isModify: false,
            formInline: {
                minweek: '',
                maxweek: '',
                type: 0
            },
            editorContent_1: '',
            editorContent_2: '',
            Elem_1: {},
            Elem_2: {},
        }
    },
    methods: {
        onChange_html_1: function () {
            this.Elem_1.txt.html(this.editorContent_1)
        },
        onChange_html_2: function () {
            this.Elem_2.txt.html(this.editorContent_2)
        },
        handleEdit: function () {

        },
        getContent: function () {
            alert(this.editorContent)
        },
        pushConfig: function () {
            console.log('推送')
            this.$store.dispatch('push_config', {
                self: this,
                callback: function (self, res) {
                    this.$message({
                        message: '保存并推送成功',
                        type: 'success'
                    });
                }
            })
        },
        onSubmitAndPush: function () {
            this.onSubmit(this.pushConfig())
        },
        onSubmit: function (event) {
            this.$data.saveLoading = true
            this.$data.formInline.sug = this.editorContent_1
            this.$data.formInline.diet = this.editorContent_2
            console.log(this.$data.formInline)
            var path = this.type == 1 ? "save_weight_config" : "save_diet_config"
            console.log(path)
            this.$http.post(g.debugUrl + path, this.$data.formInline).then((res) => {
                if (res.body.ok == -2) {
                    this.$alert('session过期', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == -1) {
                    this.$alert('数据库执行失败', '异常', {
                        confirmButtonText: '确定'
                    });
                } else {
                    if (typeof (event) == "function") {
                        event()
                    }else{
                        this.$message({
                            message: '成功',
                            type: 'success'
                        });
                    }
                }
                this.$data.saveLoading = false
            },
                (res) => {
                    this.$data.saveLoading = false
                })
        },
        getConfig: function (row, Elem_1, Elem_2) {
            this.$data.formInline = Object.assign({}, row);
            Elem_1.txt.text(row.con_sug)
            this.editorContent_1 = row.con_sug
            if (this.type == 1) {
                Elem_2.txt.html(row.con_diet)
                this.editorContent_2 = row.con_diet
            }
        }
    },
    mounted() {
        this.$data.type = this.$route.params.type
        this.$data.isModify = this.$route.params.isModify == 1 ? true : false
        var Elem_1 = new E('#Elem_1')
        Elem_1.customConfig.onchange = (html) => {
            this.editorContent_1 = html
        }
        Elem_1.create()
        this.Elem_1 = Elem_1
        console.log(this.type == 1)
        if (this.type == 1) {
            var Elem_2 = new E('#Elem_2')
            Elem_2.customConfig.onchange = (html) => {
                this.editorContent_2 = html
            }
            Elem_2.create()
            this.Elem_2 = Elem_2
        }
        if (this.$data.isModify) {
            this.getConfig(this.$route.params.row, Elem_1, Elem_2)
        }


    }
}
</script>

<style scoped>

</style>