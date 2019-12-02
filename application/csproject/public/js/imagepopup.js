function popup(element) {
    let endpoint = document.getElementById("img").getAttribute("value");
    let url = "/images/" + endpoint;
    window.open(url);
}
