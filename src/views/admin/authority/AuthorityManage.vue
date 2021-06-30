<template>
  <v-row class="pt-5">
    <!-- master authority start -->
    <v-col cols="12" md="5">
      <div class="pa-1">
        <v-data-table
          :headers="authorityHeaders"
          :items="authority"
          sort-by="calories"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>권한 마스터</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <!-- new authory dialog start  -->
              <v-dialog v-model="authorityDialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="authorityNew"
                  >
                    New Authority
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="authorityEdited.name"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="authorityClose">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="authoritySave">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- new dialog end  -->

              <!-- delete dialog start -->
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="authorityDeleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!--new authory dialog start -->
            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn outlined @click="authorityEditItem(item)" class="ma-2" color="success" small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn outlined @click="authorityDeleteItem(item)" class="ma-2" small color="blue-grey">
              <v-icon> mdi-delete</v-icon>
            </v-btn>

            <v-btn class="ma-2" outlined small color="primary" @click="communityItems(item)">
              community
            </v-btn>

            <v-btn class="ma-2" outlined small color="indigo" @click="wikiItems(item)"> wiki </v-btn>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
        <pop-msg-dialog v-bind:parent="popMsg" />
      </div>
    </v-col>

    <!-- master authority end -->
    <!-- ---------------------------------------------- authority item------------------------------------------------------- -->
    <v-col cols="12" md="7">
      <div class="pa-1" v-if="authorityItemFlag.flag">
        <v-data-table
          :headers="authorityItemHeaders"
          :items="authorityItems"
          sort-by="calories"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>{{authorityItemFlag.flag == 'C' ? '커뮤니티 권한 아이템': '위키 권한 아이템'}}</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <!-- new authory dialog start  -->
              <v-dialog v-model="authorityItemDialog" max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="authorityItemNew"
                  >
                    New 권한 아이템
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ itemFormTitle }}</span>
                  </v-card-title>

                  <v-card-text>

                    <v-container>
                      <v-select
                        v-model="selectionType"
                        :items="['leaf', 'independent']"
                        label="Selection type"
                      ></v-select>
                      <v-row>
                        <v-col>
                          <v-treeview
                            v-model="selection"
                            :items="menus"
                            :selection-type="selectionType"
                            selectable
                            return-object
                            open-all
                          ></v-treeview>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col
                          class="pa-6"
                          cols="6"
                        >
                          <template v-if="!selection.length">
                            No nodes selected.
                          </template>
                          <template v-else>
                            <div
                              v-for="node in selection"
                              :key="node.id"
                            >
                              {{ node.name }}
                            </div>
                          </template>
                        </v-col>
                      </v-row>
                    </v-container>

                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="authorityItemClose"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="authorityItemSave"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- new dialog end  -->
            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              outlined
              @click="authorityItemDeleteItem(item)"
              class="ma-2"
              small
              color="blue-grey"
            >
              <v-icon> mdi-delete</v-icon>
            </v-btn>
          </template>

          <template v-slot:[`item.viewYn`]="{ item }">
            <v-switch
              v-model="item.viewYn"
              @click="changeViewAndEditYn(item)"
              :label="`${item.viewYn == 1 ? 'ON' : 'OFF'}`"
            ></v-switch>
          </template>

          <template v-slot:[`item.editYn`]="{ item }">
            <v-switch
              v-model="item.editYn"
              @click="changeViewAndEditYn(item)"
              :label="`${item.editYn == 1 ? 'ON' : 'OFF'}`"
            ></v-switch>
          </template>

        </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import PopMsgDialog from "../../../components/com/PopMsgDialog.vue";

export default {
  components: {
    PopMsgDialog,
  },

  data: () => ({
    member: {},
    authorityDialog: false,
    dialogDelete: false,
    authorityHeaders: [
      { text: "ID", align: "start", value: "id" },
      { text: "name", value: "name" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    authority: [],
    authorityEditedIndex: -1,
    authorityEdited: {
      name: "",
      updateId: null,
    },

    //선택중의 권한 flag == C 커뮤니티 flag == W 위키  aId는 권한 master id
    authorityItemFlag: {
      aId: null,
      flag: null,
    },
    authorityItemDialog: false,
    authorityItemHeaders: [
      { text: "authorityName", value: "authorityName" },
      { text: "menuName", value: "menuName" },
      { text: "view", align: "center", value: "viewYn" },
      { text: "edit", align: "center", value: "editYn" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    authorityItems: [],
    selectionType: 'leaf',
    selection: [],
    menus: [],

    popMsg: {
      dialog: false,
      content: null,
      title: null,
    },
  }),

  computed: {
    formTitle() {
      return this.authorityEditedIndex === -1
        ? "New Authority"
        : "Edit Authority";
    },

    itemFormTitle (){
      return this.authorityItemFlag.flag === "C"
        ? "Commnunity menus"
        : "Wiki menus";
    },
  },

  created() {
    this.member = this.$store.state.member;
    this.initialize();
  },

  methods: {
    initialize() {
      this.$http.get("/authority/getAuthority").then((response) => {
        this.authority = response.data.data;
      });
    },

    authorityEditItem(item) {
      this.authorityEditedIndex = 1;
      this.authorityDialog = true;
      this.authorityEdited.id = item.id;
      this.authorityEdited.name = item.name;
      this.authorityEdited.updateId = this.member.id;
    },

    authorityNew() {
      this.authorityEdited.id = null;
      this.authorityEdited.name = null;
      this.authorityEdited.updateId = null;
    },

    authorityDeleteItem(item) {
      this.dialogDelete = true;
      this.authorityEdited.id = item.id;
    },

    authorityDeleteItemConfirm() {
      this.$http
        .delete(`/authority/deleteAuthority/${this.authorityEdited.id}`)
        .then((response) => {
          if (response.data.code == 200) {
            this.initialize();
          } else {
            this.updateError(response.data.data);
          }
        });
      this.closeDelete();
    },

    authorityClose() {
      this.authorityDialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    //master authority
    authoritySave() {
      //update department;
      if (this.authorityEditedIndex > 0) {
        this.$http
          .put("/authority/editAuthority", this.authorityEdited)
          .then((response) => {
            if (response.data.code == 200) {
              this.initialize();
            } else {
              this.updateError(response.data.data);
            }
          });
        //new department;
      } else if (this.authorityEditedIndex < 0) {
        this.$http
          .post("/authority/addAuthority", this.authorityEdited)
          .then((response) => {
            if (response.data.code == 200) {
              this.initialize();
            } else {
              this.updateError(response.data.data);
            }
          });
      }
      this.authorityClose();
    },

     //list community list 
    communityItems(item){
      this.authorityItems = [];
      this.authorityItemFlag.flag = "C";
      this.authorityItemFlag.aId = item.id;
      this.$http.get(`/authority/getItems?aId=${item.id}&flag=${this.authorityItemFlag.flag}`).then((response) =>{
        this.authorityItems = response.data.data;
      })
    },

    //list wiki list
    wikiItems(item){
      this.authorityItems = [];
      this.authorityItemFlag.flag = "W";
      this.authorityItemFlag.aId = item.id;
      this.$http.get(`/authority/getItems?aId=${item.id}&flag=${this.authorityItemFlag.flag}`).then((response) =>{
        this.authorityItems = response.data.data;
      })
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // authority item
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    authorityItemClose() {
      this.authorityItemDialog = false;
      this.selection = [];
    },

    authorityItemNew(){
      //community
      if(this.authorityItemFlag.flag === "C"){
        this.$http.get("/communityMenu/menus/tree").then((response) => {
          this.menus = response.data.data;
        });
      }else{
        this.$http.get("/wikiMenu/menus/tree").then((response) => {
          this.menus = response.data.data;
        });
      }
      this.authorityItemDialog = true;
    },

    authorityItemDeleteItem(item){
      let request = {
        aId: null,
        flag : null
      }
      request.flag = this.authorityItemFlag.flag;
      request.aId = item.id;
      this.$http.post("/authority/deleteItem",request).then((response) => {
        if(response.data.code == 200){
          let param = {id:null}
          param.id = item.aId;
          if(this.authorityItemFlag.flag == "C"){
            this.communityItems(param);
          }else{
            this.wikiItems(param);
          }
        }
      })
    },

    //authority item 
    authorityItemSave() {
      let request = {
        aId: null,
        menus: [],
        memberId: null,
        flag: null,
      };
      request.aId = this.authorityItemFlag.aId;
      request.memberId = this.member.id;
      request.flag = this.authorityItemFlag.flag;
      for (const item of this.selection) {
        request.menus.push(item.id);
      }

      this.$http.post("/authority/addItems",request).then((response) =>{
        if(response.data.code == 200){
          this.authorityItemDialog = false;
          if(response.data.code == 200){
            let param = {id:null};
            param.id = request.aId;
            if(this.authorityItemFlag.flag == "C"){
              this.communityItems(param);
            }else{
              this.wikiItems(param);
            }
          }
        }
      })
    },

    changeViewAndEditYn(item){
      if(item.viewYn){
        item.viewYn = 1
      } else{
        item.viewYn = 0;
      }

      if(item.editYn){
        item.editYn = 1
      } else{
        item.editYn = 0;
      }

      let request = {
        flag: null,
        editYn : item.editYn,
        viewYn : item.viewYn,
        id : item.id,
        memberId: null
      }

      request.flag = this.authorityItemFlag.flag;
      request.memberId = this.member.id;
      this.$http.put("/authority/editItem",request).then((response) => {
        if(response.data.code != 200){
          this.updateError(response.data.data);
        }
      })

    },

    updateError(error) {
      this.popMsg.dialog = true;
      this.popMsg.title = "Warning Message";
      this.popMsg.content = error;
    },
  },
};
</script>