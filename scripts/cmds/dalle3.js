const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "dalle3",
    aliases: ["dalle"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    shortDescription: "Generate images by Dalle3",
    longDescription: "Generate images by Dalle3",
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{pn} prompt"
    }
  },

  onStart: async function ({ api, message, args }) {
    try {
      const p = args.join(" ");

      const w = await message.reply("Please wait...");

      //const cookieString = await fs.readFile('dallekey.json', 'utf-8');
       //const cookie = JSON.parse(cookieString);

      const data2 = {
        prompt: p,
        cookie: "1QG3N-fpf1wdNUtCEf78xbRze5S9rnY2i-3UJPD-YpJ-O8nG8iAOyyWbvTM2wAwA9MiUylri9yvRcw9MrJw6Fflxro7yjoC-PP7FrHCGDcR3B5RSIrIq_daduNAuauPonRydk7RkPHS_bZBaS53PzvMD8qBc-wA6eC5fyFEz9Pr0pu7X-PXqIFdWK-wNs2RbfU7-TIocesOBGPX3fz04P0Q509Ec-DAZXd9LUFGYitSM"

        
      };

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('https://project-dallee3.onrender.com/dalle', data2, config);

      if (response.status === 200) {
        const imageUrls = response.data.image_urls.filter(url => !url.endsWith('.svg'));
        const imgData = [];

        for (let i = 0; i < imageUrls.length; i++) {
          const imgResponse = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.unsendMessage(w.messageID);

        await message.reply({
          body: `✅ | Generated`,
          attachment: imgData
        });
      } else {
        throw new Error("Non-200 status code received");
      }
    } catch (error) {
      return message.reply("Redirect failed! Most probably bad prompt.");
    }
  }
}