var fs = require("fs");

const ABSOLUTE_PATH = __dirname + "/../data";
const VARE_FILE = "/varer.json";

class VDB {
  constructor() {
    this.vares = this.openVare(VARE_FILE);
  }
  /* CORE */
  // Save file
  saveFile(fileName, contentString) {
    fs.writeFileSync(ABSOLUTE_PATH + fileName, contentString);
  }

  // Open file
  openVare(fileName) {
    const file = fs.readFileSync(ABSOLUTE_PATH + fileName);
    return JSON.parse(file);
  }

  /* Gemmer et array til JSON filen varer.json */
  saveVare(vare) {
    this.vares.push(vare);
    this.saveFile(VARE_FILE, JSON.stringify(this.vares));
  }

  deleteVare(vare) {
    this.vares = this.vares.filter((x) => x.id != vare.id);
    this.saveFile(VARE_FILE, JSON.stringify(this.vares));
  }

  findUser(vare) {
    return this.vares.filter((x) => vare.email == x.email);
  }
  findVare(vare) {
    return this.vares.find((x) => vare.id == x.id);
  }
}

// exporter VDB så fs metoderne kan bruges i andre sammenhæng
module.exports = new VDB();
