<template>
  <div class="pa-3">
    <v-data-table
      :headers="headers"
      :items="departments"
      sort-by="calories"
      class="elevation-1"
      hide-default-footer
      disable-pagination="true"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Department Manage</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- new dialog start  -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                @click="newItem"
              >
                New Item
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
                        v-model="editedItem.id"
                        label="ID"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.authority"
                          :items="authorities"
                          item-text="name"
                          item-value="id"
                          label="권한"
                        ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
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
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete dialog end -->
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <pop-msg-dialog v-bind:parent="popMsg" />
  </div>
</template>

<script>
import PopMsgDialog from "../../../components/com/PopMsgDialog.vue";

export default {
  components: {
    PopMsgDialog,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    member: {},
    headers: [
      { text: "id", align: "start", value: "id"},
      { text: "name", value: "name" },
      { text: "권한아이디", value: "authority" },
      { text: "권한이름", value: "authorityName" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    authorities: [],
    departments: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      authority: null,
      updateId: null,
    },
    popMsg: {
      dialog: false,
      content: null,
      title: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  created() {
    this.member = this.$store.state.member;
    this.initialize();
    this.getAuthorities();
  },

  methods: {
    initialize() {
      this.$http.get("/authority/getDepartments").then((response) => {
        this.departments = response.data.data;
      });
    },

    getAuthorities(){
      this.$nextTick(function(){
        this.$http.get("/authority/getAuthority").then((response) => {
          this.authorities = response.data.data;
        })
      })
    },

    editItem(item) {
      this.editedIndex = 1;
      this.dialog = true;
      this.editedItem.id = item.id;
      this.editedItem.name = item.name;
      this.editedItem.authority = item.authority;
      this.editedItem.updateId = this.member.id;
    },

    newItem() {
      this.editedItem.id = null;
      this.editedItem.name = null;
      this.editedItem.authority = null;
      this.editedItem.updateId = null;
    },

    deleteItem(item) {
      this.dialogDelete = true;
      this.editedItem.id = item.id;
    },

    deleteItemConfirm() {
      this.$http
        .delete(`/authority/deleteDepartment/${this.editedItem.id}`)
        .then((response) => {
          if (response.data.code == 200) {
            this.initialize();
          } else {
            this.updateError(response.data.data);
          }
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    save() {
      //update department;
      if (this.editedIndex > 0) {
        console.log(this.editedItem);
        this.$http
          .put("/authority/editDepartments", this.editedItem)
          .then((response) => {
            if (response.data.code == 200) {
              this.initialize();
            } else {
              this.updateError(response.data.data);
            }
          });
        //new department;
      } else if (this.editedIndex < 0) {
        this.$http
          .post("/authority/addDepartments", this.editedItem)
          .then((response) => {
            if (response.data.code == 200) {
              this.initialize();
            } else {
              this.updateError(response.data.data);
            }
          });
      }
      this.close();
    },

    updateError(error) {
      this.popMsg.dialog = true;
      this.popMsg.title = "Warning Message";
      this.popMsg.content = error;
    },
  },
};
</script>