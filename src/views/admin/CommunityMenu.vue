<template>
  <!-- Firset  Menu Start -->
  <v-card>
    <v-card id="FirsetMenu" width="300" class="float-left ma-3" tile>
      <v-list flat>
        <v-subheader class="title">
          <v-list-item-title> First Menu </v-list-item-title>
          <v-btn depressed class="ma-2" @click="addFirstMenu(1)">
            New<v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, sort) in menus" :key="sort">
            <v-list-item-content @click="selectMenus(item)">
              <v-list-item-title
                v-text="item.name"
                :class="{ MyGrey: item.useYn == 'N' }"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon @click="addChildren(item)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-icon @click="editMenu(item)" style="margin-left: 16px">
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, -1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-up-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, 1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-down-outline</v-icon>
            </v-list-item-icon>

            <!-- <v-list-item-icon @click="deleteMenu(item)">
              <v-icon>mdi-minus-circle</v-icon>
            </v-list-item-icon> -->
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- Firset Menu End -->

    <!-- SecondMenu  Menu Start -->
    <v-card id="SecondMenu" width="300" class="float-left ma-3" tile>
      <v-list flat>
        <v-subheader class="title">
          <v-list-item-title> Second Menu </v-list-item-title>
        </v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, id) in menus2" :key="id">
            <v-list-item-content @click="selectMenus(item)">
              <v-list-item-title
                v-text="item.name"
                :class="{ MyGrey: item.useYn == 'N' }"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon @click="addChildren(item)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-icon @click="editMenu(item)" style="margin-left: 16px">
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, -1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-up-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, 1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-down-outline</v-icon>
            </v-list-item-icon>

            <!-- <v-list-item-icon @click="deleteMenu(item)">
              <v-icon>mdi-minus-circle</v-icon>
            </v-list-item-icon> -->
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- SecondMenu Menu End -->

    <!-- Third  Menu Start -->
    <v-card id="ThirdMenu" width="300" class="float-left ma-3" tile>
      <v-list flat>
        <v-subheader class="title">
          <v-list-item-title> Third Menu </v-list-item-title>
        </v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, id) in menus3" :key="id">
            <v-list-item-content>
              <v-list-item-title
                v-text="item.name"
                :class="{ MyGrey: item.useYn == 'N' }"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon @click="editMenu(item)" style="margin-left: 16px">
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, -1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-up-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-icon
              @click="sortMenu(item, 1)"
              style="margin-left: 16px"
            >
              <v-icon>mdi-menu-down-outline</v-icon>
            </v-list-item-icon>

            <!-- <v-list-item-icon @click="deleteMenu(item)">
              <v-icon>mdi-minus-circle</v-icon>
            </v-list-item-icon> -->
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- Third Menu End -->

    <!-- 修改或者添加弹窗 -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <div class="subtitle-1">菜单名称</div>
                <v-text-field v-model="editedItem.name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="46">
                <div class="subtitle-1">使用与否</div>
                <v-radio-group v-model="editedItem.useYn">
                  <v-radio label="使用" value="Y"></v-radio>
                  <v-radio label="停用" value="N"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确定弹窗 -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>



<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    menus: [],
    menus2: [], //二级菜单
    menus3: [], //三季菜单
    editedIndex: -1,
    editedItem: {
      id: null,
      name: null,
      tier: null,
      useYn: null,
      father: null,
      sort: null,
    },
    defaultItem: {
      id: null,
      name: null,
      tier: null,
      useYn: null,
      father: null,
      sort: null,
    },
    formTitle: "",
    selectedTier2: null,
    selectedTier3: null,
  }),

  created: function () {
    this.initialize();
  },

  methods: {
    //初始化方法
    initialize: function (flag) {
      this.selectFirstMenu();
      if (this.selectedTier2 != null) {
        this.selectMenus(this.selectedTier2,flag);
      }
      if (this.selectedTier3 != null) {
        this.selectMenus(this.selectedTier3);
      }
    },

    //chang menu sort
    sortMenu: function (item, flag) {
      if (item.tier == 1) {
        this.sortingMenu(this.menus, item, flag);
      } else if (item.tier == 2) {
        this.sortingMenu(this.menus2, item, flag);
      } else {
        this.sortingMenu(this.menus3, item, flag);
      }
    },

    //sort menu
    sortingMenu: function (menu, item, flag) {
      let menus = menu;
      //let request = [];
      // console.log(menus);
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].sort == null) {
          menus[i].sort = i;
        } else {
          //0 can't up and last item can't down
          if (flag > 0 && item.sort == menus.length - 1) {
            return false;
          } else if (flag < 0 && item.sort == 0) {
            return false;
          }

          //change place
          if (menus[i].sort == item.sort) {
            menus[i].sort = item.sort + flag;
            //request[0] = menus[i]
            menus[i + flag].sort = menus[i].sort - flag;
            //request[1] = menus[i+flag]
            this.$http
              .post("/communityMenu/sortMenu", menus)
              .then((response) => {
                this.initialize(true);
                return false;
              });
          }
        }
      }
    },

    //一级菜单查询
    selectFirstMenu: function () {
      let data = this.$data;
      let request = {
        tier: 1,
      };
      this.$nextTick(function () {
        this.$http
          .post("/communityMenu/menus/condition", request)
          .then(function (response) {
            data.menus = response.data.data;
          });
      });
    },

    //添加主菜单
    addFirstMenu: function (tier) {
      this.editedIndex = -1;
      this.editedItem.useYn = "Y";
      this.editedItem.tier = tier;
      this.dialog = true;
      this.formTitle = "Add First Menu";
      this.editedItem.sort = this.menus.length;
    },

    //添加下级菜单
    addChildren: function (item) {
      if (item.tier === 1) {
        this.formTitle = "Add fisrt menu Children Menu: " + item.name;
      } else {
        this.formTitle = "Add second menu Children Menu: " + item.name;
      }
      this.editedInde = -1;
      //设置父目录
      this.editedItem.father = item.id;
      //设置菜单等级
      this.editedItem.tier = item.tier + 1;
      this.editedItem.useYn = "Y";
      this.editedItem.id = null;
      this.dialog = true;
      if (item.tier == 1) {
        this.editedItem.sort = this.menus2.length;
      } else if (item.tier == 2) {
        this.editedItem.sort = this.menus3.length;
      }
    },

    //查看下级菜单
    selectMenus: function (item,flag) {
      let request = (request = {
        father: item.id,
        tier: item.tier + 1,
      });
      if (request.tier == 2) {
        this.selectedTier2 = item;
      } else if (request.tier == 3) {
        this.selectedTier3 = item;
      }
      let t = item.tier;
      this.$http
        .post("/communityMenu/menus/condition", request)
        .then((response) => {
          if (t == 1) {
            this.menus2 = response.data.data;
            if(flag == null){
              this.menus3 = [];
            }
          } else {
            this.menus3 = response.data.data;
          }
        });
    },

    //修改菜单
    editMenu: function (item) {
      if (item.tier === 1) {
        this.formTitle = "Edit fisrt menu Children Menu: " + item.name;
      } else if (item.tier === 2) {
        this.formTitle = "Edit second menu Children Menu: " + item.name;
      } else {
        this.formTitle = "Edit third menu Children Menu: " + item.name;
      }

      if (item.tier === 1) {
        this.editedIndex = this.menus.indexOf(item);
      } else if (item.tier === 2) {
        this.editedIndex = this.menus2.indexOf(item);
      } else {
        this.editedIndex = this.menus3.indexOf(item);
      }
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close: function () {
      this.dialog = false;
    },

    save: function () {
      //updata function
      if (this.editedIndex > -1) {
        let data = this.editedItem;
        this.$http.put("/communityMenu/menus", data).then((response) => {
          this.initialize();
        });
        // this.$router.go(0);
        //Insert function
      } else {
        let data = this.editedItem;
        this.$http.post("/communityMenu/menus", data).then((response) => {
          this.initialize();
        });

        // this.$router.go(0);
      }
      this.close();
    },

    //删除以及菜单
    deleteMenu: function (item) {
      if (item.tier === 1) {
        this.editedIndex = this.menus.indexOf(item);
      } else if (item.tier === 2) {
        this.editedIndex = this.menus2.indexOf(item);
      } else {
        this.editedIndex = this.menus3.indexOf(item);
      }

      this.editedItem.id = item.id;
      this.editedItem.tier = item.tier;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    //输出菜单
    deleteItemConfirm() {
      let index = this.editedIndex;
      let id = this.editedItem.id;
      if (this.editedItem.tier === 1) {
        this.menus.splice(this.editedIndex, 1);
      } else if (this.editedItem.tier === 2) {
        this.menus2.splice(this.editedIndex, 1);
      } else {
        this.menus3.splice(this.editedIndex, 1);
      }

      this.$nextTick(function () {
        this.$http.delete("/communityMenu/menus/" + id).then((response) => {
          this.initialize();
        });
      });

      this.closeDelete();
    },
    //关闭删除弹窗
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>


<style scoped>
.MyGrey {
  color: rgb(255, 142, 142);
}
</style>