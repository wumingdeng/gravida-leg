<template>
    <section>
        <el-form :inline="true" :model="formInline" style='margin-left:70px'>
            <el-form-item label="孕周">
                <el-input v-model="formInline.start" placeholder="起始周"></el-input>
            </el-form-item>
            <el-form-item label="到">
                <el-input v-model="formInline.end" placeholder="起始周"></el-input>
            </el-form-item>
        </el-form>
        <el-form ref="form" label-width="110px">
            <el-form-item label="体重评估标准">
                <el-radio-group v-model="formInline.size">
                    <el-radio label="偏轻"></el-radio>
                    <el-radio label="正常"></el-radio>
                    <el-radio label="偏重"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="建议">
                <div id="Elem_1" style="text-align:left"></div>
            </el-form-item>
            <el-form-item label="饮食注意点">
                <div id="Elem_2" style="text-align:left"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import E from 'wangeditor'

    export default {
      name: 'editorweight',
      data () {
        return {
            formInline: {
                start: '',
                end: '',
                size: ''
            },
            editorContent_1: '',
            editorContent_2: '',
        }
      },
      methods: {
        getContent: function () {
            alert(this.editorContent)
        },
        onSubmit:function(event){
            
        }
      },
      mounted() {
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
      }
    }
</script>

<style scoped>
</style>