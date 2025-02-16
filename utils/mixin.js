import dayjs from 'dayjs'
import id from 'dayjs/locale/id'
import {unformat,formatNumber} from "accounting-js";

export const appMixin = {
    accountingToPrice(data){
        return formatNumber(unformat(data,","),2,".",",")
    },
    accountingToNumber(data){
        return unformat(data,".")
    },
    convertDateFormat(date,format){
        return dayjs(date).locale(id).format(format)
    }
}