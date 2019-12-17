async function popup(element) {
    console.log("element",element);
    //let endpoint = await document.getElementById("img").getAttribute("value");
    let url = "/images/" + element;
    window.open(url);
}
