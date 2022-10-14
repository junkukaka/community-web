<template>
  <v-carousel cycle show-arrows-on-hover height="300">
    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" :href="item.href" target="_blank">
      <div :style="{'margin': margin,'text-align': align}" >
        <div class="text-h2 white--text" >
          {{ item.title }} 
        </div>
        <p class="font-weight-light pt-2 pl-1 white--text" style="width:60%" v-show="!$vuetify.breakpoint.xs">
          {{ item.content }} 
        </p>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      layout: "",
      margin: "90px 0 0 150px",
      align: 'left',
      items: [
        {
          src: "http://36.111.188.244:9000/conf/images/sap_hana.jpg",
          href: "https://sapui5.hana.ondemand.com/",
          title: "SAP Hana",
          content: "SAP Fiori is a modern UX for every device and user that equips designers and developers with a set of tools and guidelines to create apps with a consistent, innovative experience for any platform. Turn new ideas into great apps as quickly as your customers and users demand."
        },
        {
          src: "http://36.111.188.244:9000/conf/images/btp.webp",
          href: "https://www.sap.com/products/business-technology-platform.html",
          title: "SAP Business Technology Platform",
          content: "SAP Business Technology Platform (SAP BTP) brings together intelligent enterprise applications with database and data management, analytics, integration and extension capabilities into one platform for both cloud and hybrid environments, including hundreds of pre-built integrations for SAP and third-party applications."
        },
        {
          src: "http://36.111.188.244:9000/conf/images/ui5.jpg",
          href: "https://sap.github.io/ui5-webcomponents/",
          title: "SAP UI5 Web component",
          content: "UI5 Web Components are shipped as ES6 modules and published on NPM. If you are already using a framework that handles bundling of ES6 modules, skip forward to Installation or check the Tutorials section."
        },
      ],
    };
  },

  created(){
    this.layout = this.$vuetify.breakpoint.xs
    if(this.layout){
      this.margin = "110px auto",
      this.align = "center"
    }
  }
};
</script>