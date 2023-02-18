import axios from 'axios'
import {WebsiteModel} from './model'
import {DataSourceMode, STORAGE_KEY_CUSTOM_DATA_SOURCE, STORAGE_KEY_DATA_SOURCE_MODE} from "../util/consts";

export default {
  getAllData(): Promise<WebsiteModel[]> {
    return new Promise((resolve, reject) => {
      const dataSourceMode = localStorage.getItem(STORAGE_KEY_DATA_SOURCE_MODE) as string
      if (dataSourceMode === DataSourceMode.DEFAULT) {
        axios.get('./data.json')
          .then(res => {
            resolve(res.data)
          })
          .catch(err => reject(err))
      }
      else if (dataSourceMode === DataSourceMode.CUSTOM) {
        resolve(JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_DATA_SOURCE) as string))
      }
    })
  }
}


