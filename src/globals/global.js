// GLOBAL ROUTER ACCESS DEFAULT
// 1.if you use import xx from thismodule,will use default
// 2.if you use import {xx} from this module,will use the varible have name of xx and will be read only
// 3.if you use import * as xx from thismoudele,will use all as one object name xx
// var  webConfig = require('../../static/config_local.json')
// var  webConfig = require('../../static/config_test.json')
var  webConfig = require('../../static/config_139.json')
// var  webConfig = require('../../static/config_121.json')

console.log(process.env.NODE_ENV )
export default {
  r:{
  },
  page:'',
  serverAdr:webConfig.serverAdr,
  debugUrl:webConfig.debugUrl,
  staticConfigs:{
    "gravida_storage_configs":{
      "N1002":{"id":9,"pid":"N1002","name":"SHOE1002","color":"黑色,红色,绿色","size":"32","color_place":null},
      "N1003":{"id":10,"pid":"N1003","name":"SHOE1003","color":"绿色,棕色,黄色,黑色","size":"32,33,34,35","color_place":null},
      "N1004":{"id":11,"pid":"N1004","name":"SHOE1004","color":"黑色,红色,绿色","size":"32,33,34,35,37","color_place":null}
    },
    "gravida_color_configs":{
      "1":{"id":1,"index":1,"color":"黑色"},
      "2":{"id":2,"index":2,"color":"红色"},       "3":{"id":3,"index":3,"color":"绿色"},
      "4":{"id":4,"index":4,"color":"黄色"},
      "5":{"id":5,"index":5,"color":"粉色"},
      "6":{"id":6,"index":6,"color":"棕色"},
      "7":{"id":7,"index":7,"color":"褐色"},
      "8":{"id":8,"index":8,"color":"蓝色"}},
    "gravida_desc_configs":{
      "1":{"id":1,"type":1,"index":0,"desc":"进货"},
      "2":{"id":2,"type":1,"index":1,"desc":"用户退货"},
      "3":{"id":3,"type":2,"index":0,"desc":"被老鼠吃咯"},
      "4":{"id":4,"type":2,"index":1,"desc":"送员工奖励"},
      "5":{"id":5,"type":2,"index":2,"desc":"被小姨子偷咯"},
      "6":{"id":6,"type":2,"index":3,"desc":"发货"}
    }
  },
  orderStatus:{
    NOTPAY:0,   //已下单 待支付
    PAYED_NO_DELIVER:1, //已支付 待备货
    DELIVER_NO_CHOICE:2,   //已备货 待发货
    DELIVER_NO_RECEIPT:3,   //已发货 待收货
    RECEIPT_NO_EVALUATE:4,  //已确认送达 待评价
    FINISH:5,    //已评价
    CANCELED:6,  //用户取消订单
    REFUND:7,    //已退款
    AUTO_RECEIPT:8,  //时间到默认收货
    AUTO_CANCELED:9  //时间到默认取消
  },
  err:{
  }
}