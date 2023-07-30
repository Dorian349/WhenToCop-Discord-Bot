const axios = require("axios");
const cheerio = require("cheerio");

module.exports.getUpcomingShoes = async function (channel, client){

    axios.get("https://www.whentocop.fr/drops").then(async (response) => {
        const $ = cheerio.load(response.data);

        for (let i = 0; i < $(".infinite-scroll-component > div").first().find('a').length; i++) {
            let shoeUrl = $($(".infinite-scroll-component > div").first().find('a')[i]).attr("href");

            let customPageData = await axios.get("https://www.whentocop.fr/" + shoeUrl);
            const data = cheerio.load(customPageData.data);

            let modele = "";
            data(".slug__InfosTextContainer-sc-7auole-8").find("h1, h2").each(function(i, elm) {
                modele += ($(this).text()) + " ";
            });

            let resellType = data(".slug__ResellIndexContainer-sc-7auole-18").find("p").first().text().trim();
            let retailPrice = data(".DropInfo__PriceContainer-sc-1okpqbg-2").find("p").first().text().trim();
            let resellPrice = data(".slug__InfosTextImportant-sc-7auole-15").text().trim();

            let imageUrl = data("meta[name='twitter:image']").attr("content")

            let date = "";
            data(".DropInfo__ContentDateContainer-sc-1okpqbg-3").find("p").each(function(i, elm) {
                date += ($(this).text()) + " ";
            });

            let retailersList = [];

            data(".Retailer__Container-sc-l6npmq-0").each(function(i, elm) {
                retailersList.push([$(this).find("img").attr("alt"), $(this).find("a").attr("href")])
            });

            const fieldDesc = [""];
            for (let j = 0; j < retailersList.length; j++) {
                if((fieldDesc[fieldDesc.length - 1] + "[" + retailersList[j][0] + "](" + retailersList[j][1] + ")" + " -").length >= 980){
                    fieldDesc.push("[" + retailersList[j][0] + "](" + retailersList[j][1] + ")" + " - ")
                }
                else{
                    fieldDesc[fieldDesc.length - 1] += "[" + retailersList[j][0] + "](" + retailersList[j][1] + ")" + " - ";
                }
            }

            channel.send({ embeds: [client.buildEmbed(null).setTitle("👟 " + modele).setURL("https://www.whentocop.fr/" + shoeUrl)
                        .setThumbnail(imageUrl)
                        .addFields({ name: "Type de resell", value: resellType.length > 0 ? resellType.charAt(0).toUpperCase() + resellType.slice(1) : "Inconnu", inline: true},
                            { name: "Prix de retail", value: retailPrice.length > 0 ? retailPrice : "Inconnu", inline: true},
                            { name: "Prix de resell", value: resellPrice.length > 0 ? resellPrice : "Inconnu", inline: true},
                            { name: "Date", value: date ?? "Inconnu", inline: true},
                        ...fieldDesc.map((el) => { return { name: "Où acheter ?", value: el.slice(0, -3), inline: true} }))] })
        }
    })

}

module.exports.getUpcomingDate = async function (){

    let pageData = await axios.get("https://www.whentocop.fr/drops");
    const $ = cheerio.load(pageData.data);
    return $(".infinite-scroll-component > div").first().find('div > p').first().text();

}