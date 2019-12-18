<template>
    <div>

        <div class="header">
            <div class="header-info">
                <img class="header-logo" src="https://drive.google.com/uc?id=1_CNFQuVh0iEdlU5HXXVrkxeI4pGYMzuP&export=download">
                <span>
                    아주대 기숙사 세탁기 알리미
                </span>
            </div>
        </div>

        <div v-bind:class="{header_width_large : screenWidth,
                            header_width_small : !screenWidth,
                            sticky : sticky}">

            <div class="header-tab"
                 v-on:click="onChangeTab">

                <span class="header-tab-content"
                    v-for="tabContent in headerTabContent"
                    v-bind:class="{current_tab:currentTab.currentTabName == tabContent.tabName}"
                    v-bind:id=tabContent.tabValue
                    v-bind:key="tabContent.tabValue">{{tabContent.tabName}}</span>

            </div>

        </div>

    </div>
</template>

<script>
import eventBus from './../js/event-bus.js'

export default {
    data() {
        return {
            headerTabContent:[
                {'tabName': "국제학사", 'tabValue': 'ilaundry'},
                {'tabName': "남제관", 'tabValue': 'nlaundry'},
                {'tabName': "용지관", 'tabValue': 'ylaundry'},
                {'tabName': "광교관", 'tabValue': 'glaundry'},
                {'tabName': "화홍관", 'tabValue': 'hlaundry'}
            ],

            sticky:false,
            screenWidth:false,
        }
    },

    props: ['scrollY', 'width', 'currentTab'],

    watch: {
        /* 스크롤 다운에 따른 sticky class 부여하기 */
        scrollY() {
            if (this.scrollY >= 108) {
                this.sticky = true
            } else {
                this.sticky = false
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

    methods : {
        onChangeTab(e) {
            //emit을 통해 app.vue로 이벤트 및 데이터 전달
            this.$emit('@change-tab', {'currentTabName':e.target.innerHTML, 'currentTabValue':e.target.id})
        },
    },
}
</script>

<style scoped>
.header_width_large {
    margin:auto;
    width:500px;
}

.header_width_small {
    margin:auto;
    width:100%;
}

.header {
    font-weight: bolder;
    height: 3.5rem;
    font-size: 1.1rem;
    display: flex;
    margin: auto;
    align-items: center;
    width: 100%;
    justify-content: right;
}

.header-tab {
    width: 100%;
    height: 3rem;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.06);
    justify-content: center;
}

.header-tab-content {
    height: 100%;
    margin: 0 auto;
    font-size: 1.1rem;
    font-weight: bolder;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.current_tab {
    border-bottom: solid;
    color: rgb(25, 128, 230);
    border-width: .1rem;
}

.sticky {
    position: fixed;
    top:0;
    left:0;
    right: 0;
    background: white;
    z-index: 1000;
}

.header-logo {
    width: 3rem;
    margin: 0px 5px;
    height: 3rem;
}

.header-info {
    display: flex;
    flex-direction: row;
    width: 80%;
    align-items: center;
}
</style>
