import {
  PROJECTS
} from './mutation-types'
import g from '../../../globals/global'
const mutations = {
  [PROJECTS] (state, result) {
    state.projectInfos = result
  }
}

export default mutations
