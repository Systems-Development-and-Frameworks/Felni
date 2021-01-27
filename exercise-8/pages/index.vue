<template>
  <div>
    <div
      id="carouselExampleSlidesOnly"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="~/assets/image1.jpg" class="d-block w-100" alt="..." />
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-lg-4">
          <div class="row d-flex justify-content-center mt-3">
            <span class="dot"></span>
          </div>
          <div class="row d-flex justify-content-center mt-2"><b>What</b></div>
          <div class="row d-flex justify-content-center mt-2">
            <div class="content">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="row d-flex justify-content-center mt-3">
            <span class="dot"></span>
          </div>
          <div class="row d-flex justify-content-center mt-2"><b>We</b></div>
          <div class="row d-flex justify-content-center mt-2">
            <div class="content">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="row d-flex justify-content-center mt-3">
            <span class="dot"></span>
          </div>
          <div class="row d-flex justify-content-center mt-2"><b>Do</b></div>
          <div class="row d-flex justify-content-center mt-2">
            <div class="content">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer navbar-fixed-bottom">
      Bla bla bla
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style>
.dot {
  height: 75px;
  width: 75px;
  background-color: #000000;
  border-radius: 50%;
  display: inline-block;
}

.content {
  width: 75%;
}

.footer {
  background-color: lightgray;
    position: fixed;
    height: 100px;
    bottom: 0;
    width: 100%;
}
</style>
