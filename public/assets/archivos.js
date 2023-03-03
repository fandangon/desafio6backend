const fs = require("fs");
const encoding = "utf-8"

class Contenedor {
    constructor(path) {
        this.filePath = path;
        this.createFileIfNotExists();
        const data = fs.readFileSync(this.filePath, encoding);
        this.contenedor = JSON.parse(data);
    }

    createFileIfNotExists() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, "[]");
        }
    }

    _saveAll (data) {
        const stringData = JSON.stringify(data, null, 2);
        fs.writeFileSync(this.filePath, stringData ,encoding)
    }
    
    save(object) {
        if (object!=0){
        const lastId = this.contenedor.reduce(
            (acc, el) => { 
            return el.id > acc ? el.id : acc 
            }, 
            0 
        );
        const newId = lastId + 1;
        object.id = newId;
        this.contenedor.push(object);
        this._saveAll(this.contenedor)
        return newId;}
        else{console.log("error")}
    }
   

    getAll() {
        return this.contenedor;
    }
}

module.exports = Contenedor 