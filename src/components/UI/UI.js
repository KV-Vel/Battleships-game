const boardWrapper = document.querySelector(".board__wrapper");

boardWrapper.addEventListener("click", (e) => {
    const { target } = e;

    if (target.matches(".board__cell")) {
        console.log(target.getAttribute("data-coordinate"));
    }
});
