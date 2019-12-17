async function popup(element) {
    let endpoint = await element.name;
    //let endpoint = await document.getElementById("img").getAttribute("value");
    let url = "/images/" + endpoint;
    window.open(url);
}
