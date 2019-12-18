<template>
<div class="subscribe-modal" v-if="openSubscribeModal">
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container"
                     v-bind:class="{subscribe_modal_large:screenWidth,
                                    subscribe_modal_small:!screenWidth}">

                    <div class="modal-header">
                        <span class="subscribe-modal-title">
                            [{{currentTab.currentTabName}}] 연락처를 입력해 주세요
                        </span>
                        <i class="fas fa-times close" v-on:click="closeModal"></i>
                    </div>

                    <span class="subscribe-modal-phn" v-on:keyup.esc="closeModal" tabindex="0">
                         <input class="subscribe-input-phn" type="text" placeholder="'-' 없이 입력해 주세요."
                                v-model="subscribePhn"
                                v-on:keyup.enter="onSubmit"
                                v-bind:class="{box_valid:(subscribePhn.length * validPhn),
                                               box_invalid:(subscribePhn.length * !validPhn)}">
                         <i class="fas fa-check valid"
                            v-show="subscribePhn.length * validPhn" ></i>
                         <i class="fas fa-exclamation invalid"
                            v-show="subscribePhn.length * !validPhn"></i>
                    </span>

                    <div class="subscribe-modal-submit"
                         v-on:click="onSubmit">
                         전 송 하 기
                    </div>

                </div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
import eventBus from './../js/event-bus.js'

import moment from 'moment'
Vue.use(moment)

//vue firebase
import firebase from 'firebase'


export default {
    data() {
        return {
            openSubscribeModal:false,
            subscribePhn:"",
            validPhn:false,

            screenWidth:false,

            subscribeLaundryList:Object,
        }
    },

    created() {
        eventBus.$on("@open-subscribe", e => {
            this.subscribeLaundryList = e
            this.openSubscribeModal = !this.openSubscribeModal
        })
    },

    watch : {
        subscribePhn : function (newVal, oldVal) {
            const numberPattern = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/;

            if (numberPattern.exec(newVal)) {
                this.validPhn = true
            } else {
                this.validPhn = false
            }
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

    props: ["width", "currentTab"],

    methods : {
        closeModal() {
            this.openSubscribeModal = !this.openSubscribeModal
            this.subscribePhn = ""
            this.validPhn = false
            this.subscribeLaundryList = null
        },

        onSubmit(e) {
            if(this.validPhn) {
                for(var i = 1 ; i < this.subscribeLaundryList["laundryList"].length+1; i++) {
                    const laundryNumber = this.subscribeLaundryList['laundryList'][i-1]["num"].match(/^[0-9]{1,2}/)
                    const subscribeRef = firebase.database().ref('subscribe/'+this.subscribeLaundryList["dormName"]+'/' + laundryNumber + '/' + this.subscribePhn)
                    subscribeRef.push(
                            {'subscribe' : true}
                        ).then( () => {eventBus.$emit("@submit-subscribe-success")}).catch( () => {eventBus.$emit("@submit-error")})
                }

                this.closeModal()

                eventBus.$emit("@init-subscribe")

            } else if ((!this.validPhn) * (!this.subscribePhn)) {
                //입력된 내용이 없는 경우,
                eventBus.$emit("@submit-input-error")

            } else if ((!this.validPhn) * (this.subscribePhn)) {
                //입력된 내용은 있으나, 형식이 틀린 경우,
                eventBus.$emit("@submit-valid-error")
            }

        }
    },

}
</script>

<style scoped>

.subscribe-modal {
    width:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
    margin: 0px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    align-items: center;
    height: 130px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
}

.subscribe_modal_large {
    width: 500px;
}

.subscribe_modal_small {
    width: 85%;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-header {
    display: flex;
    width: 100%;
    margin: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.subscribe-modal-title {
    font-size: 1rem;
    font-weight: bolder;
}

hr {
    border: 1px solid rgb(245,245,245);
    margin: 13px 0;
}

.close {
    font-size : 1.3rem
}
.subscribe-modal-submit {
    width: 100%;
    padding: 10px 0;
    background-color: rgb(59,56,56);
    transition: all .3s ease;
    color: white;
    text-align: center;
    font-weight: 700;
    font-size: 1.2rem;
}

.subscribe-input-phn {
    width: 100%;
    height: 100%;
    border: 1px solid #c6ccd1;
    border-radius: 5px;
    text-align: center;
    font-size: 1rem;
    letter-spacing: .1rem;
}

.subscribe-modal-phn {
    text-align: center;
    width: 100%;
    height: 30%;
    margin: 0 0 1rem 0;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.valid {
    position: absolute;
    font-size: 1rem;
    color: #2b9d4e;
    right: 15px;
}

.invalid {
    position: absolute;
    font-size: 1rem;
    color: #de3848;
    right: 15px;
}

.box_invalid {
    border-color: #de3848;
}

.box_valid {
    border-color:#2b9d4e;
}
</style>


