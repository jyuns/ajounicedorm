<script>
//Importing Bar class from the vue-chartjs wrapper
import {Bar} from 'vue-chartjs'
import firebase from 'firebase'
//Exporting this so it can be used in other components
export default {
  extends: Bar,
  data() {
    return {
        test : [
            {'Mon': 0},
            {'Tue' : 0},
            {'Wed' : 0},
            {'Thur' : 0},
            {'Fri' : 0},
            {'Sat' : 0},
            {'Sun' : 0},
        ],
      datacollection: {
        //Data to be represented on x-axis
        labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: '요일별 세탁 이용현황',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            //Data to be represented on y-axis
            data: [0,0,0,0,0,0,0]
          }
        ]
      },
      //Chart.js options that controls the appearance of the chart
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
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
  mounted() {
    //renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.options)

    const ref = firebase.database().ref('save/ilaundry/saveLogData/')
    const labels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

    const testData = this.datacollection

    ref.on('value', function (snapshot) {
        for(var i = 0 ; i < labels.length; i++) {
            testData.datasets[0]["data"][i] = snapshot.child(labels[i]).numChildren()
            }
        })

    this.datacollection = testData
  }
}
</script>
