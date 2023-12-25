<template>
  <div>
    <v-row class="mt-2 mb-1">
      <v-col cols="12" lg="6" md="6">
        <v-combobox
          v-model="selectDepartments"
          :items="departments"
          :item-text="departments.text"
          :item-value="departments.value"
          label="권한구룹"
          multiple
          outlined
          dense
        ></v-combobox>
      </v-col>
      <v-col cols="12" lg="6" md="6">
        <v-btn outlined color="indigo" class="ml-10" @click="pickStart">
          {{$t('startDate')}} : {{ startDate }}
        </v-btn>
        <v-btn outlined color="indigo" class="ml-1" @click="pickEnd">
          {{$t('endDate')}}: {{ endDate }}
        </v-btn>
        <v-btn
          class="ml-1 white--text"
          color="indigo"
          depressed
          @click="reportWCMemberCount"
        >
          {{$t('search')}}
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="pickDialog" width="290">
      <v-date-picker v-model="datePicker" class="mt-5"></v-date-picker>
    </v-dialog>
    <v-simple-table fixed-header height="1200px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">{{$t('userName')}}</th>
            <th class="text-center">{{$t('firstWrite',{0:$t('wiki'),1:$t('cnt')})}}(2)</th>
            <th class="text-center">{{$t('joinEdit',{0:$t('wiki'),1:$t('cnt')})}}(1)</th>
            <th class="text-center">{{$t('community')}}(1)</th>
            <th class="text-center">{{$t('comments')}}(0.2)</th>
            <th class="text-center">{{$t('wiki')}}{{$t('collect')}} (0.5)</th>
            <th class="text-center">{{$t('wiki')}}{{$t('likes')}}(0.3)</th>
            <th class="text-center">{{$t('total')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in report" :key="item.name">
            <td class="text-left">{{ item.member_name }}</td>
            <td class="text-center">{{ item.wiki_cnt }}</td>
            <td class="text-center">{{ item.wiki_his_cnt }}</td>
            <td class="text-center">{{ item.community_cnt }}</td>
            <td class="text-center">{{ item.comment_cnt }}</td>
            <td class="text-center">{{ item.be_collect }}</td>
            <td class="text-center">{{ item.be_liked }}</td>
            <td class="text-center">{{ item.point }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

     <v-snackbar
        v-model="snackbar"
        >
        {{ textSnackbar }}
        <template v-slot:action="{ attrs }">
            <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
        </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePicker: "2020-10-31",
      snackbar: false,
      startDate: null,
      endDate: null,
      pickDialog: false,
      textSnackbar:"종료일은 시작일보다 작을수가 없습니다.",
      pickFlag: "S",
      report: [],
      departments: [],
      selectDepartments: [
        {
           text: "중국ASPN"
          ,value: "aspn_china"
        },
        {
           text: "ASPN China 리더그룹"
          ,value: "aspn_china_leader"
        },
        {
           text: "ASPN China 경영관리"
          ,value: "aspn_china_management"
        }
      ]
    };
  },

  created() {
    this.datePicker = this.formatDate(new Date(), "yyyy-MM-") + "01";
    this.startDate = this.formatDate(new Date(), "yyyy-MM-") + "01";
    this.endDate = this.formatDate(new Date(), "yyyy-MM-dd");
    this.reportWCMemberCount();
    this.initialize();
  },

  watch: {
    datePicker: {
      handler(newVal, oldVal) {
        if (this.pickFlag == "S") {
          this.startDate = newVal;
        } else if (this.pickFlag == "E") {
          this.endDate = newVal;
        } else {
          this.endDate = this.formatDate(new Date(), "yyyy-MM-") + "01";
          this.startDate = this.formatDate(new Date(), "yyyy-MM-dd");
        }
        this.pickDialog = false;
        if(this.endDate< this.startDate){
            this.snackbar = true;
            this.endDate = this.startDate;
        }
      },
    },
  },

  methods: {
    initialize() {
      this.$nextTick(function () {
        this.$http
          .get("/member/members/department")
          .then((response) => {
              this.departments = response.data.data;
          });
      });
    },

    reportWCMemberCount(){
      let dept = []
      for(const  department of this.selectDepartments){
        dept.push(department.value)
      }
      
      let depts = _.toString(dept)

      let params = {
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          departments: depts
        }
      }

      this.$http.get("/member/reportWCMemberCount",params).then((response) => {
        this.report = response.data.data;
      }) 
    },

    formatDate(date, formateStr) {
      Date.prototype.format = function (format) {
        var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          S: this.getMilliseconds(), //millisecond
        };
        if (/(y+)/.test(format))
          format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return format;
      };
      return date.format(formateStr);
    },

    pickStart() {
      this.pickFlag = "S";
      this.pickDialog = true;
    },

    pickEnd() {
      this.pickFlag = "E";
      this.pickDialog = true;
    },
  },
};
</script>