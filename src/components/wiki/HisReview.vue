<template>
  <v-card flat color="#F5F5F5">
    <v-card flat style="background-color: #F5F5F5">
        <v-card-title>
            <v-icon>
                mdi-format-title
            </v-icon>
            : {{wikiHis.title}}
        </v-card-title>
        <v-divider></v-divider>
        <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" style="background-color: #F5F5F5"/>
    </v-card>

    <v-fab-transition>
        <v-btn
          color="primary"
          large
          fab
          fixed
          @click="compareHis"
          style="right:30px;bottom:30px">
          <v-icon>mdi-format-list-bulleted-square</v-icon>
        </v-btn>
    </v-fab-transition>


    <!-- his compare dialog  -->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="confrimDialog = true">
                <v-icon class="mr-3">mdi-clock-time-ten-outline</v-icon>
                 Back to the past 
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-row> 
            <!-- history -->
            <v-col cols="12" md="6">
                <v-card flat style="background-color: #F5F5F5" >
                    <v-card-title>
                        History
                        <v-icon>
                            mdi-format-title
                        </v-icon>
                         : {{wikiHis.title}}
                    </v-card-title>
                    <v-md-editor v-model="wikiHis.content" mode="preview" ref="editor" style="background-color: #F5F5F5"/>
                </v-card>
            </v-col>

            <!-- right now -->
            <v-col cols="12" md="6">
                <v-card flat>
                    <v-card-title>
                        Current
                        <v-icon>
                            mdi-format-title
                        </v-icon>
                        : {{wikiNow.title}}
                    </v-card-title>
                    <v-md-editor v-model="wikiNow.content" mode="preview" ref="editor"/>
                </v-card>
            </v-col>
        </v-row>

      </v-card>
    </v-dialog>

    <!-- wikihis back to the past -->
    <v-dialog v-model="confrimDialog" max-width="360">
      <v-card>
        <v-card-title class="headline"
          >Are you sure back to the past ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confrimDialog = false">
            cancle
          </v-btn>
          <v-btn color="primary darken-1" text @click="backToThePast()">
            Yes 
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      dialog: false,
      confrimDialog: false,
      wikiHisId: null,
      wikiHis:{},
      wikiNow:{}
    };
  },

  created: function () {
    this.wikiHisId = this.$route.query.wikiHisId;
    this.initialize();
  },

  methods: {
      initialize(){
        this.$nextTick(function () {
            this.$http
            .get(`/wiki/wikiHis/${this.wikiHisId}`)
            .then((response) => {
                this.wikiHis = response.data.data;
                console.log(this.wikiHis);
            });
        });
      },

      compareHis(){
        this.dialog = true;
        this.$nextTick(function () {
            this.$http.get(`/wiki/wikiDetail/${this.wikiHis.wikiId}`).then((response) => {
                this.wikiNow = response.data.data;
            });
        });
      },

      backToThePast(){
        this.wikiHis.memberId = this.$store.state.member.id;
        this.$nextTick(function () {
            this.$http.put(`/wiki/backToTheHis`,this.wikiHis).then((response) => {
                this.confrimDialog= false;
                this.dialog = false;
            });
        });
      }
  }
};
</script>