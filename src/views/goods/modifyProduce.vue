<template>
  <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
		<el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
		<el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
		<el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
		<el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
		<el-form-item label="颜色">
            <el-input v-model="form.color"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="onClose">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script type="text/javascript">
export default {
	data() {
		return {
			form: {color:''},
		}
	},
	props: {
		produce: {
			type: Object,
			default: function() {
				return {
				}
			}
		}
	},
	mounted() {

	},
	computed: {
		
	},
	methods: {
		onClose() {

		},
		onSubmit(){

        }
	}
}
</script>