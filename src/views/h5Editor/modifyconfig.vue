

<template>
    <section>
        <div class="toolbar">
            <el-form :inline="true" >
                <el-form-item v-if="type==1" label="体重评估标准">
                </el-form-item>
                <el-form-item v-if="type==0" label="孕周建议事项">
                </el-form-item>
            </el-form>
        </div>
        <el-form :inline="true" :model="formInline" label-width="40px">
            <el-form-item label="孕周">
                <el-input v-model="formInline.start" placeholder="起始周"></el-input>
            </el-form-item>
            <el-form-item label="到">
                <el-input v-model="formInline.end" placeholder="起始周"></el-input>
            </el-form-item>
        </el-form>
        <el-form  :model="formInline" label-width="100px"  v-if="type==1" style='margin-left:-5px'>
            <el-form-item label="体重评估标准">
                <el-radio-group v-model="formInline.weight_size">
                    <el-radio label="0">偏轻</el-radio>
                    <el-radio label="1">正常</el-radio>
                    <el-radio label="2">偏重</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form ref="form" label-width="40px">
            <el-form-item label="建议">
                <div id="Elem_1" style="text-align:left"></div>
            </el-form-item>
            <el-form-item label="饮食">
                <div id="Elem_2" style="text-align:left"></div>
            </el-form-item>
            <el-form-item label="运动" v-if="type==0">
                <div id="Elem_3" style="text-align:left"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="saveLoading">保存</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import E from 'wangeditor'
    import g from "../../globals/global.js";
    export default {
      name: 'editorweight',
      data () {
        return {
            saveLoading:false,
            type:0,
            isModify:false,
            formInline: {
                start: '',
                end: '',
                weight_size: ''
            },
            editorContent_1: '',
            editorContent_2: '',
            editorContent_3: '',
        }
      },
      methods: {
        getContent: function () {
            alert(this.editorContent)
        },
        onSubmit:function(event){
            this.$data.saveLoading = true
            this.$data.formInline.sug = this.editorContent_1
            this.$data.formInline.diet = this.editorContent_2
            this.$data.formInline.sign = this.editorContent_3
            this.$data.formInline.type = this.$data.type
            
            console.log(this.$data.formInline)
            this.$http.post(g.debugUrl+"save_config", this.$data.formInline).then((res)=>{
                if(res.body.ok == -2){
                    this.$alert('session过期', '异常', {
                    confirmButtonText: '确定'
                    });
                }else if(res.body.ok == -1){
                    this.$alert('数据库执行失败', '异常', {
                    confirmButtonText: '确定'
                    });
                }else{
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }
                this.$data.saveLoading = false    
            },
            (res)=>{
                this.$data.saveLoading = false   
            })
        },
        getConfig:function(row,Elem_1,Elem_2,Elem_3){
            this.$data.formInline = Object.assign({}, row);
            console.log(this.$data.formInline.weight_size)
            Elem_1.txt.html(row.con_sug)
            this.editorContent_1 = row.con_sug
            Elem_2.txt.html(row.con_diet)
            this.editorContent_2 = row.con_diet
            if(Elem_3){
                this.editorContent_3 = row.con_sign
                Elem_3.txt.html(row.con_sign)
            }
                
        }
      },
      mounted() {
        this.$data.type = this.$route.params.type
        this.$data.isModify = this.$route.params.isModify == 1?true:false
        

        var Elem_1 = new E('#Elem_1')
        Elem_1.customConfig.onchange = (html) => {
          this.editorContent_1 = html
        }
        Elem_1.create()

        var Elem_2 = new E('#Elem_2')
        Elem_2.customConfig.onchange = (html) => {
          this.editorContent_2 = html
        }
        Elem_2.create()

        if(this.$data.type==0){
            var Elem_3 = new E('#Elem_3')
            Elem_3.customConfig.onchange = (html) => {
            this.editorContent_3 = html
            }
            Elem_3.create()
        }
        if(this.$data.isModify){
            this.getConfig(this.$route.params.row,Elem_1,Elem_2,Elem_3)
        }
      }
    }
</script>

<style scoped>
</style>