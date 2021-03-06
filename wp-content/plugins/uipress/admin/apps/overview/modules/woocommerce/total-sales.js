export function moduleName() {
  return "total-sales";
}

export function moduleData() {
  return {
    props: {
      cardData: Object,
      overviewData: Object,
    },
    data: function () {
      return {
        chartData: [],
        cardOptions: this.cardData,
        numbers: [],
        sub: true,
        analytics: false,
        error: false,
        errorMsg: "",
        woocommerce: true,
      };
    },
    mounted: function () {
      this.getData();
    },
    watch: {
      overviewData: {
        handler(newValue, oldValue) {
          this.getData();
        },
        deep: true,
      },
      cardOptions: {
        handler(newValue, oldValue) {
          this.$emit("card-change", newValue);
        },
        deep: true,
      },
    },
    computed: {
      getTheDates() {
        return this.overviewData.dateRange;
      },
      getPostsOnce() {
        this.getPosts();
      },
      returnWooData() {
        return this.overviewData.globalDataObject.data.woocommerce;
      },
      formattedPosts() {
        this.getPostsOnce;
        return this.recentPosts;
      },
      wooError() {
        if (this.woocommerce == true) {
          return false;
        } else {
          return true;
        }
      },
    },
    methods: {
      createChartData() {
        let chartdataset = [];
        let self = this;
        let pageviewsdata = this.returnWooData.totalSales.dataSet;

        chartdataset = {
          labels: pageviewsdata.dates,
          datasets: [
            {
              label: self.overviewData.translations.revenue,
              fill: true,
              data: pageviewsdata.data,
              backgroundColor: ["rgba(12, 92, 239, 0.05)"],
              borderColor: ["rgba(12, 92, 239, 1)"],
              borderWidth: 2,
              chartTitle: self.overviewData.translations.revenue,
              toolTipLabels: pageviewsdata.dates,
              toolTipType: "dates",
            },
            {
              label: self.overviewData.translations.revenueComp,
              fill: true,
              data: pageviewsdata.data_comp,
              backgroundColor: ["rgba(247, 127, 212, 0)"],
              borderColor: ["rgb(247, 127, 212)"],
              borderWidth: 2,
              toolTipLabels: pageviewsdata.dates,
              toolTipType: "dates",
            },
          ],
        };

        return chartdataset;
      },
      getData() {
        let self = this;

        //CHECK IF WE ARE STILL LOADING
        if (self.overviewData.globalDataObject.loading) {
          return;
        }

        ///CHECK IF WOO IS INSTALLED
        if (self.returnWooData.error) {
          self.woocommerce = false;
          return;
        }

        self.tableData = self.returnWooData;
        self.chartData = self.createChartData();
      },
    },
    template:
      '<div class="uip-padding-s uip-position-relative">\
          <div v-if="wooError == true" class="uip-background-red-wash uip-padding-s uip-border-round">{{returnWooData.message}}</div>\
          <template v-else>\
            <premium-overlay v-if="sub && overviewData.account != true" :translations="overviewData.translations"></premium-overlay>\
            <template v-else>\
                <loading-placeholder v-if="overviewData.globalDataObject.loading == true"></loading-placeholder>\
                <div v-if="overviewData.globalDataObject.loading != true && !overviewData.ui.editingMode">\
                  <div class="uip-flex uip-flex-center uip-margin-bottom-xs">\
                    <div class="uip-margin-right-s uip-text-xxl uip-text-emphasis uip-text-bold">{{tableData.totalSales.numbers.total}}</div>\
                    <div class="uip-background-primary-wash uip-border-round uip-padding-xxs uip-text-bold uip-flex"  :class="{\'uip-background-red-wash\' : tableData.change < 0}">\
                      <span v-if="tableData.totalSales.numbers.change > 0" class="material-icons-outlined">expand_less</span>\
                      <span v-if="tableData.totalSales.numbers.change < 0" class="material-icons-outlined">expand_more</span>\
                      {{tableData.totalSales.numbers.change}}%\
                    </div>\
                  </div>\
                  <div class="uip-margin-top-m">\
                    <div class="uip-text-muted">{{overviewData.translations.comparedTo}}: {{overviewData.dateRange.startDate_comparison}} - {{overviewData.dateRange.endDate_comparison}} ({{tableData.totalSales.numbers.total_comparison}})</div>\
                  </div>\
                  <div class="uip-w-100p">\
                    <uip-chart :dates="getTheDates" v-if="overviewData.globalDataObject.loading != true" type="line" :chartData="chartData"  :gridLines="true" cWidth="200px"></uip-chart>\
                  </div>\
                </div>\
            </template>\
          </template>\
     </div>',
  };
  return compData;
}
