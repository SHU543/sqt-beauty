(function () {
  "use strict";

  /* 滚动淡入 */
  var targets = document.querySelectorAll(".work, .group-head, .hero-stats");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* 动态作品：卡片内静音循环播放 */
  document.querySelectorAll(".work[data-loop]").forEach(function (card) {
    var src = card.getAttribute("data-loop");
    var media = card.querySelector(".work-media");
    if (!src || !media) return;
    var v = document.createElement("video");
    v.src = src;
    v.muted = true;
    v.loop = true;
    v.autoplay = false;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");
    v.setAttribute("preload", "none");
    media.appendChild(v);
    card.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
    card.addEventListener("mouseleave", function () {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
    });
  });

  /* 灯箱：图片或视频 */
  var lb = document.getElementById("lightbox");
  var stage = lb.querySelector(".lb-stage");
  var thumbs = lb.querySelector(".lb-thumbs");
  var closeBtn = lb.querySelector(".lb-close");

  function clearStage() {
    stage.innerHTML = "";
  }

  function showImage(list, start) {
    clearStage();
    var img = document.createElement("img");
    img.alt = "";
    img.src = list[start];
    stage.appendChild(img);
    thumbs.innerHTML = "";
    if (list.length > 1) {
      thumbs.style.display = "flex";
      list.forEach(function (src, i) {
        var t = document.createElement("img");
        t.src = src;
        t.alt = "";
        if (i === start) t.className = "active";
        t.addEventListener("click", function (ev) {
          ev.stopPropagation();
          showImage(list, i);
        });
        thumbs.appendChild(t);
      });
    } else {
      thumbs.style.display = "none";
    }
  }

  function showVideo(src) {
    clearStage();
    var v = document.createElement("video");
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute("preload", "metadata");
    stage.appendChild(v);
    thumbs.style.display = "none";
    thumbs.innerHTML = "";
  }

  function openLightbox(videoSrc, list) {
    if (videoSrc) showVideo(videoSrc);
    else showImage(list, 0);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    var v = stage.querySelector("video");
    if (v) { v.pause(); v.src = ""; }
    clearStage();
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".work").forEach(function (card) {
    card.addEventListener("click", function () {
      var raw = card.getAttribute("data-images") || "";
      var list = raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var video = card.getAttribute("data-video");
      if (!video && !list.length) return;
      openLightbox(video, list);
    });
  });

  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lb-stage")) closeLightbox();
  });
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
