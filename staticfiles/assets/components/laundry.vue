<template>
    <div class="show-laundry">

        <div class="deactivate-laundry">

            <span class="title-caption" v-if="deactivateLaundry.length">
                바로 이용할 수 있어요
            </span>

            <div class="laundry-list">
                <span v-if="!deactivateLaundry.length">
                    이용가능한 세탁기가 없습니다
                </span>
            </div>

            <div class="laundry-block" v-for="laundry in deactivateLaundry" v-bind:key="laundry.num">
                <span>{{laundry.num}}</span>
                <span>{{laundry.type}}</span>
            </div>

        </div>

        <hr v-if="activateLaundry.length">

        <div class="activate-laundry">

            <span v-if="activateLaundry.length" class="activate-laundry-list title-caption">
                    누군가 사용하고 있어요

                <div class="subscribe-btn" v-on:click="subscribeBtnChange">
                    <i class="far fa-bell subscribe-icon"></i>
                    알림받기
                </div>

            </span>

            <div v-for="(laundry, index) in activateLaundry" id="fade-in">

                <div class="laundry-block"
                     v-bind:key="laundry.num"
                     v-bind:style="{background:'hsl(210,'+ String(60 - ((80/(activateLaundry.length))*(index)) ) + '%,50%)',
                                    width:100-(onSubscribe*15.5)+'%'}">
                        <div class="subscribe-wrap">
                            <span v-show="laundry.subscribeNum" class="subscribe-num">
                                {{laundry.subscribeNum}}
                            </span>
                        </div>

                        <span>{{laundry.num}}</span>
                        <span>{{laundry.type}}</span>
                        <span>
                            <span v-show="laundry.minutes < 10">0</span>{{laundry.minutes}}:
                            <span v-show="laundry.seconds < 10">0</span>{{laundry.seconds}}
                        </span>
                </div>

                <input type="checkbox" class="checkbox" v-show="onSubscribe" value="true" v-model="laundry.subscribe">
            </div>

        </div>

        <div class="check-block slide-up"
             v-if="verifySubscribe.length"
             v-on:click="submitSubscribe(verifySubscribe)"
             v-bind:class="{laundry_large:screenWidth*verifySubscribe.length,
                            laundry_small:!screenWidth*verifySubscribe.length}">
                선 택 완 료
        </div>

    </div>
</template>

<script>
import Vue from'vue'
import eventBus from './../js/event-bus.js'

import asyncComputed from 'vue-async-computed'
Vue.use(asyncComputed)

import moment from 'moment'
Vue.use(moment)

import firebase from 'firebase'

export default {
    data() {
        return {
            onSubscribe : false,
            setIntArray : Array,
            screenWidth : false,
            laundryDataSet : Object,
        }
    },

    props:['width', 'currentTab'],

    created() {
        eventBus.$on("@init-subscribe", this.subscribeBtnChange)
        this.initData()
    },

    watch: {
        currentTab : function (n, o) {
            this.initData()
        },

        width() {
            if(this.width >= 504) {
                // 큰 화면일 경우
                this.screenWidth = true

            } else if(this.width < 504) {
                // 작은 화면일 경우
                this.screenWidth = false
            }
        }
    },

    asyncComputed : {
        async deactivateLaundry() {
            const laundry = await this.laundryDataSet.filter(function(n) {
                return n["state"] == "false"
            })

            return laundry
        },

        async activateLaundry() {
            let laundry = await this.laundryDataSet.filter(function(n) {
                return n["state"] == "true"
            })

            return (await laundry.sort(function (a, b) {
                return (a.duration - b.duration)
            }))
        },

        async verifySubscribe() {
            const laundry = await this.laundryDataSet.filter(function(n) {
                return n["subscribe"] == true
            })

            return laundry
        }
    },
    methods : {
        countDown(e) {
            setInterval( () => {
                if(e.state == "true") {
                    e.duration = moment.duration(e.duration - 1000)
                    e.minutes = moment.duration(e.duration).minutes()
                    e.seconds = moment.duration(e.duration).seconds()

                    if (e.minutes >= 30) {
                        e.type = "세탁"
                    } else if (e.minutes >= 10) {
                        e.type = "헹굼"
                    } else if (e.minutes >= 0) {
                        e.type = "탈수"
                    } else if (e.minute < 0 + e.seconds < 0) {
                        e.type = "이용가능"
                    }

                 } else if (e.state == "false") {
                    e.type = "이용가능"
                }
            }, 1000)
        },

        submitSubscribe(e) {
            eventBus.$emit("@open-subscribe", {"dormName":this.currentTab.currentTabValue, 'laundryList':e})
        },

        subscribeBtnChange() {
            this.onSubscribe = !this.onSubscribe
            this.laundryDataSet.map(x => x.subscribe = false)
        },

        initData() {
            const laundryList =
            [{'num':'1번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'2번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'3번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'4번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'5번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'6번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'7번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'8번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'9번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0},
            {'num':'10번', 'type':'이용가능', 'state':false, 'duration':0, 'minutes':0, 'seconds':0, 'subscribe':false, 'subscribeNum':0}]

            /*세탁기별 subscribe 수의 변화를 감지하여 reloading 한다*/
            const subscribeNumRef = firebase.database().ref('subscribe').child(this.currentTab.currentTabValue)

            subscribeNumRef.on('value', function (snapshot) {
                for(var i = 0 ; i < laundryList.length; i++) {
                    const count = snapshot.child((i+1)).numChildren()
                    laundryList[i]["subscribeNum"] = count
                    }
            })

            /*세탁기별 초기 값을 마운트한다*/
            const laundryRef = firebase.database().ref('dormitory').child(this.currentTab.currentTabValue);

            laundryRef.on('value', function (snapshot) {

                for(var i = 0 ; i < laundryList.length; i++) {
                    laundryList[i].state = snapshot.child((i+1)+'/state').val()

                    if(laundryList[i].state == "true") {
                        const startTimestamp = snapshot.child((i + 1) + '/startTimestamp').val()
                        const startTime = moment(startTimestamp, "yyyy-MM-DD HH:mm:ss")

                        const endTime = startTime.add(50, "minute")
                        const currentTime = moment(new Date, "milliseconds")

                        const diffTime = endTime - currentTime

                        laundryList[i].duration = moment.duration(diffTime).asMilliseconds()
            }}
        })

            for(var i in laundryList) {
                this.countDown(laundryList[i])
            }

            this.laundryDataSet = laundryList
        },
    },
}
</script>

<style scoped>
.laundry-block {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin:.3rem 0;
    height:50px;
    border-radius: 5px;
    font-size:1.5rem;
    background:hsl(210,80%,50%);
    color:white;
}

span {
    margin:auto;
    font-weight: bolder;
    width:100%;
    text-align:center;
}

#fade-in {
    animation: fadein 2s;
    -moz-animation: fadein 2s; /* Firefox */
    -webkit-animation: fadein 2s; /* Safari and Chrome */
    -o-animation: fadein 2s; /* Opera */
    display: flex;
    flex-direction: row;
    align-items: center;
}

@keyframes fadein {
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-moz-keyframes fadein { /* Firefox */
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-webkit-keyframes fadein { /* Safari and Chrome */
    from {
        opacity:0;
    }
    to {
        opacity:1;
    }
}
@-o-keyframes fadein { /* Opera */
    from {
        opacity:0;
    }
    to {
        opacity: 1;
    }
}

.laundry-list {
    text-align: center;
}

.deactivate-laundry {
    margin:1.5rem;
}

.activate-laundry {
    margin:1.5rem;
}

span {
    font-size:1.2rem;
    margin:auto;
    font-weight: bolder;
    text-align:center;
}

.check-block {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height:50px;
    font-size:1.5rem;
    background-color: rgb(25, 128, 230);
    color:white;
    max-height: 0px;
    /* approximate max height */
    box-sizing: border-box;
    margin:0;
    font-weight: 900
}

.check-block.slide-up {
    max-height: 100%;
    overflow-y: hidden;
    filter: opacity(95%);
    transition-property: all;
    transition-duration: .8s;
    transition-timing-function: ease;
    position: fixed;
    bottom: 0px;
    margin: auto;
}

.laundry_large {
    width:500px;
}

.laundry_small {
    width:100%
}

.checkbox {
  position: relative;
  cursor: pointer;
  top:-0.375rem;
  margin:auto;
}
.checkbox:before {
  -webkit-transition: -webkit-transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
  -moz-transition: -moz-transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
  transition: transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
  -webkit-transform: rotate(-45deg) scale(0, 0);
  -moz-transform: rotate(-45deg) scale(0, 0);
  -ms-transform: rotate(-45deg) scale(0, 0);
  -o-transform: rotate(-45deg) scale(0, 0);
  transform: rotate(-45deg) scale(0, 0);
  content: "";
  position: absolute;
  left: 0.25rem;
  top: 0.225rem;
  z-index: 1;
  width: 1.7rem;
  height: 0.85rem;
  border: 3px solid rgb(25, 128, 230);
  border-top-style: none;
  border-right-style: none;
}
.checkbox:checked:before {
  -webkit-transform: rotate(-45deg) scale(1, 1);
  -moz-transform: rotate(-45deg) scale(1, 1);
  -ms-transform: rotate(-45deg) scale(1, 1);
  -o-transform: rotate(-45deg) scale(1, 1);
  transform: rotate(-45deg) scale(1, 1);
}
.checkbox:after {
  content: "";
  position: absolute;
  top: -0.125rem;
  left: 0;
  width: 2rem;
  height: 2rem;
  background: #fff;
  border: 3px solid #f2f2f2;
  cursor: pointer;
}

.subscribe-num {
    width: 1.8rem;
    font-size: 1rem;
    height: 1.8rem;
    color: white;
    border-radius: 50%;
    display: flex;
    position: absolute;
    background: #FF5252;
    align-items: center;
    justify-content: center;
    right: -1rem;
    border-width: 1.5px;
    border-color: #FF5252;
    border-style: solid;
    box-shadow: 2px 1.5px 3px rgba(0, 0, 0, 0.25);
}

.subscribe-wrap {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    position:relative;
}

.activate-laundry-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

hr {
    width: 90%;
    margin: 0 auto;
    filter: brightness(150%);
}

.title-caption {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    align-items: center;
    justify-content: space-between;
}

.subscribe-btn {
    width: 6.9rem;
    flex-direction: row;
    display: flex;
    background: rgb(25, 128, 230);
    color: white;
    border-radius: 50px;
    padding: 4px;
    font-size: 1.1rem;
    justify-content: space-evenly;
    align-items: center;
}

.subscribe-icon {
    color: white;
}
</style>
