<template>
    <span>{{sname}}</span>
</template>

<script>
	export default {
	    data () {
			return {
			}
	    },
	    props:['sname'],
		watch: {
			sname(val){
				console.log("________________shenm gui"+val)
			}
		},
		mouted() {
		}
	}
</script>
