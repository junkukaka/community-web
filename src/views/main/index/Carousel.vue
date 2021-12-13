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
          src: "https://sapui5.hana.ondemand.com/resources/sap/ui/documentation/sdk/images/Home_M_and_L_cropped_1.jpg",
          href: "https://sapui5.hana.ondemand.com/",
          title: "SAP Hana",
          content: "SAP Fiori is a modern UX for every device and user that equips designers and developers with a set of tools and guidelines to create apps with a consistent, innovative experience for any platform. Turn new ideas into great apps as quickly as your customers and users demand."
        },
        {
          src: "https://www.sap.com/dam/application/imagelibrary/photos/285000/285285.jpg/_jcr_content/renditions/285285_photo_3840_0522.jpg.adapt.3840_522.false.false.false.false.jpg/1585843914859.jpg",
          href: "https://community.sap.com/",
          title: "SAP Community",
          content: "SAP Community Network (SCN) is the official user community of SAP SE. SAP software users, developers, consultants, mentors and students use the SAP Community Network to get help, share ideas, learn, innovate and connect with others. "
        },
        {
          src: "https://content.cdn.sap.com/is/image/sap/288663-restricted:HeroL-3840x522?wid=3840&hei=522&fit=stretch,1",
          href: "https://www.sap.com/products/business-technology-platform.html",
          title: "SAP Business Technology Platform",
          content: "SAP Business Technology Platform (SAP BTP) brings together intelligent enterprise applications with database and data management, analytics, integration and extension capabilities into one platform for both cloud and hybrid environments, including hundreds of pre-built integrations for SAP and third-party applications."
        },
        {
          src: "https://www.sap.com/dam/application/shared/photos/hero-product-category/sap-s4hana-custom-hero.jpg/_jcr_content/renditions/sap-s4hana-custom-hero_3840_0824.jpg.adapt.3840_824.false.false.false.false.jpg/1563795394722.jpg",
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