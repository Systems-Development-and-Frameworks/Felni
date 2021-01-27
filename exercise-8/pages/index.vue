<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
      <!-- Brand -->
      <a class="navbar-brand" href="#">Logo</a>

      <!-- Toggler/collapsibe Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">Link 1</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link 2</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link 3</a>
          </li>
        </ul>
      </div>
    </nav>
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
          <div class="row mt-3">
            <div class="col-2 col-lg-12 d-flex justify-content-center">
              <span class="dot"></span>
            </div>
            <div class="col-10 col-lg-12">
              <div class="row d-flex justify-content-center mt-2">
                <b>What</b>
              </div>
              <div class="row d-flex justify-content-center mt-2">
                <div class="content">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row d-flex justify-content-center mt-3">
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
          </div> -->
        </div>
        <div class="col-12 col-lg-4">
          <div class="row mt-3">
            <div class="col-2 col-lg-12 d-flex justify-content-center">
              <span class="dot"></span>
            </div>
            <div class="col-10 col-lg-12">
              <div class="row d-flex justify-content-center mt-2">
                <b>We</b>
              </div>
              <div class="row d-flex justify-content-center mt-2">
                <div class="content">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="row mt-3">
            <div class="col-2 col-lg-12 d-flex justify-content-center">
              <span class="dot"></span>
            </div>
            <div class="col-10 col-lg-12">
              <div class="row d-flex justify-content-center mt-2">
                <b>Do</b>
              </div>
              <div class="row d-flex justify-content-center mt-2">
                <div class="content">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer navbar-fixed-bottom">
      <div class="container-fluid">
        <div class="pl-3">
          Imprint <br />
          Copyright by Felni 2021
        </div>
      </div>
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
  height: 60px;
  bottom: 0;
  width: 100%;
}
</style>
