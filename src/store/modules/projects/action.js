import {
  PROJECTS
} from './mutation-types'

import g from '../../../globals/global'
export function push_config({ commit, state }, data) {
  var _self = data.self
  _self.$http.get(g.debugUrl + PROJECTS).then((response) => {
    if (response.body.error) {
      _self.$message({
        message: '推送失败',
        type: 'error'
      });
      _self.$data.listLoading = false
    } else if (response.body.ok == 1) {
      if (data.callback) {
        data.callback(_self, response);
      }
    }
  }, (response) => {
    _self.$message({
      message: '推送失败',
      type: 'error'
    });
    _self.$data.listLoading = false
  });
}

