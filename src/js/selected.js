import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");
  const selectedTrailers = document.querySelectorAll(".selected-trailer");
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );
  const selectedDetailClose = document.querySelector(".selected-detail-close");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");

  const body = document.querySelector("body");

  selectedWorks.forEach((selectedWork) => {
    let hoverEnterAnim = null;
    let hoverLeaveAnim = null;
    const hoverValue = selectedWork.getAttribute("data-selected-value");

    selectedWork.addEventListener("mouseenter", function () {
      // Kill the leave animation if it's running
      if (hoverLeaveAnim) {
        hoverLeaveAnim.kill();
        hoverLeaveAnim = null;
      }

      // Create and play the enter animation
      hoverEnterAnim = createHoverEnterAnimation(selectedWork);

      // Show the related trailer
      selectedTrailers.forEach((trailer) => {
        if (trailer.classList.contains(hoverValue)) {
          gsap.set(trailer, { display: "block" });
        }
      });
    });

    selectedWork.addEventListener("mouseleave", function () {
      // Kill the enter animation if it's running
      if (hoverEnterAnim) {
        hoverEnterAnim.kill();
        hoverEnterAnim = null;
      }

      // Create and play the leave animation
      hoverLeaveAnim = createHoverLeaveAnimation(selectedWork);

      // Hide the related trailer after the animation completes
      hoverLeaveAnim.eventCallback("onComplete", () => {
        selectedTrailers.forEach((trailer) => {
          if (trailer.classList.contains(hoverValue)) {
            gsap.set(trailer, { display: "none" });
          }
        });
      });
    });

    selectedWork.addEventListener("click", function () {
      selectedDetails.forEach((selectedWorkDetail) => {
        if (selectedWorkDetail.classList.contains(hoverValue)) {
          const openDetailAnim = openWorkDetail(
            selectedWorkDetail,
            selectedDetailClose
          );
          selectedDetailClose.onclick = function () {
            openDetailAnim.reverse();
          };
          selectedCloseMap.addEventListener("click", function () {
            openDetailAnim.reverse();
          });
        }
      });
    });

    function createHoverEnterAnimation(selectedWork) {
      const tl = gsap.timeline();

      if (window.screen.width >= 678) {
        tl.to(selectedWork.querySelector(".selected-work-title.main"), {
          translateY: "-100%",
          duration: 0.5,
        })
          .to(
            selectedWork.querySelector(".selected-work-title.desktop"),
            { translateY: "0", duration: 0.3 },
            "<"
          )
          .to(
            selectedWork.querySelectorAll(".selected-work-topic"),
            { translateY: 0, stagger: 0.1, duration: 0.2 },
            "<0.1"
          )
          .to(
            selectedWork.querySelector(".selected-work-underline"),
            { translateY: 0, duration: 0.3 },
            "<0.2"
          )
          .to(
            selectedWork,
            {
              duration: 0.2,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(217, 217, 217, 0) 100%)",
            },
            "<0.1"
          );
      }
      return tl;
    }

    function createHoverLeaveAnimation(selectedWork) {
      const tl = gsap.timeline();

      if (window.screen.width >= 678) {
        tl.to(selectedWork.querySelector(".selected-work-title.main"), {
          translateY: "0%",
          duration: 0.5,
        })
          .to(
            selectedWork.querySelector(".selected-work-title.desktop"),
            { translateY: "100%", duration: 0.3 },
            "<"
          )
          .to(
            selectedWork.querySelectorAll(".selected-work-topic"),
            { translateY: "100%", stagger: 0.1, duration: 0.2 },
            "<0.1"
          )
          .to(
            selectedWork.querySelector(".selected-work-underline"),
            { translateY: 100, duration: 0.3 },
            "<0.2"
          )
          .to(
            selectedWork,
            {
              duration: 0.2,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(217, 217, 217, 0) 100%)",
            },
            "<0.1"
          );
      }
      return tl;
    }
  });

  function openWorkDetail(selectedWorkDetail, selectedDetailClose) {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        gsap.set(selectedWorkDetail, { display: "none" });
        body.classList.remove("no-scroll");
      },
    });
    body.classList.add("no-scroll");
    tl.set(selectedWorkDetail, { display: "block" });
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateX: 0 });
    tl.fromTo(
      selectedWorkDetail.querySelectorAll(".open-anim"),
      { x: 400 },
      { x: 0, stagger: 0.1 },
      "<0.2"
    );
    tl.to(selectedDetailClose, { x: 0 }, "<0.2");
    tl.to(selectedCloseMap, { opacity: 1 }, "<");

    return tl;
  }
});
