<template>
    <div v-bind:class="{app_width_large: width >= 504, app_width_small:width < 504}">
        <header-menu v-bind:scroll-y="scrollY" v-bind:current-tab="currentTab" v-bind:width="width" v-on:@change-tab="changeTab"></header-menu>

            <div class="reportBtn-wrap">
                <span class="nanumSqure reportBtn" v-on:click="chartReport = !chartReport">
                    {{currentTab.currentTabName}} 세탁기 리포트&nbsp;
                    <i v-show="!chartReport" class="fas fa-caret-down"></i>
                    <i v-show="chartReport" class="fas fa-caret-up"></i>
                </span>
            </div>

        <span class="chartTabBtn-wrap" v-show="chartReport">
            <button v-on:click="changeReportTab"
                    v-bind:class="{activeReportBtn:weekChartReport, disactiveReportBtn:!weekChartReport}">요일별</button>
            <button v-on:click="changeReportTab"
                    v-bind:class="{activeReportBtn:timeChartReport, disactiveReportBtn:!timeChartReport}">시간별</button>
        </span>

        <time-chart v-if="chartReport*timeChartReport" v-bind:time-chart-data="timeChartData"></time-chart>
        <week-chart v-else-if="chartReport*weekChartReport" v-bind:week-chart-data="weekChartData"></week-chart>

        <laundry v-bind:current-tab="currentTab" v-bind:width="width"></laundry>
        <subscribe v-bind:current-tab="currentTab" v-bind:width="width"></subscribe>
        <div></div>
    </div>
</template>

<script>
window.$ = window.jQuery = require('jquery');
require('bootstrap-sass');
import Vue from 'vue';

//moment.js
import moment from 'moment'
Vue.use(moment)

//Style.css
import '../css/style.css'

//Vue.components
import headerMenu from '../components/headerMenu.vue'
import laundry from '../components/laundry.vue'
import subscribe from '../components/subscribe.vue'
import weekChart from './../components/weekChart.vue'
import timeChart from './../components/timeChart.vue'

import eventBus from './event-bus.js'

//vue firebase
import firebase from 'firebase'

import axios from 'axios'
import Message from 'vue-m-message'
Vue.use(Message)

let serviceAccount = require("./ajouServicekey.json");

let firebaseConfig = {
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://my-project-1545408248351.firebaseio.com",
}

let app = firebase.initializeApp(firebaseConfig)

export default {
    data() {
        return {
            currentTab: {
                'currentTabName' : '국제학사',
                'currentTabValue' : 'ilaundry',
            },

            scrollY : null,
            width : null,

            chartReport : false,

            weekChartReport : true,
            weekChartData : Object,

            timeChartReport : false,
            timeChartData : Object,
        }
    },

    created() {
        //eventbus를 통한 이벤트 전달
       eventBus.$on("@submit-subscribe-success", () => {
            this.$message({
                message:"카카오 알림 서비스 신청되었습니다",
                type:'success',
                showClose:true
            })
        })

       eventBus.$on("@submit-error", () => {
            this.$message({
                message:"오류가 발생하였습니다",
                type:'error',
                showClose:true,
            })
        })

       eventBus.$on("@submit-input-error", () => {
            this.$message({
                message:"입력된 내용이 없습니다",
                type:'error',
                showClose:true,
                zIndex:10000,
            })
        })

       eventBus.$on("@submit-valid-error", () => {
            this.$message({
                message:"입력 형식이 잘못되었습니다",
                type:'error',
                showClose:true,
                zIndex:10000,
            })
        })
    },

    mounted() {
        window.addEventListener('load', () => {
            this.width = window.innerWidth
        })

        window.addEventListener('resize', () => {
            this.width = window.innerWidth
        })

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY
        })

        //차트 데이터 마운트하기
        this.getTimeChartData()
        this.getWeekChartData()
    },

    methods:{
        changeTab(e) {
            this.currentTab = e

            this.getTimeChartData()
            this.getWeekChartData()

            eventBus.$emit("@change-tab")

        },

        changeReportTab(e) {
            if ((e.target.innerHTML == "요일별") && (this.weekChartReport == false)) {
                this.weekChartReport = !this.weekChartReport
                this.timeChartReport = !this.timeChartReport
            } else if ((e.target.innerHTML == "시간별") && (this.timeChartReport == false)) {
                this.weekChartReport = !this.weekChartReport
                this.timeChartReport = !this.timeChartReport
            }
        },

        getTimeChartData() {
            //renderChart function renders the chart with the datacollection and options object.
            const beforeDay = moment(new Date()).subtract(7, 'days').format("YYYYMMDD")
            const timeArray = Array()
            const timeLogArray = Array()
            const timeRef = firebase.database().ref('activeLog').child(this.currentTab.currentTabValue).child(beforeDay)

            for(var i = 0; i<12; i++) {
                if(2*(i+1) < 10) {
                    timeArray[i] = '0' + (2*(i+1))
                }else {
                    timeArray[i] = (2*(i+1))
                }
            }

            timeRef.on('value', function (snapshot) {
                for (var i in timeArray) {
                    timeLogArray[i] = snapshot.child(timeArray[i]).numChildren()
                }
            })

            const dataSet = {
                labels: ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'],
                datasets: [{
                    label: '시간별 세탁 이용현황',
                    backgroundColor: '#f87979',
                    pointBackgroundColor: 'white',
                    borderWidth: 1,
                    data: timeLogArray,
                }]
            }

            this.timeChartData = dataSet
        },

        getWeekChartData() {
            const beforeWeek = moment("20190520", "YYYYMMDD").add((parseInt(moment(new Date(), "YYYYMMDD").diff(moment("20190520", "YYYYMMDD"), 'days')/7))*7 - 7, 'days').format("YYYYMMDD")
            const weekArray = Array()
            const weekLogArray = Array()
            const weekRef = firebase.database().ref('activeLog').child(this.currentTab.currentTabValue)

            for(var i = 0; i<7; i++) {
                weekArray[i] = moment(beforeWeek, "YYYYMMDD").add(i, 'days').format("YYYYMMDD")
            }

            weekRef.on('value', function (snapshot) {
                for (var i in weekArray) {
                    weekLogArray[i] = snapshot.child(weekArray[i]).numChildren()
                }
            })

            const dataSet = {
                labels: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
                datasets: [
                    {label: '요일별 세탁 이용현황',
                     backgroundColor: '#f87979',
                     pointBackgroundColor: 'white',
                     borderWidth: 1,
                     data: weekLogArray
                    }
                ]
            }

            this.weekChartData = dataSet
        }


    },

    components: {
        headerMenu, laundry,
        subscribe,
        timeChart, weekChart
    },
}
</script>

<style scoped>

.reportBtn {
    display: flex;
    text-align: center;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 10px;
    padding: 8px;
    width: 50%;
    background-color: rgb(59,56,56);
    color: white;
    font-size: .8rem;
}

.reportBtn-wrap {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.activeReportBtn {
    color: white;
    background: rgb(25, 128, 230);
    border: 1px solid white;
}

.disactiveReportBtn {
    color: rgb(25, 128, 230);
    background: #fff;
    border: 1px solid rgb(25, 128, 230);
}

.chartTabBtn-wrap {
    flex-direction: row;
    justify-content: flex-end;
    display: flex;
    padding: 0px 10px;
}

.app_width_large {
    margin:auto;
    width:500px;
    display: flex;
    flex-direction: column;
}

.app_width_small {
    display: flex;
    flex-direction: column;
}
</style>
