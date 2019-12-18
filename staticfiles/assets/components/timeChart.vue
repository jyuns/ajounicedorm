<script>
import {Bar} from 'vue-chartjs'
import eventBus from '../js/event-bus.js'

export default {
    extends: Bar,

    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            //추후 최대/소 값 변경하기
                            min : 0,
                            max : 20,
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                },
            legend: {
                display: true
            },
            responsive: true,
            maintainAspectRatio: false
            }
        }
    },

    props:["currentTab", "timeChartData"],

    created() {
        eventBus.$on("@change-tab", this.renderChart(this.timeChartData, this.options))
    },

    watch: {
        timeChartData() {
            this.renderChart(this.timeChartData, this.options)
        }
    },

    mounted() {
        this.renderChart(this.timeChartData, this.options)
    },
}
</script>
