// GLOBAL ROUTER ACCESS DEFAULT
// 1.if you use import xx from thismodule,will use default
// 2.if you use import {xx} from this module,will use the varible have name of xx and will be read only
// 3.if you use import * as xx from thismoudele,will use all as one object name xx
export default {
  r:{
  },
  page:'',
  // debugUrl:'http://121.40.254.174:8101/api/'
  debugUrl:'http://localhost:8101/api/',
  // debugUrl:'http://139.196.238.46:8101/api/',
  staticConfigs:{
    "storage_configs":{
      "N1002":{"id":9,"pid":"N1002","name":"SHOE1002","color":"黑色,红色,绿色","size":"32","color_place":null},
      "N1003":{"id":10,"pid":"N1003","name":"SHOE1003","color":"绿色,棕色,黄色,黑色","size":"32,33,34,35","color_place":null},
      "N1004":{"id":11,"pid":"N1004","name":"SHOE1004","color":"黑色,红色,绿色","size":"32,33,34,35,37","color_place":null}
    },
    "color_configs":{
      "1":{"id":1,"index":1,"color":"黑色"},
      "2":{"id":2,"index":2,"color":"红色"},
      "3":{"id":3,"index":3,"color":"绿色"},
      "4":{"id":4,"index":4,"color":"黄色"},
      "5":{"id":5,"index":5,"color":"粉色"},
      "6":{"id":6,"index":6,"color":"棕色"},
      "7":{"id":7,"index":7,"color":"褐色"},
      "8":{"id":8,"index":8,"color":"蓝色"}},
    "desc_configs":{
      "1":{"id":1,"type":1,"index":1,"desc":"进货"},
      "2":{"id":2,"type":1,"index":2,"desc":"用户退货"},
      "3":{"id":3,"type":2,"index":1,"desc":"被老鼠吃咯"},
      "4":{"id":4,"type":2,"index":2,"desc":"送员工奖励"},
      "5":{"id":5,"type":2,"index":3,"desc":"被小姨子偷咯"},
      "6":{"id":6,"type":2,"index":4,"desc":"发货"}
    }
  }
}